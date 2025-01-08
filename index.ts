import type { PluginOption } from 'vite';
import {type config,DEFAULT_CONFIG} from './types';
import {getParser} from "./until"
import {parse} from 'node-html-parser';
import MagicString from 'magic-string';

export default function budouxBuildPlugin(config:config=DEFAULT_CONFIG): PluginOption {
    return {
        name: 'vite-plugin-budoux-build',
        enforce:"post",
        transform(code, id) {
            const s = new MagicString(code);
            const parsedHTML = parse(code);
            const elements = parsedHTML.querySelectorAll(`[${config.attribute}]`);
            for (const element of elements) {
                const attr = element.attributes[config.attribute!];
                const parser = getParser(config.language!);

                const { range, innerHTML } = element;
                const [start, end] = range;
                const parsed = parser.translateHTMLString(innerHTML);
                console.log(parsed);
                s.overwrite(start, end, parsed);
            }
            return s.toString();
        },
    };
}