import type { PluginOption } from 'vite';
import MagicString from 'magic-string';
import type { Options } from './types';
import type { Language } from './utils.ts';
import { getParser, resolveOptions } from './utils.ts';
import { parse } from 'node-html-parser';

export default function budouxBuildPlugin(options: Options = {}): PluginOption {
    const { language, attribute } = resolveOptions(options);
    return {
        name: 'vite-plugin-budoux-build',
        enforce: "post",
        transform(code, id) {
            if (!id.endsWith('.astro') || !code.includes(attribute)) {
                return null;
            }

            const s = new MagicString(code);
            try {
                const dom = parse(code);
                const elements = dom.querySelectorAll(`[${attribute}]`);

                for (const element of elements) {
                    const attrValue = element.getAttribute(attribute);
                    const parserLanguage: Language = (attrValue as Language) || language as Language;

                    // 言語の検証
                    if (!parserLanguage) {
                        throw new Error('Invalid language');
                    }

                    const parser = getParser(parserLanguage);

                    const start = code.indexOf(element.outerHTML);
                    if (start === -1) continue;

                    const end = start + element.outerHTML.length;

                    // BudouxでHTMLを処理
                    const parsed = parser.translateHTMLString(element.outerHTML);

                    s.overwrite(start, end, parsed);
                }

                if (s.hasChanged()) {
                    return {
                        code: s.toString(),
                        map: s.generateMap()
                    };
                }
            } catch (error) {
                console.error('Error processing Budoux:', error);
            }

            return null;
        }

    };
}