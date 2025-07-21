'use client';

import ListItem from '@/components/ui/list-item';
import { List } from '@/util/types/list';
import { useAuth } from '@/context/auth-context';
import { useEffect, useState } from 'react';
export default function DashboardPage() {
  const { user } = useAuth();

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
      const response = await res.json();
      if (!res.ok) {
        console.error('Failed to fetch lists:', response.error);
        setLoading(false);
      } else {
        console.log(response);
        setLists(response.data.data);
        setMeta(response.data.meta);
        setLoading(false);
      }
    };

    fetchLists();
  }, []);

  return (
    <div className="gb-background mx-auto w-full px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-3xl font-semibold">Lists</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading && <p>Loading...</p>}
        {!loading && lists && lists.length === 0 && <p>No lists found.</p>}
        {user &&
          !loading &&
          lists &&
          lists.length > 0 &&
          lists.map((list: List) => <ListItem list={list} key={list.id} userId={user.id} />)}
      </div>
    </div>
  );
}
