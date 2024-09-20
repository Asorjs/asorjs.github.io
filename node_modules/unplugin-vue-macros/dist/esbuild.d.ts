import plugin from './index.js';
import 'unplugin-combine';
import '@vue-macros/config';

declare const _default: typeof plugin.esbuild;

export { _default as default };
