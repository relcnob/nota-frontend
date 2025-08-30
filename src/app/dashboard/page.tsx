'use client';

import { Button } from '@/components/ui/button';
import DashboardMetric from '@/components/ui/dashboard-metric';
import { History, Handshake, ListCheck, Pen } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="flex h-full w-full flex-col gap-4 py-4">
      <h1 className="mb-6 text-3xl font-semibold">Dashboard</h1>
      <section className="grid w-full grid-cols-12 gap-4">
        <DashboardMetric
          title="Total Lists"
          description="The total number of lists created."
          metric="12"
          icon={<ListCheck size={24} />}
        />

        <DashboardMetric
          title="Updated in past day"
          description="Lists updated in the past 24 hours."
          metric="12"
          icon={<History size={24} />}
        />

        <DashboardMetric
          title="Shared with you"
          description="Lists which you are collaborating on."
          metric="5"
          icon={<Handshake size={24} />}
        />

        <DashboardMetric
          title="Your lists"
          description="Created by you."
          metric="8"
          icon={<Pen size={24} />}
        />
      </section>
      <section className="grid w-full flex-grow grid-cols-12 gap-4">
        <div className="border-muted col-span-8 flex w-full flex-grow flex-col rounded-lg border p-8">
          <h2 className="w-full text-lg font-semibold">Recently updated lists</h2>
          <Button
            asChild
            variant="outline"
            className="align-self-end mt-auto ml-auto w-fit cursor-pointer justify-self-end px-4"
          >
            <Link href="/lists">View all</Link>
          </Button>
        </div>
        <div className="border-muted col-span-4 flex w-full flex-grow flex-col rounded-lg border p-8">
          <h2 className="text-lg font-semibold">Most collaborated with</h2>
        </div>
      </section>
    </div>
  );
}
