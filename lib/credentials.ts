import prisma from './db';

export async function getCredentials() {
  const settings = await prisma.systemSetting.findMany({
    where: {
      key: {
        in: ['META_APP_ID', 'META_APP_SECRET', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET']
      }
    }
  });

  const settingsMap = settings.reduce((acc: Record<string, string>, curr: any) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  return {
    META_APP_ID: settingsMap.META_APP_ID || process.env.META_APP_ID,
    META_APP_SECRET: settingsMap.META_APP_SECRET || process.env.META_APP_SECRET,
    GOOGLE_CLIENT_ID: settingsMap.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: settingsMap.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET,
  };
}
