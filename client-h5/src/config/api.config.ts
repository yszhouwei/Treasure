// API配置
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  // 认证相关
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    PROFILE: '/auth/profile',
  },
  // 用户相关
  USERS: {
    PROFILE: '/users/profile',
    UPDATE: '/users/profile',
    UPLOAD_AVATAR: '/users/avatar',
    GET_BY_ID: (id: number) => `/users/${id}`,
  },
  // 商品相关
  PRODUCTS: {
    LIST: '/products',
    HOT: '/products/hot',
    RECOMMEND: '/products/recommend',
    GET_BY_ID: (id: number) => `/products/${id}`,
    BY_GROUP_SIZE: (groupSize: number) => `/products/by-group-size/${groupSize}`,
  },
  // 订单相关
  ORDERS: {
    LIST: '/orders',
    CREATE: '/orders',
    GET_BY_ID: (id: number) => `/orders/${id}`,
    PAY: (id: number) => `/orders/${id}/pay`,
  },
  // 团队相关
  TEAMS: {
    LIST: '/teams',
    GET_BY_ID: (id: number) => `/teams/${id}`,
    MY_OVERVIEW: '/teams/my/overview',
    UPDATE_SETTINGS: '/teams/my/settings',
    GET_SETTINGS: '/teams/my/settings',
  },
  // 支付相关
  PAYMENTS: {
    RECHARGE: '/payments/recharge',
    WITHDRAW: '/payments/withdraw',
  },
  // 内容相关
  CONTENTS: {
    TRENDING: '/contents/trending',
    INSIGHTS: '/contents/insights',
    STORIES: '/contents/stories',
    GET_BY_ID: (id: number) => `/contents/${id}`,
  },
  // 轮播图相关
  BANNERS: {
    LIST: '/banners',
  },
  // 开奖相关
  LOTTERY: {
    DRAW: (groupId: number) => `/lottery/draw/${groupId}`,
    RESULT: (groupId: number) => `/lottery/result/${groupId}`,
    MY_RECORDS: '/lottery/my-records',
  },
};

