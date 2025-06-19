
import { BaseApiService } from './base-api';

interface LoginCredentials {
  email: string;
  password: string;
  role: 'admin' | 'entity';
  name: string;
  entity_id?: string;
}

export class AuthService extends BaseApiService {
  // Credenciais fixas para desenvolvimento
  private credentials: LoginCredentials[] = [
    {
      email: 'admin@sistema.com',
      password: 'admin123',
      role: 'admin',
      name: 'Administrador do Sistema'
    },
    {
      email: 'entidade@empresa.com',
      password: 'entidade123',
      role: 'entity',
      name: 'Usuário da Entidade',
      entity_id: '1'
    }
  ];

  async login(email: string, password: string) {
    try {
      // Simular delay de requisição
      await new Promise(resolve => setTimeout(resolve, 500));

      const user = this.credentials.find(
        cred => cred.email === email && cred.password === password
      );

      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Gerar token simples para desenvolvimento
      const token = btoa(`${user.email}:${Date.now()}`);
      
      this.setToken(token);
      
      return {
        token,
        user: {
          id: user.role === 'admin' ? 'admin-1' : 'entity-1',
          name: user.name,
          email: user.email,
          role: user.role,
          entity_id: user.entity_id || null
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
}
