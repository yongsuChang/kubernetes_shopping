import axios from 'axios';
import i18n from '../i18n';

const shopClient = axios.create({
  baseURL: import.meta.env.VITE_SHOP_API_URL,
});

const adminClient = axios.create({
  baseURL: import.meta.env.VITE_ADMIN_API_URL,
});

const addInterceptors = (client: typeof shopClient) => {
  client.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Set Accept-Language header
    config.headers['Accept-Language'] = i18n.language || 'ko';
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      const isAuthUrl = error.config?.url?.includes('/api/v1/auth/');
      if (error.response?.status === 401 && !isAuthUrl) {
        localStorage.removeItem('token');
        // useAuthStore.getState().logout() 을 호출하는 것이 더 좋으나 순환 참조 방지를 위해 최소화
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};

addInterceptors(shopClient);
addInterceptors(adminClient);

export { shopClient, adminClient };
