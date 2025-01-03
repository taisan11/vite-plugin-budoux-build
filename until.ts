import * as budoux from 'budoux';
import {type config,DEFAULT_CONFIG} from './types';

export type HTMLProcessingParser = budoux.HTMLProcessingParser;
export type Language = Exclude<config['language'], null | undefined>;

const parserCache: Record<string, HTMLProcessingParser> = {};

export function getParser(language: Language): HTMLProcessingParser {
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
            throw new Error(`Unsupported language: ${language}`);
	}
}