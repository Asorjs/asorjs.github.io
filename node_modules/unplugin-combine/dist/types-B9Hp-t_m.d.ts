import { UnpluginInstance } from 'unplugin';
import { Compiler, WebpackPluginInstance } from 'webpack';
import { RspackPluginInstance, RspackPluginFunction } from '@rspack/core';
import { Plugin as Plugin$1 } from 'rollup';
import { Plugin as Plugin$2 } from 'rolldown';
import { Plugin as Plugin$3 } from 'vite';
import { Plugin as Plugin$4 } from 'esbuild';

type WebpackPlugin = ((this: Compiler, compiler: Compiler) => void) | WebpackPluginInstance;
type RspackPlugin = RspackPluginInstance | RspackPluginFunction;
interface PluginMap {
    rollup: Plugin$1;
    rolldown: Plugin$2;
    vite: Plugin$3;
    esbuild: Plugin$4;
    webpack: WebpackPlugin;
    rspack: RspackPlugin;
}
type PluginType = keyof PluginMap;
type Plugin = PluginMap[PluginType];
type RemoveFalsy<T> = Exclude<T, false | '' | 0 | null | undefined>;
type Factory<UserOptions> = (userOptions: UserOptions, meta: {
    framework?: PluginType;
}) => CombineOptions;
type FactoryOutput<UserOptions, Return> = [never] extends UserOptions ? () => Return : undefined extends UserOptions ? (options?: UserOptions) => Return : (options: UserOptions) => Return;
type Unplugin<UserOptions> = {
    instance: UnpluginInstance<UserOptions, boolean> | UnpluginCombineInstance<any>;
    options?: UserOptions;
};
type OptionsPlugin = Plugin | Unplugin<any> | OptionsPlugin[];
interface CombineOptions {
    name: string;
    /** vite only */
    enforce?: 'post' | 'pre' | undefined;
    plugins: OptionsPlugin;
}
interface UnpluginCombineInstance<UserOptions> {
    rollup: FactoryOutput<UserOptions, Plugin$1[]>;
    rolldown: FactoryOutput<UserOptions, Plugin$2[]>;
    webpack: FactoryOutput<UserOptions, WebpackPlugin>;
    rspack: FactoryOutput<UserOptions, RspackPlugin>;
    vite: FactoryOutput<UserOptions, Plugin$3[]>;
    esbuild: FactoryOutput<UserOptions, Plugin$4>;
    raw: Factory<UserOptions>;
    plugins: FactoryOutput<UserOptions, OptionsPlugin>;
}

export type { CombineOptions as C, Factory as F, OptionsPlugin as O, PluginType as P, RemoveFalsy as R, UnpluginCombineInstance as U, WebpackPlugin as W, PluginMap as a, RspackPlugin as b, Plugin as c, FactoryOutput as d, Unplugin as e };
