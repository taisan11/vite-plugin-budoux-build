import type { Language } from './utils';

export interface Options {
  language?: Language;
  attribute?: string;
}

export const DEFAULT_CONFIG = {
	language: 'ja',
	attribute: `data-budoux`,
} as const satisfies Options;