import { z } from 'zod';

export interface LobeUser {
  avatar?: string;
  email?: string | null;
  firstName?: string | null;
  fullName?: string | null;
  id: string;
  latestName?: string | null;
  username?: string | null;
}

export const UserGuideSchema = z.object({
  /**
   * Move the settings button to the avatar dropdown
   */
  moveSettingsToAvatar: z.boolean().optional(),

  /**
   * Topic Guide
   */
  topic: z.boolean().optional(),

  /**
   * tell user that uploaded files can be found in knowledge base
   */
  uploadFileInKnowledgeBase: z.boolean().optional(),
});

export type UserGuide = z.infer<typeof UserGuideSchema>;

export interface UserPreference {
  guide?: UserGuide;
  hideSyncAlert?: boolean;
  telemetry: boolean | null;
  topicDisplayMode?: any;
  /**
   * whether to use cmd + enter to send message
   */
  useCmdEnterToSend?: boolean;
}