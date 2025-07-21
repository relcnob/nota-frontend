import { List } from '@/util/types/list';
import React from 'react';

function ListItem({ list, userId }: { list: List; userId: string }) {
  return (
    <div
      className={`bg-background flex flex-row rounded-lg border p-4 ${userId === list.owner.id ? 'border-blue-500' : 'border-border'}`}
    >
      <div className="ml-4">
        <h2 className="text-xl font-bold">{list.title}</h2>
        {list.description && <p className="text-sm text-gray-600">{list.description}</p>}
        <p className="text-sm text-gray-500">Owner: {list.owner.username}</p>
        <p className="text-sm text-gray-500">
          Created at: {new Date(list.createdAt).toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-500">
          Updated at: {new Date(list.updatedAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

export default ListItem;
