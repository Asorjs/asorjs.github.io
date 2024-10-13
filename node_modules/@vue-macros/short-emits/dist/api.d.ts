import { CodeTransform } from '@vue-macros/common';

declare function transformShortEmits(code: string, id: string): CodeTransform | undefined;

export { transformShortEmits };
