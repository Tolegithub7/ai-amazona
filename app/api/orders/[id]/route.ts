import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const orderId = params.id;

    // Fetch the order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // If order doesn't exist, return 404
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check if user is authorized to view this order
    // Skip this check for admin users
    if (order.userId !== userId && session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "You are not authorized to view this order" },
        { status: 403 }
      );
    }

    // Format the order data for the response
    const formattedOrder = {
      id: order.id,
      status: order.status,
      total: order.total,
      shippingAddress: order.shippingAddress,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items: order.items.map((item) => ({
        id: item.id,
        name: item.product.name,
        price: item.price,
        quantity: item.quantity,
        image: item.product.images[0] || null,
      })),
    };

    return NextResponse.json(formattedOrder);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}