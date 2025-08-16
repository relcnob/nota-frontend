import { formatRelativeDate } from '@/util/helpers/formatRelativeDate';
import { Item } from '@/util/types/item';
import { Checkbox } from './checkbox';
import React, { useState } from 'react';
import { Badge } from './badge';
import { Pen, Trash } from 'lucide-react';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
type Props = {
  item: Partial<Item> | Item;
  onUpdate: (updatedItem: Partial<Item>) => void;
  onDelete: (id: string) => void;
};

export function ItemElement({ item, onUpdate, onDelete }: Props) {
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
    if (category !== item.category) {
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
    <div className="grid w-full grid-cols-24 items-center rounded-sm border py-2 pr-2 pl-4 hover:bg-gray-50">
      <Checkbox
        className="col-span-1 h-6 w-6 cursor-pointer justify-self-center"
        checked={item.completed}
        onCheckedChange={(v: boolean) => {
          handleCompletedSubmit(v);
        }}
      />
      <div className="col-span-6 ml-4 flex-1">
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

      <div className="col-span-8 ml-4 flex-1">
        {isEditingNotes ? (
          <input
            autoFocus
            className="w-full rounded border px-2 py-0 text-sm"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={handleNotesSubmit}
            onKeyDown={(e) => e.key === 'Enter' && handleNotesSubmit()}
          />
        ) : notes.length > 76 ? (
          <Popover>
            <PopoverTrigger asChild>
              <div className={`font-medium} max-w-full cursor-pointer px-2 text-xs font-medium`}>
                {`${item.notes?.slice(0, 76)} ...`}
              </div>
            </PopoverTrigger>
            <PopoverContent>
              <h3 className="text-sm font-semibold">Notes</h3>
              <div className="max-w-xs p-2 text-sm">{item.notes}</div>
              <div className="align-center flex w-full flex-row justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingNotes(true)}
                  className="cursor-pointer"
                >
                  <Pen size={16} /> Edit
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        ) : (
          <div
            className={`max-w-full cursor-pointer px-2 text-xs font-medium ${!item.notes ? 'text-gray-400' : ''}`}
            onClick={() => setIsEditingNotes(true)}
          >
            {item.notes || 'No notes'}
          </div>
        )}
      </div>
      <div className="col-span-4 ml-4 flex justify-center">
        {isEditingCategory ? (
          <input
            autoFocus
            className="w-full rounded border px-2 py-0 text-sm"
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
      <div className="col-span-3 mx-6 text-sm text-gray-500">
        {isEditingQty ? (
          <input
            autoFocus
            type="number"
            className="w-20 rounded border px-2 py-1 text-sm"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            onBlur={handleQtySubmit}
            onKeyDown={(e) => e.key === 'Enter' && handleQtySubmit()}
          />
        ) : (
          <span className="flex w-[64px] cursor-pointer" onClick={() => setIsEditingQty(true)}>
            x {item.quantity ?? 1}
          </span>
        )}
      </div>
      <Popover open={isDeleteOpen} onOpenChange={setDeleteOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="group col-span-2 cursor-pointer justify-self-end p-1"
          >
            <Trash
              className="group-hover:stroke-destructive stroke-gray-500 transition"
              size={20}
            />
          </Button>
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
                  if (!item.id) return;
                  onDelete(item.id);
                  setDeleteOpen(false);
                }}
              >
                <Trash className="stroke-white" size={20} />
                Delete
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
