// frontend/src/services/api.ts - VERSIÓN COMPLETA

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
    verifiedCheckIns: number;
    processedCheckOuts: number;
  };
  properties?: Property[];
}

export interface Property {
  id: string;
  name: string;
  description?: string;
  propertyType: string;
  address: {
    street?: string;
    city: string;
    state?: string;
    zipCode?: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  totalRooms: number;
  maxGuests: number;
  amenities?: string[];
  houseRules?: string;
  checkInTime?: string;
  checkOutTime?: string;
  qrCodeData: string;
  images?: string[];
  isActive: boolean;
  createdAt: string;
  ownerId: string;
  owner?: {
    id: string;
    contactName: string;
    companyName?: string;
    email: string;
    phone?: string;
  };
  rooms?: Room[];
  bookings?: Booking[];
  reviews?: Review[];
  _count?: {
    rooms: number;
    bookings: number;
    reviews: number;
  };
}

export interface Room {
  id: string;
  propertyId: string;
  roomNumber: string;
  roomType?: string;
  maxGuests: number;
  pricePerNight?: number;
  qrCodeData: string;
  isAvailable: boolean;
  createdAt: string;
}

export interface Booking {
  id: string;
  userId: string;
  propertyId: string;
  roomId?: string;
  bookingReference: string;
  checkInDate: string;
  checkOutDate: string;
  guestsCount: number;
  guestDetails?: any;
  totalAmount: number;
  bookingStatus: string;
  specialRequests?: string;
  createdAt: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface Review {
  id: string;
  bookingId: string;
  userId: string;
  propertyId: string;
  overallRating: number;
  cleanlinessRating: number;
  locationRating: number;
  valueRating: number;
  serviceRating: number;
  comment?: string;
  photos?: any;
  isAnonymous: boolean;
  responseFromOwner?: string;
  responseDate?: string;
  createdAt: string;
  user?: {
    firstName: string;
    lastName: string;
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
  propertiesByType: Array<{
    type: string;
    count: number;
  }>;
  topProperties: Array<{
    id: string;
    name: string;
    bookingsCount: number;
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
      } else if (contentType && contentType.includes('text/csv')) {
        // Para exportaciones CSV
        const blob = await response.blob();
        return {
          success: true,
          data: blob as T,
        };
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

  // ===== PROPIEDADES ===== 🏠

  async getProperties(params?: {
    page?: number;
    limit?: number;
    search?: string;
    propertyType?: string;
    isActive?: boolean;
    ownerId?: string;
    from?: string;
    to?: string;
  }): Promise<ApiResponse<PropertiesResponse>> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params) {
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.search) queryParams.append('search', params.search);
        if (params.propertyType) queryParams.append('propertyType', params.propertyType);
        if (params.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
        if (params.ownerId) queryParams.append('ownerId', params.ownerId);
        if (params.from) queryParams.append('from', params.from);
        if (params.to) queryParams.append('to', params.to);
      }

      const response = await fetch(`${this.baseUrl}/properties?${queryParams}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      return this.handleResponse<PropertiesResponse>(response);
    } catch (error) {
      console.error('Get properties error:', error);
      return {
        success: false,
        error: 'Error al obtener propiedades',
      };
    }
  }

  async getPropertyById(id: string): Promise<ApiResponse<Property>> {
    try {
      const response = await fetch(`${this.baseUrl}/properties/${id}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      return this.handleResponse<Property>(response);
    } catch (error) {
      console.error('Get property by ID error:', error);
      return {
        success: false,
        error: 'Error al obtener la propiedad',
      };
    }
  }

  async createProperty(propertyData: {
    name: string;
    description?: string;
    propertyType: string;
    address: {
      street?: string;
      city: string;
      state?: string;
      zipCode?: string;
      country: string;
    };
    totalRooms: number;
    maxGuests: number;
    amenities?: string[];
    houseRules?: string;
    checkInTime?: string;
    checkOutTime?: string;
    images?: string[];
    ownerId?: string;
  }): Promise<ApiResponse<Property>> {
    try {
      const response = await fetch(`${this.baseUrl}/properties`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(propertyData),
      });

      return this.handleResponse<Property>(response);
    } catch (error) {
      console.error('Create property error:', error);
      return {
        success: false,
        error: 'Error al crear propiedad',
      };
    }
  }

