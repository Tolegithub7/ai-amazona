import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";
import { auth } from "@/auth";
import { z } from "zod";

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Validation schema for the request body
const createPaymentIntentSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      price: z.number().positive(),
      quantity: z.number().int().positive(),
      image: z.string().optional(),
    })
  ),
  shippingInfo: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string().optional(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
    country: z.string(),
  }),
});

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user
    const session = await auth();
    const userId = session?.user?.id;

    // Parse and validate the request body
    const body = await request.json();
    const validationResult = createPaymentIntentSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const { items, shippingInfo } = validationResult.data;

    // Calculate order amount
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = 9.99; // Fixed shipping cost
    const tax = subtotal * 0.08; // 8% tax
    const total = Math.round((subtotal + shipping + tax) * 100); // Stripe expects amount in cents

    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: "usd",
      // Save the customer if authenticated, otherwise use the email from shipping info
      ...(userId ? { customer: await getOrCreateStripeCustomer(userId) } : {}),
      metadata: {
        userId: userId || "guest",
        items: JSON.stringify(items.map(item => ({ id: item.id, quantity: item.quantity }))),
        shippingInfo: JSON.stringify(shippingInfo),
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}

// Helper function to get or create a Stripe customer for a user
async function getOrCreateStripeCustomer(userId: string): Promise<string> {
  // Get user data from the database
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw new Error("User not found");

  // Check if user already has a Stripe customer ID in your database
  // This would require adding a stripeCustomerId field to your User model
  // For now, we'll just create a new customer every time
  const customer = await stripe.customers.create({
    email: user.email,
    name: user.name || undefined,
    metadata: {
      userId,
    },
  });

  // In a real application, you would save the customer.id to the user record
  // await prisma.user.update({
  //   where: { id: userId },
  //   data: { stripeCustomerId: customer.id },
  // });

  return customer.id;
}