import type { AstroIntegration } from 'astro';
import { type config, DEFAULT_CONFIG } from './types';
import { getParser } from "./until"
import { parse } from 'node-html-parser';
import MagicString from 'magic-string';
import * as fs from 'node:fs/promises';
import * as path from 'pathe';

export default function budouxBuildPlugin(config: config = DEFAULT_CONFIG): AstroIntegration {
  return {
    name: 'vite-plugin-budoux-build',
    hooks: {
      'astro:build:done': async ({ pages,dir,logger }) => {
        logger.info("Run budoux-build!!");
        const { language, attribute } = config;
        const processHTML = async (filePath: string) => {
          const html = await fs.readFile(filePath, 'utf-8');
          const s = new MagicString(html);
          const parsedHTML = parse(html);
          const elements = parsedHTML.querySelectorAll(`[${attribute}]`);
          for (const element of elements) {
            const parser = getParser(language!);
            element.removeAttribute(attribute!);

            const { range, outerHTML } = element;
            const [start, end] = range;
            const parsed = parser.translateHTMLString(outerHTML);
            s.overwrite(start, end, parsed);
          }
          await fs.writeFile(filePath, s.toString(), 'utf-8');
        };
        async function fallback(pagePath:string) {
          await processHTML(pagePath).catch(async (e) => {
            if (e.code === 'ENOENT') {
              await processHTML(pagePath.replace(/\.html$/, '/index.html'));
            } else {
              throw e;
            }
          })
        }
        for (const page of pages) {
            const pagePathhtml = page.pathname === '' ? 'index.html' : page.pathname.replace(/^\//, '').replace(/\/$/, '') + '.html';
            let pagePath = new URL(pagePathhtml, dir).pathname;
            pagePath = path.normalize(pagePath);
            // const path = pagePath.endsWith('/') ? `${pagePath}index.html` : `${pagePath}.html`;
          await fallback(pagePath);
        }
        logger.info("budoux-build done!!");
      },
    },
  };
}
