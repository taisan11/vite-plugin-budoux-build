import type { PluginOption } from 'vite';
import {type config,DEFAULT_CONFIG} from './types';
import {getParser} from "./until"
import {parse} from 'node-html-parser';
import MagicString from 'magic-string';
import {createLogger} from "vite"

export default function budouxBuildPlugin(config:config=DEFAULT_CONFIG): PluginOption {
    const logger = createLogger()
    return {
        name: 'vite-plugin-budoux-build',
        enforce:"post",
        transformIndexHtml(html, id) {
            logger.info("Run budoux-build!!");
            const s = new MagicString(html);
            const parsedHTML = parse(html);
            const elements = parsedHTML.querySelectorAll(`[${config.attribute}]`);
            for (const element of elements) {
                const attr = element.attributes[config.attribute!];
                const parser = getParser(config.language!);
                element.removeAttribute(config.attribute!);

                const { range, innerHTML } = element;
                const [start, end] = range;
                const parsed = parser.translateHTMLString(innerHTML);
                s.overwrite(start, end, parsed);
            }
            logger.info("budoux-build done!!");
            return s.toString();
        },
    };
}