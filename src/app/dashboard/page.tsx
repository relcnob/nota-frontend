'use client';

import { Button } from '@/components/ui/button';
import DashboardMetric from '@/components/ui/dashboard-metric';
import { useAuth } from '@/context/auth-context';
import { useDashboardMetrics } from '@/util/hooks/useMetrics';
import { History, Handshake, ListCheck, Pen, LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [userId, setUserId] = useState<string>();
  const { data, isLoading } = useDashboardMetrics(userId);

  useEffect(() => {
    if (user) {
      setUserId(user.id);
    }
  }, [user]);

  return (
    <div className="flex h-full w-full flex-col gap-4 py-4">
      <h1 className="mb-6 text-3xl font-semibold">Dashboard</h1>
      {isLoading && (
        <div className="mt-6 flex flex-col items-center justify-center gap-2">
          <LoaderCircle size={32} className="animate-spin" />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      )}
      {!isLoading && data && (
        <>
          <section className="grid w-full grid-cols-12 gap-4">
            <DashboardMetric
              title="Total Lists"
              description="The total number of available lists"
              metric={data.totalLists.toString()}
              icon={<ListCheck size={24} />}
            />
            <DashboardMetric
              title="Your lists"
              description="Created by you."
              metric={data.createdByUser.toString()}
              icon={<Pen size={24} />}
            />

            <DashboardMetric
              title="Updated in past day"
              description="Lists updated in the past 24 hours."
              metric={data.updatedInPastDay.toString()}
              icon={<History size={24} />}
            />

            <DashboardMetric
              title="Shared with you"
              description="Lists which you are collaborating on."
              metric={data.collaboratedOn.toString()}
              icon={<Handshake size={24} />}
            />
          </section>
          <section className="grid w-full flex-grow grid-cols-12 gap-4">
            <div className="border-muted col-span-9 flex w-full flex-grow flex-col rounded-lg border p-8">
              <h2 className="w-full text-lg font-semibold">Recently updated lists</h2>
              <Button
                asChild
                variant="outline"
                className="align-self-end mt-auto ml-auto w-fit cursor-pointer justify-self-end px-4"
              >
                <Link href="/lists">View all</Link>
              </Button>
            </div>
            <div className="border-muted col-span-3 flex w-full flex-grow flex-col rounded-lg border p-8">
              <h2 className="text-lg font-semibold">Most collaborated with</h2>
              {data.commonCollaborators.length > 0 ? (
                <section>
                  {data.commonCollaborators.map((collaborator) => (
                    <div key={collaborator.id} className="flex items-center justify-between py-2">
                      <p className="text-sm">{collaborator.username}</p>
                      <p className="text-muted-foreground text-sm">{collaborator.email}</p>
                    </div>
                  ))}
                </section>
              ) : (
                <p className="text-muted-foreground text-sm">No collaborators found.</p>
              )}
            </div>
          </section>
        </>
      )}
      {!isLoading && !data && (
        <div className="flex flex-col items-center justify-center gap-2">
          <p className="text-muted-foreground text-sm">No data.</p>
        </div>
      )}
    </div>
  );
}
