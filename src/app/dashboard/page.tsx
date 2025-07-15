'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <div className="max-w-2xl mx-auto py-12">
      <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>
      {/* ...Your content... */}

      <Button variant="destructive" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
}