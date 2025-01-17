import type { Registry } from '$/types';
import { downloadTemplate } from '$/utils/origin-config';
import yoctoSpinner from 'yocto-spinner';

export async function downloadTemplateConfig(registry: Registry) {
  const spinner = yoctoSpinner({ text: '正在下载模板...' }).start();
  await downloadTemplate(registry);
  spinner.text = '模板下载成功';
  spinner.success();
}
