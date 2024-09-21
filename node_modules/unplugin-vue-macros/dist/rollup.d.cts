import plugin from './index.js';
import 'unplugin-combine';
import '@vue-macros/config';

declare const _default: typeof plugin.rollup;

export = _default;
