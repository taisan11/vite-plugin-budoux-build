import * as budoux from 'budoux';

export type Language = 'ja' | 'cs' | 'ct' | 'th'
export type HTMLProcessingParser = budoux.HTMLProcessingParser;

export function resolveOptions(options: {
  language?: Language;
  attribute?: string;
}) {
  return {
    language: options.language ?? 'ja',
    attribute: options.attribute ?? 'data-budoux'
  };
}

const parserCache: Record<string, HTMLProcessingParser> = {};

export function getParser(
	language: Language,
): HTMLProcessingParser {
	switch (language) {
		case 'ja':
			return parserCache.ja ??= budoux.loadDefaultJapaneseParser();
		case 'cs':
			return parserCache.cs ??= budoux.loadDefaultSimplifiedChineseParser();
		case 'ct':
			return parserCache.ct ??= budoux.loadDefaultTraditionalChineseParser();
		case 'th':
			return parserCache.th ??= budoux.loadDefaultThaiParser();
		default:
			language satisfies never;
			throw new Error(`Language ${language as string} is not supported`);
	}
}
