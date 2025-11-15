// 数据转换工具函数

/**
 * 将API返回的商品价格转换为数字
 */
export function parsePrice(price: number | string | null | undefined): number {
  if (price === null || price === undefined) return 0;
  if (typeof price === 'number') return price;
  if (typeof price === 'string') {
    const parsed = parseFloat(price);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

/**
 * 将API返回的数字字段转换为数字
 */
export function parseNumber(value: number | string | null | undefined): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

/**
 * 货币转换汇率（人民币转美元）
 * 实际项目中应该从API获取实时汇率
 */
const CNY_TO_USD_RATE = 0.14; // 约1 CNY = 0.14 USD

/**
 * 格式化价格，根据语言显示不同货币
 * @param price 价格（人民币）
 * @param language 语言代码 ('zh-CN' | 'en-US')
 * @returns 格式化后的价格字符串
 */
export function formatPrice(price: number, language: string = 'zh-CN'): string {
  const numPrice = parsePrice(price);
  
  if (language === 'en-US') {
    // 转换为美元
    const usdPrice = numPrice * CNY_TO_USD_RATE;
    return `$${usdPrice.toFixed(2)}`;
  } else {
    // 人民币
    return `¥${numPrice.toFixed(2)}`;
  }
}

/**
 * 获取货币符号
 * @param language 语言代码
 * @returns 货币符号
 */
export function getCurrencySymbol(language: string = 'zh-CN'): string {
  return language === 'en-US' ? '$' : '¥';
}

