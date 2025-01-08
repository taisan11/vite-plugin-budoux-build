# vite-budoux-build

may be this is ssr on vite or astro only plugin.
```ts
import astro from "vite-budoux-build/astro"
// import vite from "vite-budoux-build"

// on astro
export default defineConfig({
    integrations:[astro()],
});
//on vite
//plugins:[vite()]
```
## Option
```ts
interface config {
	language?: 'ja' | 'cs' | 'ct' | 'th';
	attribute?: string;
};
```
### language
language is used as the language.(?)
Default is ja(japanese).
### attribute
attribute is an attribute added to HTML elements.
Default is data-budoux.
