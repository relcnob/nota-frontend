import { User } from './user';
import { Item } from './item';

export type List = {
  id: string;
  title: string;
  description?: string;
  isPublic: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  owner: User;
  collaborators?: {
    id: string;
    userId: string;
    listId: string;
    role: string;
    addedAt: string;
    user: User;
  }[];
  items?: Item[];
};
