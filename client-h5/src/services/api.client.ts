// 临时使用 fetch API（如果 axios 安装有问题）
// 要使用 axios 版本，请先运行: npm install axios
import { API_BASE_URL } from '../config/api.config';

class FetchClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('treasure-token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;

    try {
      const response = await fetch(fullUrl, {
        ...options,
        headers,
      });

      // 处理 401 未授权
      if (response.status === 401) {
        localStorage.removeItem('treasure-token');
        localStorage.removeItem('treasure-user');
        window.dispatchEvent(new CustomEvent('auth-required'));
        throw new Error('未授权，请重新登录');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = {
          message: errorData.message || response.statusText || '请求失败',
          status: response.status,
          data: errorData,
        };
        
        // 对于404错误，如果是"您不是团队长"这种业务逻辑错误，静默处理
        if (response.status === 404 && errorData.message && errorData.message.includes('团队长')) {
          // 静默处理，不打印到控制台
        } else {
          // 其他错误才抛出
        }
        
        throw error;
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      if (error.message && error.status) {
        throw error;
      }
      throw {
        message: error.message || '网络请求失败',
        status: 0,
        data: null,
      };
    }
  }

  async get<T = any>(url: string, config?: { params?: any }): Promise<T> {
    let fullUrl = url;
    if (config?.params) {
      const params = new URLSearchParams();
      Object.keys(config.params).forEach((key) => {
        if (config.params[key] !== undefined && config.params[key] !== null) {
          params.append(key, String(config.params[key]));
        }
      });
      const queryString = params.toString();
      if (queryString) {
        fullUrl += `?${queryString}`;
      }
    }
    return this.request<T>(fullUrl, { method: 'GET' });
  }

  async post<T = any>(url: string, data?: any): Promise<T> {
    return this.request<T>(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T = any>(url: string, data?: any): Promise<T> {
    return this.request<T>(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T = any>(url: string): Promise<T> {
    return this.request<T>(url, { method: 'DELETE' });
  }

  // 文件上传
  async uploadFile<T = any>(url: string, file: File, fieldName: string = 'file'): Promise<T> {
    const token = localStorage.getItem('treasure-token');
    const formData = new FormData();
    formData.append(fieldName, file);

    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    // 不设置Content-Type，让浏览器自动设置multipart/form-data边界

    const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;

    try {
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (response.status === 401) {
        localStorage.removeItem('treasure-token');
        localStorage.removeItem('treasure-user');
        window.dispatchEvent(new CustomEvent('auth-required'));
        throw new Error('未授权，请重新登录');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          message: errorData.message || response.statusText || '上传失败',
          status: response.status,
          data: errorData,
        };
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      if (error.message && error.status) {
        throw error;
      }
      throw {
        message: error.message || '文件上传失败',
        status: 0,
        data: null,
      };
    }
  }
}

const fetchClient = new FetchClient(API_BASE_URL);

// API请求封装
export class ApiClient {
  static async get<T = any>(url: string, config?: { params?: any }): Promise<T> {
    return fetchClient.get<T>(url, config);
  }

  static async post<T = any>(url: string, data?: any): Promise<T> {
    return fetchClient.post<T>(url, data);
  }

  static async put<T = any>(url: string, data?: any): Promise<T> {
    return fetchClient.put<T>(url, data);
  }

  static async delete<T = any>(url: string): Promise<T> {
    return fetchClient.delete<T>(url);
  }

  static async uploadFile<T = any>(url: string, file: File, fieldName: string = 'file'): Promise<T> {
    return fetchClient.uploadFile<T>(url, file, fieldName);
  }
}

export default fetchClient;

