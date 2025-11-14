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

