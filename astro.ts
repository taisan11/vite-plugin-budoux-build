import type { AstroIntegration } from 'astro';
import MagicString from 'magic-string';
import type { Options } from './types';
import type { Language } from './utils.ts';
import { getParser, resolveOptions } from './utils.ts';
import { parse } from 'node-html-parser';

/**
 * BudouxビルドプラグインをAstro統合として提供します
 * @param options - 設定オプション
 * @returns Astro統合オブジェクト
 */
export default function budouxAstro(options: Options = {}): AstroIntegration {
  return {
    name: 'budoux-build',
    hooks: {
      'astro:build:done': async ({ pages }) => {
        // ビルド完了後の処理
      },
      'astro:config:setup': ({ injectRoute, updateConfig }) => {
        // 設定のセットアップ
      },
      'astro:server:setup': ({ server }) => {
        // サーバーセットアップ
      },
      'astro:build:setup': ({ vite, pages, target }) => {
        const { language, attribute } = resolveOptions(options);
        
        // Viteプラグインとして実装
        vite.plugins = vite.plugins || [];
        vite.plugins.push({
          name: 'astro-budoux-build',
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
        });
      }
    }
  };
}

// Svelteプリプロセッサとの互換性のために既存の関数名でもエクスポート
export { budouxAstro as budouxPreprocess };
