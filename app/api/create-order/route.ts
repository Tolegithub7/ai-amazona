import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Stripe from "stripe";
import { z } from "zod";

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Validation schema for the request body
const createOrderSchema = z.object({
  paymentIntentId: z.string(),
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
    const validationResult = createOrderSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const { paymentIntentId, shippingInfo } = validationResult.data;

    // Retrieve the payment intent from Stripe to get details
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json(
        { error: "Payment has not been completed successfully" },
        { status: 400 }
      );
    }

    // Parse the items from the payment intent metadata
    const items = JSON.parse(paymentIntent.metadata.items || "[]");
    
    // Format the shipping address for storage
    const formattedAddress = [
      shippingInfo.address,
      shippingInfo.city,
      shippingInfo.state,
      shippingInfo.zip,
      shippingInfo.country
    ].filter(Boolean).join(", ");

    // Create the order in the database
    const order = await prisma.order.create({
      data: {
        userId: userId || "guest", // Handle guest checkout
        total: paymentIntent.amount / 100, // Convert back from cents
        status: "PROCESSING",
        shippingAddress: formattedAddress,
        paymentIntent: paymentIntentId,
        items: {
          create: await Promise.all(
            items.map(async (item: { id: string; quantity: number }) => {
              // Get the product details from the database
              const product = await prisma.product.findUnique({
                where: { id: item.id },
              });
              
              if (!product) {
                throw new Error(`Product with ID ${item.id} not found`);
              }
              
              return {
                productId: item.id,
                quantity: item.quantity,
                price: product.price,
              };
            })
          ),
        },
      },
    });

    return NextResponse.json({ orderId: order.id });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}