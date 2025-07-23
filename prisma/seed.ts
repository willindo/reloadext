import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
      password: 'hashedpassword', // In real apps, hash this
    },
  });

  await prisma.product.createMany({
    data: [
      {
        name: 'Product 1',
        description: 'This is Product 1',
        price: 19.99,
        userId: user.id,
      },
      {
        name: 'Product 2',
        description: 'Another product description',
        price: 39.99,
        userId: user.id,
      },
    ],
  });

  console.log('✅ Seed complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
