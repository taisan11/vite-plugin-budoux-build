export interface config {
	language?: 'ja' | 'cs' | 'ct' | 'th';
	attribute?: string;
};

export const DEFAULT_CONFIG = {
	language: 'ja',
	attribute: `data-budoux`,
} as const satisfies config;