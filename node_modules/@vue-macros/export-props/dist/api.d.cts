import { CodeTransform } from '@vue-macros/common';

declare function transformExportProps(code: string, id: string): CodeTransform | undefined;

export { transformExportProps };
