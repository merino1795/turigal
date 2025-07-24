// frontend/src/services/api.ts

// Cambiar la URL base para usar el proxy
const API_BASE_URL = '/api'; // ✅ Usar proxy en lugar de URL completa

// Tipos TypeScript
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'OWNER' | 'USER';
  isVerified: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface PropertyOwner {
  id: string;
  email: string;
  contactName: string;
  companyName?: string;
  phone?: string;
  taxId?: string;
  role: string;
  createdAt: string;
  _count?: {
    properties: number;
  };
}

export interface Property {
  id: string;
  name: string;
  description?: string;
  propertyType: string;
  address: any; // JSON object
  totalRooms: number;
  maxGuests: number;
  amenities?: any; // JSON object
  houseRules?: string;
  checkInTime?: string;
  checkOutTime?: string;
  qrCodeData: string;
  images?: any; // JSON object
  isActive: boolean;
  createdAt: string;
  ownerId: string;
  owner?: {
    id: string;
    contactName: string;
    companyName?: string;
    email: string;
  };
  _count?: {
    rooms: number;
    bookings: number;
    reviews: number;
  };
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

export interface PropertiesResponse {
  page: number;
  limit: number;
  total: number;
  properties: Property[];
}

export interface PropertyOwnersResponse {
  page: number;
  limit: number;
  total: number;
  owners: PropertyOwner[];
}

export interface PropertyStats {
  totalProperties: number;
  activeProperties: number;
  inactiveProperties: number;
  totalRooms: number;
  availableRooms: number;
  propertyTypes: Array<{
    type: string;
    count: number;
  }>;
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

  // Manejar respuestas HTTP - MEJORADO
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    try {
      // Si la respuesta es 401, limpiar token
      if (response.status === 401) {
        this.logout();
        return {
          success: false,
          error: 'Sesión expirada. Por favor, inicia sesión nuevamente.',
        };
      }

      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }
      
      if (response.ok) {
        return {
          success: true,
          data: data,
        };
      } else {
        return {
          success: false,
          error: data.message || data || 'Error desconocido',
        };
      }
    } catch (error) {
      console.error('API Error:', error);
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
    try {
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
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Error de conexión al servidor',
      };
    }
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
    try {
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
    } catch (error) {
      console.error('Get users error:', error);
      return {
        success: false,
        error: 'Error al obtener usuarios',
      };
    }
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      const response = await fetch(`${this.baseUrl}/users/me`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      return this.handleResponse<User>(response);
    } catch (error) {
      console.error('Get current user error:', error);
      return {
        success: false,
        error: 'Error al obtener usuario actual',
      };
    }
  }

  // ✅ NUEVA FUNCIÓN: Obtener usuario por ID
  async getUserById(id: string): Promise<ApiResponse<User>> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${id}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      return this.handleResponse<User>(response);
    } catch (error) {
      console.error('Get user by ID error:', error);
      return {
        success: false,
        error: 'Error al obtener el usuario',
      };
    }
  }

  async createUser(userData: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  }): Promise<ApiResponse<User>> {
    try {
      const response = await fetch(`${this.baseUrl}/users`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(userData),
      });

      return this.handleResponse<User>(response);
    } catch (error) {
      console.error('Create user error:', error);
      return {
        success: false,
        error: 'Error al crear usuario',
      };
    }
  }

  // ✅ NUEVA FUNCIÓN: Actualizar usuario
  async updateUser(id: string, userData: {
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
    isVerified?: boolean;
  }): Promise<ApiResponse<User>> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(userData),
      });

      return this.handleResponse<User>(response);
    } catch (error) {
      console.error('Update user error:', error);
      return {
        success: false,
        error: 'Error al actualizar usuario',
      };
    }
  }

  // ✅ NUEVA FUNCIÓN: Eliminar usuario
  async deleteUser(id: string): Promise<ApiResponse<{message: string}>> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      return this.handleResponse<{message: string}>(response);
    } catch (error) {
      console.error('Delete user error:', error);
      return {
        success: false,
        error: 'Error al eliminar usuario',
      };
    }
  }

  // ✅ NUEVA FUNCIÓN: Cambiar contraseña de usuario
  async changeUserPassword(id: string, newPassword: string): Promise<ApiResponse<{message: string}>> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${id}/password`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify({ newPassword }),
      });

      return this.handleResponse<{message: string}>(response);
    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        error: 'Error al cambiar contraseña',
      };
    }
  }

  async exportUsers(params?: {
    search?: string;
    verified?: boolean;
    from?: string;
    to?: string;
  }): Promise<ApiResponse<Blob>> {
    try {
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
    } catch (error) {
      console.error('Export users error:', error);
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