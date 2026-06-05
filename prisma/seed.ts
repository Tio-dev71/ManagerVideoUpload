import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    console.error('❌ ADMIN_EMAIL environment variable is required for seeding.');
    process.exit(1);
  }

  console.log(`🌱 Seeding database...`);

  // Create default workspace
  const workspace = await prisma.workspace.upsert({
    where: { id: 'default-workspace' },
    update: {},
    create: {
      id: 'default-workspace',
      name: 'Default Workspace',
    },
  });

  console.log(`✅ Default workspace created: ${workspace.id}`);

  // Create or update admin user
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: 'SUPER_ADMIN', workspaceId: workspace.id },
    create: {
      email: adminEmail,
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
      emailVerified: new Date(),
      workspaceId: workspace.id,
    },
  });

  console.log(`✅ Admin user created: ${admin.email} (${admin.id})`);

  // Add admin email to allowed emails
  await prisma.allowedEmail.upsert({
    where: { email: adminEmail },
    update: { role: 'SUPER_ADMIN', workspaceId: workspace.id },
    create: {
      email: adminEmail,
      role: 'SUPER_ADMIN',
      invitedById: admin.id,
      workspaceId: workspace.id,
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
