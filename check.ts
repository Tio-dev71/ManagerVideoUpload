import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function run() {
  const user = await prisma.user.findUnique({ where: { email: 'kevinkhanh1984@gmail.com' } });
  console.log('USER:', user);
  const allowed = await prisma.allowedEmail.findUnique({ where: { email: 'kevinkhanh1984@gmail.com' } });
  console.log('ALLOWED:', allowed);
  await prisma.$disconnect();
}
run();
