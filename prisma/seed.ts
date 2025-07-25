import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Seeding database...');

  // Upsert users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'demo@example.com' },
      update: {},
      create: {
        email: 'demo@example.com',
        name: 'Demo User',
        password: 'demo123', // hash in real apps
      },
    }),
    prisma.user.upsert({
      where: { email: 'alice@example.com' },
      update: {},
      create: {
        email: 'alice@example.com',
        name: 'Alice',
        password: 'alice123',
      },
    }),
    prisma.user.upsert({
      where: { email: 'bob@example.com' },
      update: {},
      create: {
        email: 'bob@example.com',
        name: 'Bob',
        password: 'bob123',
      },
    }),
  ]);

  const [demoUser, alice, bob] = users;

  // Create products
  try {
    
    await prisma.product.createMany({
      data: [
        {
          name: 'Demo Product 1',
          description: 'Product from demo user',
          price: 29.99,
          userId: demoUser.id,
        },
        {
          name: 'Demo Product 2',
          description: 'Another product from demo',
          price: 19.99,
          userId: demoUser.id,
        },
        {
          name: 'Alice\'s Product',
          description: 'Cool gadget by Alice',
          price: 49.99,
          userId: alice.id,
        },
        {
          name: 'Bob\'s Tool',
          description: 'Utility item from Bob',
          price: 15.0,
          userId: bob.id,
        },
      ],
      skipDuplicates: true, // add this for safety
    });
  
    console.log('✅ Products seeded!');
  } catch (e) {
    console.error('❌ Error creating products:', e);
  }

  // Print user info to console
  console.log('✅ Multi-user seed complete');
  console.table(
    users.map((u) => ({
      name: u.name,
      email: u.email,
      id: u.id,
    }))
  );
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
