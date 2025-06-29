/**
 * 判断字符串是否为有效的图片 URL
 * @param url 待判断的字符串
 * @returns 是否为有效的图片 URL
 */
export function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  // 检查是否以协议开头（http/https）
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return true;
  }

  // 检查是否为相对路径（以 / 开头）
  if (url.startsWith('/')) {
    return true;
  }

  // 检查是否为 data URL（base64 图片）
  if (url.startsWith('data:image/')) {
    return true;
  }

  return false;
}
