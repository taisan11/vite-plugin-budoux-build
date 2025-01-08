import type { AstroIntegration } from 'astro';
import { type config, DEFAULT_CONFIG } from './types';
import { getParser } from "./until"
import { parse } from 'node-html-parser';
import MagicString from 'magic-string';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

export default function budouxBuildPlugin(config: config = DEFAULT_CONFIG): AstroIntegration {
  return {
    name: 'vite-plugin-budoux-build',
    hooks: {
      'astro:build:done': async ({ pages,dir }) => {
        const { language, attribute } = config;

        const processHTML = async (filePath: string) => {
          console.log(filePath);
          const html = await fs.readFile(filePath, 'utf-8');
          const s = new MagicString(html);
          const parsedHTML = parse(html);
          const elements = parsedHTML.querySelectorAll(`[${attribute}]`);
          for (const element of elements) {
            const parser = getParser(language!);

            const { range, innerHTML } = element;
            const [start, end] = range;
            const parsed = parser.translateHTMLString(innerHTML);
            console.log(parsed);
            s.overwrite(start, end, parsed);
          }
          await fs.writeFile(filePath, s.toString(), 'utf-8');
        };

        for (const page of pages) {
            const pagePath = new URL(page.pathname, dir).pathname;
            const path = pagePath.endsWith('/') ? `${pagePath}index.html` : `${pagePath}.html`;
          await processHTML(path);
        }
      },
    },
  };
}
