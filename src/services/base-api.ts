
export class BaseApiService {
  protected token: string | null = null;
  protected baseURL: string = 'http://localhost:3000/api';

  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  protected getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  protected generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}
