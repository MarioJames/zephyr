import { appEnv } from '@/config/app';

export const LOADING_FLAT = '...';

export const BRANDING_NAME = 'Zephyr';

export const ARTIFACT_TAG = 'zephyrArtifact';

export const LOBE_THEME_APPEARANCE = 'LOBE_THEME_APPEARANCE';

export const DEFAULT_USER_AVATAR_URL =
  'https://lobehub.com/_next/static/media/logo.98482105.png';

export const withBasePath = (path: string) =>
  appEnv.NEXT_PUBLIC_BASE_PATH + path;

export const imageUrl = (filename: string) =>
  withBasePath(`/images/${filename}`);

export const ARTIFACT_THINKING_TAG = 'lobeThinking';
