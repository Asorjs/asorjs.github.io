import { CodeTransform } from '@vue-macros/common';

declare function transformSetupBlock(code: string, id: string, lang?: string): CodeTransform | undefined;

export { transformSetupBlock };
