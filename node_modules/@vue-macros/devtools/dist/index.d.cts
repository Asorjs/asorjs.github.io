import { Plugin } from 'vite';

interface Options {
    /** @internal */
    nuxtContext?: {
        isClient?: boolean;
    };
}
declare const Devtools: ({ nuxtContext }?: Options) => Plugin;

export { Devtools, type Options };
