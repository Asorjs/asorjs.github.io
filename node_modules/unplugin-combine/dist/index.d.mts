import { P as PluginType, O as OptionsPlugin, R as RemoveFalsy, a as PluginMap, F as Factory, U as UnpluginCombineInstance } from './types-B9Hp-t_m.mjs';
export { C as CombineOptions, d as FactoryOutput, c as Plugin, b as RspackPlugin, e as Unplugin, W as WebpackPlugin } from './types-B9Hp-t_m.mjs';
export { Plugin as RollupPlugin } from 'rollup';
export { Plugin as VitePlugin } from 'vite';
export { Plugin as EsbuildPlugin } from 'esbuild';
import 'unplugin';
import 'webpack';
import '@rspack/core';
import 'rolldown';

declare function resolvePlugins<T extends PluginType>(plugins: OptionsPlugin, type: T): Array<RemoveFalsy<PluginMap[T]>>;
declare const createCombinePlugin: <UserOptions>(factory: Factory<UserOptions>) => UnpluginCombineInstance<UserOptions>;

export { Factory, OptionsPlugin, PluginMap, PluginType, RemoveFalsy, UnpluginCombineInstance, createCombinePlugin, resolvePlugins };
