import { CodeTransform } from '@vue-macros/common';

declare function transformDefineProps(code: string, id: string): CodeTransform | undefined;

export { transformDefineProps };
