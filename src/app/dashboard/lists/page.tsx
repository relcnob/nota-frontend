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

  const [userLists, setUserLists] = useState<List[]>([]);
  const [collaboratorLists, setCollaboratorLists] = useState<List[]>([]);
  const [lists, setLists] = useState<List[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLists = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      const res = await fetch('/api/lists?page=1&limit=10');
      const response = await res.json();
      if (!res.ok) {
        console.error('Failed to fetch lists:', response.error);
        setLoading(false);
      } else {
        const lists: List[] = response.data.data;
        const ownedByUser = lists.filter((list: List) => list.ownerId === user?.id);
        const collaboratedWithUser = lists.filter((list: List) =>
          list.collaborators?.some((collab) => collab.userId === user?.id),
        );
        setLists(lists);
        setUserLists(ownedByUser);
        setCollaboratorLists(collaboratedWithUser);
        setMeta(response.data.meta);
        setLoading(false);

        console.log('User Lists:', ownedByUser);
        console.log('Collaborator Lists:', collaboratedWithUser);
      }
    };

    fetchLists();
  }, [user]);

  const handleDelete = async (listId: string) => {
    if (!user) return;
    console.log('Deleting list with ID:', listId);
    /*  const res = await fetch(`/api/lists/${listId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      setUserLists((prev) => prev.filter((list) => list.id !== listId));
      setCollaboratorLists((prev) => prev.filter((list) => list.id !== listId));
    } else {
      console.error('Failed to delete list');
    } */
  };

  return (
    <div className="gb-background mx-auto w-full max-w-screen-xl px-4 py-6 sm:px-8 lg:px-4">
      <h1 className="mb-12 text-3xl font-semibold">{`Your Lists (${lists.length})`}</h1>
      <div className="grid grid-cols-1 gap-6">
        {loading || !user ? (
          <p>Loading...</p>
        ) : lists.length > 0 ? (
          <>
            {lists.length > 0 && (
              <div className="mb-6 grid grid-cols-1 gap-4">
                {lists.map((list) => (
                  <ListItem list={list} key={list.id} onDelete={() => handleDelete(list.id)} />
                ))}
              </div>
            )}
          </>
        ) : (
          <p>No lists found.</p>
        )}
      </div>
    </div>
  );
}
