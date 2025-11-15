// 商品名称翻译映射
// 如果后端支持多语言字段，可以移除此文件，直接从API获取翻译后的名称

interface ProductTranslation {
  [key: string]: {
    'zh-CN': string;
    'en-US': string;
  };
}

// 商品名称翻译映射表
// key可以是商品ID或商品名称（中文）
export const productTranslations: ProductTranslation = {
  // 根据商品ID映射
  '1': {
    'zh-CN': '古董怀表',
    'en-US': 'Antique Pocket Watch'
  },
  '2': {
    'zh-CN': '珍稀邮票',
    'en-US': 'Rare Stamps'
  },
  '3': {
    'zh-CN': '复古胶片相机',
    'en-US': 'Retro Film Camera'
  },
  '4': {
    'zh-CN': '机械键盘',
    'en-US': 'Mechanical Keyboard'
  },
  '5': {
    'zh-CN': '智能手机',
    'en-US': 'Smartphone'
  },
  // 根据商品名称（中文）映射（作为备用）
  '古董怀表': {
    'zh-CN': '古董怀表',
    'en-US': 'Antique Pocket Watch'
  },
  '珍稀邮票': {
    'zh-CN': '珍稀邮票',
    'en-US': 'Rare Stamps'
  },
  '复古胶片相机': {
    'zh-CN': '复古胶片相机',
    'en-US': 'Retro Film Camera'
  },
  '机械键盘': {
    'zh-CN': '机械键盘',
    'en-US': 'Mechanical Keyboard'
  },
  '智能手机': {
    'zh-CN': '智能手机',
    'en-US': 'Smartphone'
  },
  '古董手表': {
    'zh-CN': '古董手表',
    'en-US': 'Antique Watch'
  },
  '稀有邮票': {
    'zh-CN': '稀有邮票',
    'en-US': 'Rare Stamps'
  }
};

/**
 * 获取商品名称的翻译
 * @param productId 商品ID
 * @param productName 商品名称（中文）
 * @param language 目标语言
 * @returns 翻译后的商品名称
 */
export function getTranslatedProductName(
  productId: number | string,
  productName: string,
  language: string = 'zh-CN'
): string {
  // 优先使用商品ID查找
  const translationById = productTranslations[String(productId)];
  if (translationById) {
    return translationById[language as 'zh-CN' | 'en-US'] || productName;
  }

  // 如果ID找不到，使用商品名称查找
  const translationByName = productTranslations[productName];
  if (translationByName) {
    return translationByName[language as 'zh-CN' | 'en-US'] || productName;
  }

  // 如果都找不到，返回原名称
  return productName;
}

