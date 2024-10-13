import { UnpluginCombineInstance } from 'unplugin-combine';
import { Options } from '@vue-macros/config';
export { Options, defineConfig, resolveOptions } from '@vue-macros/config';

declare const plugin: UnpluginCombineInstance<Options | undefined>;

export { plugin as default };
