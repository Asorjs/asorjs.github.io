import { CodeTransform } from '@vue-macros/common';

declare function transformDefineModels(code: string, id: string, version: number, unified: boolean): CodeTransform | undefined;

export { transformDefineModels };
