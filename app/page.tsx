import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

export default async function Home() {
  const session = { user: { email: 'mock@admin.com', name: 'Mock Admin', role: 'SUPER_ADMIN' } }; // await auth();
  
  if (session) {
    redirect('/dashboard');
  } else {
    redirect('/login');
  }
}
