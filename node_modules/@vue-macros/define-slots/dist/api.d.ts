import { CodeTransform } from '@vue-macros/common';

declare function transformDefineSlots(code: string, id: string): CodeTransform | undefined;

export { transformDefineSlots };
