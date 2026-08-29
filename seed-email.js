const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const emails = ['thond.topmedia.vn@gmail.com'];
  
  for (const email of emails) {
    const existing = await prisma.allowedEmail.findUnique({
      where: { email }
    });
    
    if (!existing) {
      await prisma.allowedEmail.create({
        data: {
          email,
          role: 'SUPER_ADMIN'
        }
      });
      console.log(`Added ${email} to AllowedEmail`);
    } else {
      console.log(`${email} already exists`);
    }
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
