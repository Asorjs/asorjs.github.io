import { F as Factory, U as UnpluginCombineInstance } from './types-B9Hp-t_m.mjs';
import 'unplugin';
import 'webpack';
import '@rspack/core';
import 'rollup';
import 'rolldown';
import 'vite';
import 'esbuild';

declare const getRspackPlugin: <UserOptions>(factory: Factory<UserOptions>) => UnpluginCombineInstance<UserOptions>["rspack"];

export { getRspackPlugin };
