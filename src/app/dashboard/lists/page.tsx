'use client';

import { useEffect, useState } from 'react';
export default function DashboardPage() {
  type Meta = {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  //TODO: Fetch lists
  const [lists, setLists] = useState([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLists = async () => {
      const res = await fetch('/api/lists?page=1&limit=10');
      const data = await res.json();
      if (!res.ok) {
        console.error('Failed to fetch lists:', data.error);
        setLoading(false);
      } else {
        //TODO: NAMING
        console.log(data);
        setLists(data.data.data);
        setMeta(data.data.meta);
        setLoading(false);
      }
    };

    fetchLists();
  }, []);

  return (
    <div className="mx-auto w-full py-6">
      <h1 className="mb-6 text-3xl font-semibold">Lists</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading && <p>Loading...</p>}
        {!loading && lists && lists.length === 0 && <p>No lists found.</p>}
        {!loading &&
          lists &&
          lists.length > 0 &&
          lists.map((list: any) => (
            <div key={list.id} className="rounded-lg border p-4 shadow-sm">
              <h2 className="text-xl font-bold">{list.name}</h2>
              <p>{list.description}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
