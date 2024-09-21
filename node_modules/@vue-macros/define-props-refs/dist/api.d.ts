import { CodeTransform } from '@vue-macros/common';

declare function transformDefinePropsRefs(code: string, id: string): CodeTransform | undefined;

export { transformDefinePropsRefs };
