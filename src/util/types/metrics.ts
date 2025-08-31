import { List } from './list';
import { User } from './user';

export type DashboardMetrics = {
  totalLists: number;
  updatedInPastDay: number;
  collaboratedOn: number;
  createdByUser: number;
  recentlyUpdatedLists: List[];
  commonCollaborators: Partial<User>[];
};
