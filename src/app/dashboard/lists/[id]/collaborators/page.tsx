'use client';

import { useParams } from 'next/navigation';
import { useList } from '@/util/hooks/useList';

export default function ListDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const { data, isLoading, isError } = useList(id);

  if (isLoading) return <p>Loading...</p>;
  if (isError || !data) return <p>Error loading list</p>;

  const list = data.data;

  return (
    <div>
      <h1 className="text-2xl font-semibold">{list.title}</h1>
    </div>
  );
}
