import { notFound } from 'next/navigation';

type ListPageProps = {
  params: { id: string };
};

export default async function ListPage({ params }: ListPageProps) {
  const { id } = params;

  // Optionally fetch data based on ID
  // const res = await fetch(`https://your-api.com/lists/${id}`);
  // const list = await res.json();

  const list = { id, title: `List for ID: ${id}` };

  if (!list) return notFound();

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">{list.title}</h1>
      <p>
        This is the page for collaborators of list ID: <strong>{id}</strong>
      </p>
    </div>
  );
}
