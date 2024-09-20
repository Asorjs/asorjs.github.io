import * as vite from 'vite';
import { HmrContext } from 'vite';
import { CodeTransform } from '@vue-macros/common';

declare function transformSetupSFC(code: string, id: string): CodeTransform | undefined;
declare function hotUpdateSetupSFC({ modules }: HmrContext, filter: (id: unknown) => boolean): vite.ModuleNode[];

export { hotUpdateSetupSFC, transformSetupSFC };
