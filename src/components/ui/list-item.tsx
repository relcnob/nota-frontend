import { List } from '@/util/types/list';
import React from 'react';
import { formatRelativeDate } from '@/util/helpers/formatRelativeDate';
function ListItem({ list }: { list: List }) {
  return (
    <div className={`bg-background flex flex-row rounded-lg border px-4 py-2`}>
      <div className="ml-4 flex w-full flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-4">
          <h2 className="w-48 text-xl font-bold">{list.title}</h2>
          {list.description && <p className="w-36 text-sm text-gray-600">{list.description}</p>}
        </div>
        <div className="flex flex-col items-end">
          <p className="text-sm text-gray-500">Created: {formatRelativeDate(list.createdAt)}</p>
          {list.updatedAt && list.createdAt !== list.updatedAt && (
            <p className="text-sm text-gray-500">Updated: {formatRelativeDate(list.updatedAt)}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ListItem;
