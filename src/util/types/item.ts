import { User } from './user';

export type Item = {
  id: string;
  listId: string;
  name: string;
  quantity: number;
  category?: string;
  notes?: string;
  completed?: boolean;
  completedAt?: string;
  addedBy?: User;
  addedById?: string;
  createdAt: string;
  updatedAt: string;
};
