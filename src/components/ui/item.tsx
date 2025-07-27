import { formatRelativeDate } from '@/util/helpers/formatRelativeDate';
import { Item } from '@/util/types/item';
import { Checkbox } from './checkbox';
import React, { useState } from 'react';

type Props = {
  item: Item;
  onUpdate: (updatedItem: Partial<Item>) => void;
};

export function ItemElement({ item, onUpdate }: Props) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingQty, setIsEditingQty] = useState(false);

  const [name, setName] = useState(item.name);
  const [quantity, setQuantity] = useState(item.quantity ?? 1);

  const handleNameSubmit = () => {
    setIsEditingName(false);
    if (name !== item.name) {
      onUpdate({ id: item.id, name });
    }
  };

  const handleQtySubmit = () => {
    setIsEditingQty(false);
    if (quantity !== item.quantity) {
      onUpdate({ id: item.id, quantity });
    }
  };

  const handleCompletedSubmit = (completed: boolean) => {
    onUpdate({
      id: item.id,
      completed,
      completedAt: completed ? new Date().toISOString() : undefined,
    });
  };

  return (
    <div className="flex w-full items-center rounded-sm border px-4 py-2 hover:bg-gray-50">
      <Checkbox
        className="h-6 w-6 cursor-pointer"
        checked={item.completed}
        onCheckedChange={(v: boolean) => {
          handleCompletedSubmit(v);
        }}
      />

      <div className="ml-4 flex-1">
        {isEditingName ? (
          <input
            autoFocus
            className="w-64 rounded border px-2 py-0 text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleNameSubmit}
            onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
          />
        ) : (
          <div className="cursor-pointer font-medium" onClick={() => setIsEditingName(true)}>
            {item.name}
          </div>
        )}
        <div className="text-sm text-gray-500">{formatRelativeDate(item.createdAt)}</div>
      </div>

      <div className="ml-4 text-sm text-gray-500">
        {isEditingQty ? (
          <input
            autoFocus
            type="number"
            className="w-16 rounded border px-2 py-1 text-sm"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            onBlur={handleQtySubmit}
            onKeyDown={(e) => e.key === 'Enter' && handleQtySubmit()}
          />
        ) : (
          <span className="cursor-pointer" onClick={() => setIsEditingQty(true)}>
            x {item.quantity ?? 1}
          </span>
        )}
      </div>
    </div>
  );
}
