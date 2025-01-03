import type { PluginOption } from 'vite';
import {type config,DEFAULT_CONFIG} from './types';
import {getParser} from "./until"

export default function budouxBuildPlugin(config:config=DEFAULT_CONFIG): PluginOption {
    return {
        name: 'vite-plugin-budoux-build',
        transform(code, id) {
            const attributeName = config.attribute; // You can change this to any attribute name you want
            const attributeRegex = new RegExp(`<([a-zA-Z]+)([^>]*${attributeName}[^>]*)>`, 'g');
            let match;
            while ((match = attributeRegex.exec(code)) !== null) {
                const fullMatch = match[0];
                const perser = getParser(config.language!);
                const transformedElement = perser.translateHTMLString(fullMatch);
                code = code.replace(fullMatch, transformedElement);
            }
            return {
                code,
                map: null,
            };
        },
    };
}