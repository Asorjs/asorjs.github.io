import { CodeTransform } from '@vue-macros/common';

declare function transformExportExpose(code: string, id: string): CodeTransform | undefined;

export { transformExportExpose };
