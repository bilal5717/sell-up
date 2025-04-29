import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Configure axios to send cookies
axios.defaults.withCredentials = true;
axios.defaults.baseURL = API_URL;

export const authService = {
  async getCsrfToken() {
    await axios.get('/sanctum/csrf-cookie');
  },

  async login(login: string, password: string, method: 'email' | 'phone') {
    await this.getCsrfToken();
    return axios.post('/api/auth/login', {
      login,
      password,
      method
    });
  },

  async logout() {
    return axios.post('/api/auth/logout');
  },

  async getUser() {
    return axios.get('/api/auth/user');
  }
};