import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

export async function getSession() {
  return auth();
}

export async function requireStaff() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }
  return session.user;
}

export async function requireOwner() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }
  if (session.user.role !== 'OWNER') {
    redirect('/admin');
  }
  return session.user;
}
