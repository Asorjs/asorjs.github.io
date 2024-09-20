import { F as Factory, U as UnpluginCombineInstance } from './types-B9Hp-t_m.js';
import 'unplugin';
import 'webpack';
import '@rspack/core';
import 'rollup';
import 'rolldown';
import 'vite';
import 'esbuild';

declare const getRollupPlugin: <UserOptions>(factory: Factory<UserOptions>) => UnpluginCombineInstance<UserOptions>["rollup"];

export { getRollupPlugin };
