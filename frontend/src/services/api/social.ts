import { apiClient } from '@/services/api/client';

export interface SocialUpdate {
  id: number;
  username: string;
  message: string;
  updated_at: string;
}

export const fetchSocialUpdates = () =>
  apiClient.get<SocialUpdate[]>('/social/');
