import { CodeTransform } from '@vue-macros/common';

declare function transformExportRender(code: string, id: string): CodeTransform | undefined;

export { transformExportRender };
