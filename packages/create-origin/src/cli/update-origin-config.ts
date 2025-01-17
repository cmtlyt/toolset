import { fetchOriginConifg } from '$/utils/origin-config';
import yoctoSpinner from 'yocto-spinner';

export async function updateOriginConfig() {
  const spinner = yoctoSpinner({ text: '正在更新模板配置...' }).start();
  await fetchOriginConifg();
  spinner.text = '模板配置更新成功';
  spinner.success();
}
