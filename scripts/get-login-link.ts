import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error('❌ Vui lòng nhập email. Ví dụ: npm run get-link admin@gmail.com');
    process.exit(1);
  }

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) {
    console.error(`❌ Không tìm thấy user với email: ${email}`);
    process.exit(1);
  }

  const sessionToken = crypto.randomBytes(32).toString('hex');
  const expires = new Date();
  expires.setDate(expires.getDate() + 30); // 30 days

  await prisma.session.create({
    data: {
      sessionToken,
      userId: user.id,
      expires,
    }
  });

  const baseUrl = process.env.AUTH_URL || 'http://localhost:3000';
  console.log(`\n✅ Link đăng nhập trực tiếp (Bypass SMTP) cho ${email}:`);
  console.log(`\n👉 ${baseUrl}/api/auth/set-session?token=${sessionToken}\n`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
