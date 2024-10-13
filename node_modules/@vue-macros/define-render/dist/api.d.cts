import { CodeTransform } from '@vue-macros/common';
import { OptionsResolved } from './index.js';
import 'unplugin';

declare function transformDefineRender(code: string, id: string, options: OptionsResolved): CodeTransform | undefined;

export { transformDefineRender };
