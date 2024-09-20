import plugin from './index.js';
import 'unplugin-combine';
import '@vue-macros/config';

declare const _default: typeof plugin.webpack;

export { _default as default };
