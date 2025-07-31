import { formatRelativeDate } from '@/util/helpers/formatRelativeDate';
import { Item } from '@/util/types/item';
import { Checkbox } from './checkbox';
import React, { useState } from 'react';
import { Badge } from './badge';
import { Trash } from 'lucide-react';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
type Props = {
  item: Partial<Item> | Item;
  onUpdate: (updatedItem: Partial<Item>) => void;
};

export function ItemElement({ item, onUpdate }: Props) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingQty, setIsEditingQty] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);

  const [name, setName] = useState(item.name);
  const [quantity, setQuantity] = useState(item.quantity ?? 1);
  const [category, setCategory] = useState(item.category || '');
  const [notes, setNotes] = useState(item.notes || '');

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
  const handleCategorySubmit = () => {
    setIsEditingCategory(false);
    if (item.category !== category) {
      onUpdate({ id: item.id, category });
    }
  };

  const handleNotesSubmit = () => {
    setIsEditingNotes(false);
    if (item.notes !== notes) {
      onUpdate({ id: item.id, notes });
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
    <div className="flex w-full items-center rounded-sm border py-2 pr-2 pl-4 hover:bg-gray-50">
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
            className="w-48 rounded border px-2 py-0 text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleNameSubmit}
            onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
          />
        ) : (
          <div
            className={`max-w-xs cursor-pointer font-medium ${!item.name ? 'text-gray-400' : ''}`}
            onClick={() => setIsEditingName(true)}
          >
            {item.name || 'Untitled'}
          </div>
        )}
        {item.createdAt && (
          <div className="text-xs text-gray-500">{formatRelativeDate(item.createdAt)}</div>
        )}
      </div>
      <div className="ml-4 flex-1">
        {isEditingNotes ? (
          <input
            autoFocus
            className="w-48 rounded border px-2 py-0 text-sm"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={handleNotesSubmit}
            onKeyDown={(e) => e.key === 'Enter' && handleNotesSubmit()}
          />
        ) : (
          <div
            className={`max-w-sm cursor-pointer px-2 text-xs font-medium ${!item.notes ? 'text-gray-400' : ''}`}
            onClick={() => setIsEditingNotes(true)}
          >
            {item.notes || 'No notes'}
          </div>
        )}
      </div>
      <div className="ml-4 flex-1">
        {isEditingCategory ? (
          <input
            autoFocus
            className="w-48 rounded border px-2 py-0 text-sm"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            onBlur={handleCategorySubmit}
            onKeyDown={(e) => e.key === 'Enter' && handleCategorySubmit()}
          />
        ) : (
          <Badge
            variant={item.category ? 'default' : 'outline'}
            className={`max-w-sm cursor-pointer text-xs font-medium`}
            onClick={() => setIsEditingCategory(true)}
          >
            {item.category || 'No category'}
          </Badge>
        )}
      </div>

      <div className="ml-4 text-sm text-gray-500">
        {isEditingQty ? (
          <input
            autoFocus
            type="number"
            className="w-12 rounded border px-2 py-1 text-sm"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            onBlur={handleQtySubmit}
            onKeyDown={(e) => e.key === 'Enter' && handleQtySubmit()}
          />
        ) : (
          <span className="flex w-[48px] cursor-pointer" onClick={() => setIsEditingQty(true)}>
            x {item.quantity ?? 1}
          </span>
        )}
      </div>
      <Popover open={isDeleteOpen} onOpenChange={setDeleteOpen}>
        <PopoverTrigger>
          <div className="group border-sidebar hover:border-border flex cursor-pointer items-center justify-center rounded-md border p-2 transition-colors">
            <Trash className="group-hover:stroke-destructive stroke-gray-500 transition" />
          </div>
        </PopoverTrigger>
        <PopoverContent>
          <div>
            <p className="mb-4 justify-center text-center text-sm text-gray-500">
              Are you sure you want to delete this list?
            </p>
            <div className="grid grid-cols-2 gap-6">
              <Button
                className="cursor-pointer"
                variant="outline"
                size="sm"
                onClick={() => setDeleteOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="cursor-pointer"
                variant="destructive"
                size="sm"
                onClick={() => {
                  setDeleteOpen(false);
                }}
              >
                <Trash className="stroke-white" />
                Delete
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
