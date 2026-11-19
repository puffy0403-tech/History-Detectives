import {readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

const read = path => readFileSync(resolve('dist', path.slice(1)));
let html = read('/index.html').toString('utf8');
const script = html.match(/<script type="module"[^>]*src="(\/assets\/[^"]+)"[^>]*><\/script>/);
const style = html.match(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+)"[^>]*>/);
if (!script || !style) throw new Error('找不到 Vite 產生的 JavaScript 或 CSS。');

const js = read(script[1]).toString('utf8').replace(/<\/script/gi, '<\\/script');
const css = read(style[1]).toString('utf8').replace(/url\(["']?(\/[^)"']+\.jpg)["']?\)/g, (_, path) => {
  return 'url(data:image/jpeg;base64,' + read(path).toString('base64') + ')';
});
html = html.replace(script[0], () => '<script type="module">' + js + '</script>');
html = html.replace(style[0], () => '<style>' + css + '</style>');
writeFileSync('History-Detectives.html', html);
