import axios from 'axios';

const shopClient = axios.create({
  baseURL: import.meta.env.VITE_SHOP_API_URL,
});

const adminClient = axios.create({
  baseURL: import.meta.env.VITE_ADMIN_API_URL,
});

const addInterceptors = (client: typeof shopClient) => {
  client.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};

addInterceptors(shopClient);
addInterceptors(adminClient);

export { shopClient, adminClient };
