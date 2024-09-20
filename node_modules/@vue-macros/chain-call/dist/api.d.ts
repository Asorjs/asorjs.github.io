import { CodeTransform } from '@vue-macros/common';

declare function transformChainCall(code: string, id: string): CodeTransform | undefined;

export { transformChainCall };
