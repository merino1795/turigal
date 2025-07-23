// frontend/src/services/api.ts

const API_BASE_URL = 'http://localhost:3000/api';

// Tipos TypeScript
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'OWNER' | 'USER';
  isVerified: boolean;
  createdAt: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    isVerified: boolean;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface UsersResponse {
  page: number;
  limit: number;
  total: number;
  users: User[];
}

class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    // Recuperar token del localStorage al inicializar
    this.token = localStorage.getItem('authToken');
  }

  // Configurar headers con autorización
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Manejar respuestas HTTP
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    try {
      const data = await response.json();
      
      if (response.ok) {
        return {
          success: true,
          data: data,
        };
      } else {
        return {
          success: false,
          error: data.message || 'Error desconocido',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'Error de conexión con el servidor',
      };
    }
  }

  // Establecer token de autenticación
  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  // Obtener token actual
  getToken(): string | null {
    return this.token;
  }

  // ===== AUTENTICACIÓN =====
  
  async login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password }),
    });

    const result = await this.handleResponse<LoginResponse>(response);
    
    // Si el login es exitoso, guardar el token
    if (result.success && result.data) {
      this.setToken(result.data.token);
    }
    
    return result;
  }

  logout() {
    this.setToken(null);
  }

  // ===== USUARIOS =====
  
  async getUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    verified?: boolean;
    from?: string;
    to?: string;
  }): Promise<ApiResponse<UsersResponse>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.verified !== undefined) queryParams.append('verified', params.verified.toString());
      if (params.from) queryParams.append('from', params.from);
      if (params.to) queryParams.append('to', params.to);
    }

    const response = await fetch(`${this.baseUrl}/users?${queryParams}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse<UsersResponse>(response);
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    const response = await fetch(`${this.baseUrl}/users/me`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse<User>(response);
  }

  async createUser(userData: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  }): Promise<ApiResponse<User>> {
    const response = await fetch(`${this.baseUrl}/users`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(userData),
    });

    return this.handleResponse<User>(response);
  }

  async exportUsers(params?: {
    search?: string;
    verified?: boolean;
    from?: string;
    to?: string;
  }): Promise<ApiResponse<Blob>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      if (params.search) queryParams.append('search', params.search);
      if (params.verified !== undefined) queryParams.append('verified', params.verified.toString());
      if (params.from) queryParams.append('from', params.from);
      if (params.to) queryParams.append('to', params.to);
    }

    const response = await fetch(`${this.baseUrl}/users/export?${queryParams}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (response.ok) {
      const blob = await response.blob();
      return {
        success: true,
        data: blob,
      };
    } else {
      return {
        success: false,
        error: 'Error al exportar usuarios',
      };
    }
  }

  // ===== UTILIDADES =====
  
  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!this.token;
  }

  // Verificar si el token ha expirado (básico)
  isTokenExpired(): boolean {
    if (!this.token) return true;
    
    try {
      const payload = JSON.parse(atob(this.token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }
}

// Exportar instancia singleton
const apiService = new ApiService();
export default apiService;