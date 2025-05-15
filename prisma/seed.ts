/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from '../lib/generated/prisma';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  try {
    // Create admin user
    const adminPassword = await hash('admin123', 12);
    // Keep admin reference for potential future use (e.g., creating related data)
    const admin = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@example.com',
        password: adminPassword,
        role: 'ADMIN',
      },
    });

    // Create regular user
    const userPassword = await hash('user123', 12);
    // Keep user reference for potential future use (e.g., creating related data)
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john@example.com',
        password: userPassword,
        role: 'USER',
      },
    });

    // Create categories
    const categories = await Promise.all([
      prisma.category.create({
        data: {
          name: 'T-Shirts',
          description: 'Comfortable and stylish t-shirts for all occasions',
          image: '/images/c-tshirts.jpg',
        },
      }),
      prisma.category.create({
        data: {
          name: 'Jeans',
          description: 'High-quality denim jeans for men and women',
          image: '/images/c-jeans.jpg',
        },
      }),
      prisma.category.create({
        data: {
          name: 'Shoes',
          description: 'Trendy and comfortable footwear for every style',
          image: '/images/c-shoes.jpg',
        },
      }),
    ]);

    // Create products for each category
    // T-Shirts
    await prisma.product.createMany({
      data: [
        {
          name: 'Classic White T-Shirt',
          description: 'A timeless white t-shirt made from premium cotton',
          price: 29.99,
          images: ['/images/p11-1.jpg', '/images/p11-2.jpg'],
          stock: 100,
          categoryId: categories[0].id,
        },
        {
          name: 'Graphic Print T-Shirt',
          description: 'Modern graphic t-shirt with unique design',
          price: 34.99,
          images: ['/images/p12-1.jpg', '/images/p12-2.jpg'],
          stock: 75,
          categoryId: categories[0].id,
        },
      ],
    });

    // Jeans
    await prisma.product.createMany({
      data: [
        {
          name: 'Classic Blue Jeans',
          description: 'Traditional straight-fit blue jeans',
          price: 59.99,
          images: ['/images/p21-1.jpg', '/images/p21-2.jpg'],
          stock: 50,
          categoryId: categories[1].id,
        },
        {
          name: 'Slim Fit Black Jeans',
          description: 'Modern slim-fit jeans in sleek black',
          price: 64.99,
          images: ['/images/p22-1.jpg', '/images/p22-2.jpg'],
          stock: 60,
          categoryId: categories[1].id,
        },
      ],
    });

    // Shoes
    await prisma.product.createMany({
      data: [
        {
          name: 'Classic Sneakers',
          description: 'Versatile and comfortable sneakers for everyday wear',
          price: 79.99,
          images: ['/images/p31-1.jpg', '/images/p31-2.jpg'],
          stock: 40,
          categoryId: categories[2].id,
        },
        {
          name: 'Running Shoes',
          description: 'High-performance running shoes with advanced cushioning',
          price: 89.99,
          images: ['/images/p32-1.jpg', '/images/p32-2.jpg'],
          stock: 35,
          categoryId: categories[2].id,
        },
      ],
    });

    console.log('Seed data created successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 