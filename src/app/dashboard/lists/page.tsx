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
  const [userLists, setUserLists] = useState<List[]>([]);
  const [collaboratorLists, setCollaboratorLists] = useState<List[]>([]);
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

  return (
    <div className="gb-background mx-auto w-full px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-3xl font-semibold">Lists</h1>
      <div className="grid grid-cols-1 gap-6">
        {loading || !user ? (
          <p>Loading...</p>
        ) : collaboratorLists.length > 0 || userLists.length > 0 ? (
          <>
            {userLists.length > 0 && (
              <div>
                <h2>{`Your Lists (${userLists.length})`}</h2>
                {userLists.map((list) => (
                  <ListItem list={list} key={list.id} />
                ))}
              </div>
            )}
            {collaboratorLists.length > 0 && (
              <div>
                <h2>{`Shared Lists (${collaboratorLists.length})`}</h2>
                {collaboratorLists.map((list) => (
                  <ListItem list={list} key={list.id} />
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