  async updateProperty(id: string, propertyData: {
    name?: string;
    description?: string;
    propertyType?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
    totalRooms?: number;
    maxGuests?: number;
    amenities?: string[];
    houseRules?: string;
    checkInTime?: string;
    checkOutTime?: string;
    images?: string[];
    isActive?: boolean;
  }): Promise<ApiResponse<Property>> {
    try {
      const response = await fetch(`${this.baseUrl}/properties/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(propertyData),
      });

      return this.handleResponse<Property>(response);
    } catch (error) {
      console.error('Update property error:', error);
      return {
        success: false,
        error: 'Error al actualizar propiedad',
      };
    }
  }

  async deleteProperty(id: string): Promise<ApiResponse<{message: string}>> {
    try {
      const response = await fetch(`${this.baseUrl}/properties/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      return this.handleResponse<{message: string}>(response);
    } catch (error) {
      console.error('Delete property error:', error);
      return {
        success: false,
        error: 'Error al eliminar propiedad',
      };
    }
  }

  async exportProperties(params?: {
    search?: string;
    propertyType?: string;
    isActive?: boolean;
    ownerId?: string;
    from?: string;
    to?: string;
  }): Promise<ApiResponse<Blob>> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params) {
        if (params.search) queryParams.append('search', params.search);
        if (params.propertyType) queryParams.append('propertyType', params.propertyType);
        if (params.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
        if (params.ownerId) queryParams.append('ownerId', params.ownerId);
        if (params.from) queryParams.append('from', params.from);
        if (params.to) queryParams.append('to', params.to);
      }

      const response = await fetch(`${this.baseUrl}/properties/export/csv?${queryParams}`, {
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
          error: 'Error al exportar propiedades',
        };
      }
    } catch (error) {
      console.error('Export properties error:', error);
      return {
        success: false,
        error: 'Error al exportar propiedades',
      };
    }
  }

  async getPropertyStats(): Promise<ApiResponse<PropertyStats>> {
    try {
      const response = await fetch(`${this.baseUrl}/properties/stats/overview`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      return this.handleResponse<PropertyStats>(response);
    } catch (error) {
      console.error('Get property stats error:', error);
      return {
        success: false,
        error: 'Error al obtener estadísticas de propiedades',
      };
    }
  }

  // ===== PROPIETARIOS ===== 🏢

  async getPropertyOwners(params?: {
    page?: number;
    limit?: number;
    search?: string;
    from?: string;
    to?: string;
  }): Promise<ApiResponse<PropertyOwnersResponse>> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params) {
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.search) queryParams.append('search', params.search);
        if (params.from) queryParams.append('from', params.from);
        if (params.to) queryParams.append('to', params.to);
      }

      const response = await fetch(`${this.baseUrl}/property-owners?${queryParams}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      return this.handleResponse<PropertyOwnersResponse>(response);
    } catch (error) {
      console.error('Get property owners error:', error);
      return {
        success: false,
        error: 'Error al obtener propietarios',
      };
    }
  }

  async getPropertyOwnerById(id: string): Promise<ApiResponse<PropertyOwner>> {
    try {
      const response = await fetch(`${this.baseUrl}/property-owners/${id}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      return this.handleResponse<PropertyOwner>(response);
    } catch (error) {
      console.error('Get property owner by ID error:', error);
      return {
        success: false,
        error: 'Error al obtener el propietario',
      };
    }
  }

  async createPropertyOwner(ownerData: {
    email: string;
    password: string;
    contactName: string;
    companyName?: string;
    phone?: string;
    taxId?: string;
    permissions?: any;
  }): Promise<ApiResponse<PropertyOwner>> {
    try {
      const response = await fetch(`${this.baseUrl}/property-owners`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(ownerData),
      });

      return this.handleResponse<PropertyOwner>(response);
    } catch (error) {
      console.error('Create property owner error:', error);
      return {
        success: false,
        error: 'Error al crear propietario',
      };
    }
  }

  async updatePropertyOwner(id: string, ownerData: {
    contactName?: string;
    companyName?: string;
    phone?: string;
    taxId?: string;
    permissions?: any;
  }): Promise<ApiResponse<PropertyOwner>> {
    try {
      const response = await fetch(`${this.baseUrl}/property-owners/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(ownerData),
      });

      return this.handleResponse<PropertyOwner>(response);
    } catch (error) {
      console.error('Update property owner error:', error);
      return {
        success: false,
        error: 'Error al actualizar propietario',
      };
    }
  }

  async deletePropertyOwner(id: string): Promise<ApiResponse<{message: string}>> {
    try {
      const response = await fetch(`${this.baseUrl}/property-owners/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      return this.handleResponse<{message: string}>(response);
    } catch (error) {
      console.error('Delete property owner error:', error);
      return {
        success: false,
        error: 'Error al eliminar propietario',
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