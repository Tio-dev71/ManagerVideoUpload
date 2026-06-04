import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    console.error('❌ ADMIN_EMAIL environment variable is required for seeding.');
    process.exit(1);
  }

  console.log(`🌱 Seeding database...`);

  // Create or update admin user
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: 'ADMIN' },
    create: {
      email: adminEmail,
      name: 'Admin',
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  });

  console.log(`✅ Admin user created: ${admin.email} (${admin.id})`);

  // Add admin email to allowed emails
  await prisma.allowedEmail.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      role: 'ADMIN',
      invitedById: admin.id,
    },
  });

  console.log(`✅ Admin email added to allowed list`);
  console.log(`\n🎉 Seeding complete!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
