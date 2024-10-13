import { CodeTransform } from '@vue-macros/common';

declare function transformBetterDefine(code: string, id: string, isProduction?: boolean): Promise<CodeTransform | undefined>;

export { transformBetterDefine };
