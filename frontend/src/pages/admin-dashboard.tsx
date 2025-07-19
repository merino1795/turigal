import React, { useState, useEffect } from 'react';
import { 
  Bell, Users, Calendar, MessageSquare, AlertTriangle, CheckCircle, 
  Clock, Settings, BarChart, Home, UserCheck, UserX, Camera, 
  CreditCard, MapPin, Phone, Mail, Star, Filter, Search, 
  RefreshCw, Download, Send, Archive, Eye, EyeOff, Trash2,
  ChevronDown, ChevronRight, Building, Wifi, Car, Coffee,
  Shield, DollarSign, FileText, Image, Video, Headphones,
  Zap, Activity, TrendingUp, TrendingDown, Plus, X, Edit,
  Bed, Scissors, Wrench, PaintBucket, Package,
  Receipt, Banknote, Calculator, PieChart, BarChart3,
  UserPlus, ClipboardList, Briefcase, HardHat,
  Globe, Database, Key, Lock, UserCog, Folder, Upload,
  LineChart, Target, Award, BookOpen, Percent, ShoppingCart,
  Smartphone, AtSign, Megaphone, Printer, FileSpreadsheet,
  Monitor, Palette, Layout, Grid, Maximize, Minimize,
  CheckSquare, ListTodo, Flag, Timer, Bookmark
} from 'lucide-react';

const AdminDashboard = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [notifications, setNotifications] = useState([]);
  const [guests, setGuests] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [staff, setStaff] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [chatMessages, setChatMessages] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [dashboardWidgets, setDashboardWidgets] = useState([
    'metrics', 'notifications', 'activity', 'revenue'
  ]);

  const [realTimeData, setRealTimeData] = useState({
    activeGuests: 12,
    checkInsToday: 8,
    checkOutsToday: 5,
    pendingPayments: 3,
    overdueCheckouts: 1,
    chatMessages: 7,
    totalRevenue: 12850.50,
    occupancyRate: 78,
    avgStayDuration: 2.3,
    customerSatisfaction: 4.7
  });

  // Datos simulados expandidos
  const mockNotifications = [
    {
      id: 1,
      type: 'checkin_completed',
      guest: 'Juan García',
      room: '205',
      time: '14:32',
      status: 'unread',
      priority: 'normal',
      details: 'Check-in completado. Documentos verificados y datos enviados a SES.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50'
    },
    {
      id: 2,
      type: 'payment_received',
      guest: 'María López',
      room: '308',
      time: '14:15',
      status: 'unread',
      priority: 'normal',
      details: 'Pago de €156.00 recibido por Bizum. Reserva completamente pagada.',
      amount: 156.00
    },
    {
      id: 3,
      type: 'checkout_overdue',
      guest: 'Carlos Fernández',
      room: '102',
      time: '12:30',
      status: 'unread',
      priority: 'high',
      details: 'Check-out no realizado. Hora límite: 11:00. Contactar al huésped.',
      overdue: '1h 30m'
    },
    {
      id: 4,
      type: 'maintenance_request',
      guest: 'Ana Martín',
      room: '407',
      time: '13:45',
      status: 'unread',
      priority: 'medium',
      details: 'Solicitud de mantenimiento: "Aire acondicionado no funciona correctamente"',
      issue: 'Aire acondicionado'
    },
    {
      id: 5,
      type: 'cleaning_completed',
      staff: 'Carmen Rodríguez',
      room: '301',
      time: '11:20',
      status: 'read',
      priority: 'normal',
      details: 'Limpieza completada. Habitación lista para nuevo huésped.',
    }
  ];

  const mockRooms = [
    {
      id: '101',
      type: 'Standard',
      status: 'occupied',
      guest: 'Juan García',
      checkOut: '2025-07-22',
      lastCleaning: '2025-07-20',
      issues: [],
      amenities: ['WiFi', 'TV', 'AC'],
      revenue: 189.50
    },
    {
      id: '102',
      type: 'Standard',
      status: 'checkout_pending',
      guest: 'Carlos Fernández',
      checkOut: '2025-07-20',
      lastCleaning: '2025-07-18',
      issues: ['overdue'],
      amenities: ['WiFi', 'TV'],
      revenue: 165.00
    },
    {
      id: '201',
      type: 'Suite',
      status: 'cleaning',
      staff: 'Carmen Rodríguez',
      lastCleaning: '2025-07-20',
      issues: [],
      amenities: ['WiFi', 'TV', 'AC', 'Jacuzzi'],
      revenue: 0
    },
    {
      id: '205',
      type: 'Suite',
      status: 'occupied',
      guest: 'María López',
      checkOut: '2025-07-21',
      lastCleaning: '2025-07-19',
      issues: [],
      amenities: ['WiFi', 'TV', 'AC', 'Jacuzzi', 'Balcón'],
      revenue: 245.50
    },
    {
      id: '301',
      type: 'Deluxe',
      status: 'available',
      lastCleaning: '2025-07-20',
      issues: [],
      amenities: ['WiFi', 'TV', 'AC', 'Minibar'],
      revenue: 0
    },
    {
      id: '302',
      type: 'Deluxe',
      status: 'maintenance',
      issue: 'Aire acondicionado',
      staff: 'Miguel Torres',
      lastMaintenance: '2025-07-20',
      amenities: ['WiFi', 'TV', 'Minibar'],
      revenue: 0
    }
  ];

  const mockStaff = [
    {
      id: 1,
      name: 'Carmen Rodríguez',
      role: 'Limpieza',
      status: 'active',
      shift: 'Mañana',
      location: 'Planta 2',
      tasks: ['Hab. 201', 'Hab. 202'],
      phone: '+34 666 111 222',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332906c?w=50'
    },
    {
      id: 2,
      name: 'Miguel Torres',
      role: 'Mantenimiento',
      status: 'active',
      shift: 'Tarde',
      location: 'Hab. 302',
      tasks: ['AC Reparación'],
      phone: '+34 666 333 444',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50'
    },
    {
      id: 3,
      name: 'Laura Vázquez',
      role: 'Recepción',
      status: 'active',
      shift: 'Noche',
      location: 'Recepción',
      tasks: ['Check-ins nocturnos'],
      phone: '+34 666 555 666',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50'
    }
  ];

  const mockChatMessages = [
    {
      id: 1,
      guest: 'Juan García',
      room: '205',
      messages: [
        { sender: 'guest', text: '¿A qué hora es el desayuno?', time: '14:30' },
        { sender: 'admin', text: 'El desayuno se sirve de 7:00 a 10:30', time: '14:32' },
        { sender: 'guest', text: 'Perfecto, gracias', time: '14:33' }
      ],
      unread: 0,
      lastMessage: '14:33'
    },
    {
      id: 2,
      guest: 'María López',
      room: '308',
      messages: [
        { sender: 'guest', text: '¿Podrían traer toallas extra?', time: '15:20' }
      ],
      unread: 1,
      lastMessage: '15:20'
    }
  ];

  useEffect(() => {
    setNotifications(mockNotifications);
    setRooms(mockRooms);
    setStaff(mockStaff);
    setChatMessages(mockChatMessages);

    // Simular actualizaciones en tiempo real
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const newNotification = {
          id: Date.now(),
          type: ['checkin_completed', 'payment_received', 'chat_message', 'maintenance_request'][Math.floor(Math.random() * 4)],
          guest: ['Ana García', 'Luis Pérez', 'Sara Martín'][Math.floor(Math.random() * 3)],
          room: ['10' + Math.floor(Math.random() * 9), '20' + Math.floor(Math.random() * 9)][Math.floor(Math.random() * 2)],
          time: new Date().toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'}),
          status: 'unread',
          priority: ['normal', 'medium', 'high'][Math.floor(Math.random() * 3)],
          details: 'Nueva actividad detectada'
        };
        setNotifications(prev => [newNotification, ...prev.slice(0, 19)]);
      }
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  // Función para obtener icono según tipo
  const getNotificationIcon = (type) => {
    switch(type) {
      case 'checkin_completed': return <UserCheck className="w-5 h-5 text-green-600" />;
      case 'checkout_completed': return <UserX className="w-5 h-5 text-blue-600" />;
      case 'checkout_overdue': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'payment_received': return <CreditCard className="w-5 h-5 text-green-600" />;
      case 'payment_pending': return <DollarSign className="w-5 h-5 text-yellow-600" />;
      case 'chat_message': return <MessageSquare className="w-5 h-5 text-blue-600" />;
      case 'maintenance_request': return <Wrench className="w-5 h-5 text-orange-600" />;
      case 'cleaning_completed': return <Scissors className="w-5 h-5 text-green-600" />;
      default: return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'normal': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getRoomStatusColor = (status) => {
    switch(status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'occupied': return 'bg-blue-100 text-blue-800';
      case 'cleaning': return 'bg-yellow-100 text-yellow-800';
      case 'maintenance': return 'bg-red-100 text-red-800';
      case 'checkout_pending': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Dashboard Principal Expandido
  const DashboardView = () => (
    <div className="space-y-6">
      {/* Métricas principales expandidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Huéspedes Activos</p>
              <p className="text-3xl font-bold text-gray-800">{realTimeData.activeGuests}</p>
            </div>
            <Users className="w-12 h-12 text-blue-500" />
          </div>
          <div className="mt-2 text-sm text-green-600">
            <TrendingUp className="w-4 h-4 inline mr-1" />
            +2 desde ayer
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ingresos Hoy</p>
              <p className="text-3xl font-bold text-gray-800">€{realTimeData.totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="w-12 h-12 text-green-500" />
          </div>
          <div className="mt-2 text-sm text-green-600">
            <TrendingUp className="w-4 h-4 inline mr-1" />
            +15% vs ayer
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ocupación</p>
              <p className="text-3xl font-bold text-gray-800">{realTimeData.occupancyRate}%</p>
            </div>
            <Bed className="w-12 h-12 text-purple-500" />
          </div>
          <div className="mt-2 text-sm text-purple-600">
            <Target className="w-4 h-4 inline mr-1" />
            Meta: 85%
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Satisfacción</p>
              <p className="text-3xl font-bold text-gray-800">{realTimeData.customerSatisfaction}/5</p>
            </div>
            <Star className="w-12 h-12 text-yellow-500" />
          </div>
          <div className="mt-2 text-sm text-yellow-600">
            <Award className="w-4 h-4 inline mr-1" />
            Excelente
          </div>
        </div>
      </div>

      {/* Widgets personalizables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mapa de habitaciones en tiempo real */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">🏨 Mapa de Habitaciones</h3>
            <button 
              onClick={() => setCurrentView('rooms')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Ver gestión completa
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {rooms.slice(0, 9).map(room => (
              <div 
                key={room.id}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                  room.status === 'available' ? 'border-green-300 bg-green-50' :
                  room.status === 'occupied' ? 'border-blue-300 bg-blue-50' :
                  room.status === 'cleaning' ? 'border-yellow-300 bg-yellow-50' :
                  room.status === 'maintenance' ? 'border-red-300 bg-red-50' :
                  'border-orange-300 bg-orange-50'
                }`}
                onClick={() => {
                  setSelectedRoom(room);
                  setCurrentView('rooms');
                }}
              >
                <div className="text-center">
                  <p className="font-bold text-gray-800">{room.id}</p>
                  <p className="text-xs text-gray-600">{room.type}</p>
                  {room.guest && <p className="text-xs text-gray-500 mt-1">{room.guest}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Centro de comunicaciones */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">💬 Centro de Comunicaciones</h3>
            <button 
              onClick={() => setCurrentView('messages')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Abrir chat completo
            </button>
          </div>
          <div className="space-y-3">
            {chatMessages.slice(0, 4).map(chat => (
              <div key={chat.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{chat.guest}</p>
                    <p className="text-sm text-gray-600">Hab. {chat.room}</p>
                  </div>
                </div>
                <div className="text-right">
                  {chat.unread > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {chat.unread}
                    </span>
                  )}
                  <p className="text-xs text-gray-500 mt-1">{chat.lastMessage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Personal y tareas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">👥 Personal Activo</h3>
            <button 
              onClick={() => setCurrentView('staff')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Gestionar
            </button>
          </div>
          <div className="space-y-3">
            {staff.map(member => (
              <div key={member.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full" />
                <div className="flex-1">
                  <p className="font-medium text-gray-800 text-sm">{member.name}</p>
                  <p className="text-xs text-gray-600">{member.role} • {member.location}</p>
                </div>
                <div className={`w-2 h-2 rounded-full ${member.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              </div>
            ))}
          </div>
        </div>

        {/* Ingresos y pagos */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">💰 Resumen Financiero</h3>
            <button 
              onClick={() => setCurrentView('payments')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Ver detalles
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-green-800">Ingresos hoy</span>
              <span className="font-bold text-green-800">€{realTimeData.totalRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <span className="text-sm font-medium text-yellow-800">Pendientes</span>
              <span className="font-bold text-yellow-800">€468.00</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-blue-800">Promedio/noche</span>
              <span className="font-bold text-blue-800">€187.50</span>
            </div>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">📊 Estadísticas Rápidas</h3>
            <button 
              onClick={() => setCurrentView('analytics')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Ver reportes
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Estancia promedio</span>
              <span className="font-bold text-gray-800">{realTimeData.avgStayDuration} días</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Check-ins hoy</span>
              <span className="font-bold text-gray-800">{realTimeData.checkInsToday}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Check-outs hoy</span>
              <span className="font-bold text-gray-800">{realTimeData.checkOutsToday}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Habitaciones limpias</span>
              <span className="font-bold text-gray-800">8/12</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Vista de Gestión de Habitaciones
  const RoomsView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">🏨 Gestión de Habitaciones</h2>
        <div className="flex space-x-2">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">
            <Plus className="w-4 h-4 inline mr-1" />
            Nueva Reserva
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
            <Scissors className="w-4 h-4 inline mr-1" />
            Programar Limpieza
          </button>
        </div>
      </div>

      {/* Filtros y estadísticas de habitaciones */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-green-800 font-medium">Disponibles</span>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-800">{rooms.filter(r => r.status === 'available').length}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-blue-800 font-medium">Ocupadas</span>
            <Bed className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-800">{rooms.filter(r => r.status === 'occupied').length}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-yellow-800 font-medium">Limpieza</span>
            <Scissors className="w-5 h-5 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-yellow-800">{rooms.filter(r => r.status === 'cleaning').length}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-red-800 font-medium">Mantenimiento</span>
            <Wrench className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-red-800">{rooms.filter(r => r.status === 'maintenance').length}</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-orange-800 font-medium">Check-out</span>
            <Clock className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-orange-800">{rooms.filter(r => r.status === 'checkout_pending').length}</p>
        </div>
      </div>

      {/* Mapa visual de habitaciones */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Mapa Visual de Habitaciones</h3>
        <div className="grid grid-cols-6 gap-4">
          {rooms.map(room => (
            <div 
              key={room.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-lg ${
                room.status === 'available' ? 'border-green-300 bg-green-50 hover:bg-green-100' :
                room.status === 'occupied' ? 'border-blue-300 bg-blue-50 hover:bg-blue-100' :
                room.status === 'cleaning' ? 'border-yellow-300 bg-yellow-50 hover:bg-yellow-100' :
                room.status === 'maintenance' ? 'border-red-300 bg-red-50 hover:bg-red-100' :
                'border-orange-300 bg-orange-50 hover:bg-orange-100'
              }`}
              onClick={() => setSelectedRoom(room)}
            >
              <div className="text-center">
                <p className="font-bold text-lg text-gray-800">{room.id}</p>
                <p className="text-xs text-gray-600 mb-2">{room.type}</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoomStatusColor(room.status)}`}>
                  {room.status === 'available' ? 'Libre' :
                   room.status === 'occupied' ? 'Ocupada' :
                   room.status === 'cleaning' ? 'Limpieza' :
                   room.status === 'maintenance' ? 'Manten.' :
                   'Check-out'}
                </span>
                {room.guest && <p className="text-xs text-gray-500 mt-2">{room.guest}</p>}
                {room.revenue > 0 && <p className="text-xs font-bold text-green-600 mt-1">€{room.revenue}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Panel de detalles de habitación */}
      {selectedRoom && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Detalles - Habitación {selectedRoom.id}</h3>
            <button 
              onClick={() => setSelectedRoom(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Información General</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Tipo:</strong> {selectedRoom.type}</p>
                  <p><strong>Estado:</strong> 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getRoomStatusColor(selectedRoom.status)}`}>
                      {selectedRoom.status}
                    </span>
                  </p>
                  {selectedRoom.guest && <p><strong>Huésped:</strong> {selectedRoom.guest}</p>}
                  {selectedRoom.checkOut && <p><strong>Check-out:</strong> {selectedRoom.checkOut}</p>}
                  <p><strong>Última limpieza:</strong> {selectedRoom.lastCleaning}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Servicios</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedRoom.amenities.map((amenity, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Acciones Rápidas</h4>
                <div className="space-y-2">
                  <button className="w-full bg-green-600 text-white py-2 px-3 rounded text-sm">
                    <Scissors className="w-4 h-4 inline mr-2" />
                    Programar Limpieza
                  </button>
                  <button className="w-full bg-orange-600 text-white py-2 px-3 rounded text-sm">
                    <Wrench className="w-4 h-4 inline mr-2" />
                    Solicitar Mantenimiento
                  </button>
                  <button className="w-full bg-blue-600 text-white py-2 px-3 rounded text-sm">
                    <Eye className="w-4 h-4 inline mr-2" />
                    Ver Historial
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Ingresos</h4>
                <p className="text-2xl font-bold text-green-600">€{selectedRoom.revenue}</p>
                <p className="text-sm text-gray-600">Esta estancia</p>
              </div>
              
              {selectedRoom.issues.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Incidencias</h4>
                  <div className="space-y-2">
                    {selectedRoom.issues.map((issue, index) => (
                      <div key={index} className="bg-red-50 border border-red-200 p-2 rounded text-sm">
                        <AlertTriangle className="w-4 h-4 text-red-600 inline mr-2" />
                        {issue}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Vista de Gestión de Personal
  const StaffView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">👥 Gestión de Personal</h2>
        <div className="flex space-x-2">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">
            <UserPlus className="w-4 h-4 inline mr-1" />
            Añadir Personal
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
            <ClipboardList className="w-4 h-4 inline mr-1" />
            Programar Turnos
          </button>
        </div>
      </div>

      {/* Estadísticas de personal */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-green-50 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Personal Activo</p>
              <p className="text-3xl font-bold text-green-800">{staff.filter(s => s.status === 'active').length}</p>
            </div>
            <Users className="w-12 h-12 text-green-500" />
          </div>
        </div>
        <div className="bg-blue-50 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Tareas Pendientes</p>
              <p className="text-3xl font-bold text-blue-800">8</p>
            </div>
            <ClipboardList className="w-12 h-12 text-blue-500" />
          </div>
        </div>
        <div className="bg-yellow-50 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600">Turno Actual</p>
              <p className="text-3xl font-bold text-yellow-800">Tarde</p>
            </div>
            <Clock className="w-12 h-12 text-yellow-500" />
          </div>
        </div>
        <div className="bg-purple-50 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600">Eficiencia</p>
              <p className="text-3xl font-bold text-purple-800">94%</p>
            </div>
            <Target className="w-12 h-12 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Lista detallada de personal */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Personal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ubicación</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tareas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {staff.map(member => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                        <div className="text-sm text-gray-500">{member.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        member.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                      }`}></div>
                      <span className="text-sm text-gray-900">{member.shift}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {member.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      {member.tasks.map((task, index) => (
                        <span key={index} className="block text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                          {task}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <MessageSquare className="w-4 h-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      <Phone className="w-4 h-4" />
                    </button>
                    <button className="text-purple-600 hover:text-purple-900">
                      <ClipboardList className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Asignación de tareas */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Asignación Rápida de Tareas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-800">Limpieza</h4>
            <div className="space-y-2">
              {['Hab. 301', 'Hab. 302', 'Hab. 403'].map((room, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                  <span className="text-sm">{room}</span>
                  <select className="text-xs border rounded px-2 py-1">
                    <option>Carmen R.</option>
                    <option>María S.</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-gray-800">Mantenimiento</h4>
            <div className="space-y-2">
              {['AC Hab. 205', 'Fontanería 3ª planta'].map((task, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded">
                  <span className="text-sm">{task}</span>
                  <select className="text-xs border rounded px-2 py-1">
                    <option>Miguel T.</option>
                    <option>Luis P.</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-gray-800">Recepción</h4>
            <div className="space-y-2">
              {['Check-in 15:00', 'Atención telefónica'].map((task, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                  <span className="text-sm">{task}</span>
                  <select className="text-xs border rounded px-2 py-1">
                    <option>Laura V.</option>
                    <option>Ana M.</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Vista de Gestión de Pagos
  const PaymentsView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">💰 Gestión de Pagos</h2>
        <div className="flex space-x-2">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">
            <Plus className="w-4 h-4 inline mr-1" />
            Nuevo Cargo
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
            <Download className="w-4 h-4 inline mr-1" />
            Exportar
          </button>
        </div>
      </div>

      {/* Métricas financieras */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-green-50 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Ingresos Hoy</p>
              <p className="text-3xl font-bold text-green-800">€{realTimeData.totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="w-12 h-12 text-green-500" />
          </div>
          <div className="mt-2 text-sm text-green-600">+15% vs ayer</div>
        </div>
        <div className="bg-yellow-50 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600">Pendientes</p>
              <p className="text-3xl font-bold text-yellow-800">€468.00</p>
            </div>
            <Clock className="w-12 h-12 text-yellow-500" />
          </div>
          <div className="mt-2 text-sm text-yellow-600">3 reservas</div>
        </div>
        <div className="bg-blue-50 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Procesados</p>
              <p className="text-3xl font-bold text-blue-800">€11,240</p>
            </div>
            <CreditCard className="w-12 h-12 text-blue-500" />
          </div>
          <div className="mt-2 text-sm text-blue-600">Esta semana</div>
        </div>
        <div className="bg-purple-50 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600">Promedio</p>
              <p className="text-3xl font-bold text-purple-800">€187</p>
            </div>
            <BarChart className="w-12 h-12 text-purple-500" />
          </div>
          <div className="mt-2 text-sm text-purple-600">Por noche</div>
        </div>
      </div>

      {/* Transacciones recientes */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-800">Transacciones Recientes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Huésped</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Concepto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Método</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Importe</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                { guest: 'Juan García', concept: 'Estancia 2 noches', method: 'Tarjeta', amount: 245.50, status: 'Completado', date: '20/07/2025' },
                { guest: 'María López', concept: 'Servicios Spa', method: 'Bizum', amount: 89.00, status: 'Completado', date: '20/07/2025' },
                { guest: 'Carlos Fernández', concept: 'Estancia 1 noche', method: 'Efectivo', amount: 165.00, status: 'Pendiente', date: '19/07/2025' },
                { guest: 'Ana Martín', concept: 'Minibar', method: 'Tarjeta', amount: 25.50, status: 'Completado', date: '19/07/2025' }
              ].map((transaction, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.guest}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.concept}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.method}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    €{transaction.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      transaction.status === 'Completado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      <Receipt className="w-4 h-4" />
                    </button>
                    <button className="text-purple-600 hover:text-purple-900">
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gráfico de ingresos */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Evolución de Ingresos</h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <BarChart3 className="w-12 h-12 mx-auto mb-4" />
            <p>Gráfico de ingresos por día/semana/mes</p>
            <p className="text-sm">Integración con biblioteca de gráficos</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Vista de Analytics y Reportes
  const AnalyticsView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">📊 Analytics & Reportes</h2>
        <div className="flex space-x-2">
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option>Última semana</option>
            <option>Último mes</option>
            <option>Último trimestre</option>
            <option>Último año</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
            <Download className="w-4 h-4 inline mr-1" />
            Exportar Reporte
          </button>
        </div>
      </div>

      {/* KPIs principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Ocupación Promedio</p>
              <p className="text-3xl font-bold">{realTimeData.occupancyRate}%</p>
            </div>
            <Target className="w-12 h-12 text-blue-200" />
          </div>
          <div className="mt-2 text-blue-100">
            <TrendingUp className="w-4 h-4 inline mr-1" />
            +5% vs mes anterior
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">RevPAR</p>
              <p className="text-3xl font-bold">€146</p>
            </div>
            <DollarSign className="w-12 h-12 text-green-200" />
          </div>
          <div className="mt-2 text-green-100">
            <TrendingUp className="w-4 h-4 inline mr-1" />
            +12% vs mes anterior
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Estancia Media</p>
              <p className="text-3xl font-bold">{realTimeData.avgStayDuration} días</p>
            </div>
            <Calendar className="w-12 h-12 text-purple-200" />
          </div>
          <div className="mt-2 text-purple-100">
            <TrendingUp className="w-4 h-4 inline mr-1" />
            +0.3 días vs mes anterior
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100">Satisfacción</p>
              <p className="text-3xl font-bold">{realTimeData.customerSatisfaction}/5</p>
            </div>
            <Star className="w-12 h-12 text-yellow-200" />
          </div>
          <div className="mt-2 text-yellow-100">
            <Award className="w-4 h-4 inline mr-1" />
            Excelente rating
          </div>
        </div>
      </div>

      {/* Gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Ocupación por Mes</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <LineChart className="w-12 h-12 mx-auto mb-4" />
              <p>Gráfico de líneas - Ocupación mensual</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Ingresos por Tipo de Habitación</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <PieChart className="w-12 h-12 mx-auto mb-4" />
              <p>Gráfico circular - Ingresos por tipo</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reportes detallados */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Reportes Disponibles</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Reporte de Ocupación', description: 'Análisis detallado de ocupación por período', icon: BarChart },
            { title: 'Reporte Financiero', description: 'Ingresos, gastos y rentabilidad', icon: DollarSign },
            { title: 'Reporte de Huéspedes', description: 'Perfil y comportamiento de clientes', icon: Users },
            { title: 'Reporte de Satisfacción', description: 'Análisis de reviews y feedback', icon: Star },
            { title: 'Reporte Operacional', description: 'Eficiencia de personal y procesos', icon: Activity },
            { title: 'Reporte de Competencia', description: 'Comparación con hoteles similares', icon: Target }
          ].map((report, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center space-x-3 mb-2">
                <report.icon className="w-6 h-6 text-blue-600" />
                <h4 className="font-medium text-gray-800">{report.title}</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">{report.description}</p>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Generar →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Vista de Mensajes/Chat
  const MessagesView = () => (
    <div className="h-full flex">
      {/* Lista de conversaciones */}
      <div className="w-1/3 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-800">💬 Conversaciones</h3>
          <div className="mt-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar conversación..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        </div>
        <div className="overflow-y-auto">
          {chatMessages.map(chat => (
            <div 
              key={chat.id}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                activeChat?.id === chat.id ? 'bg-blue-50 border-blue-200' : ''
              }`}
              onClick={() => setActiveChat(chat)}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-800">{chat.guest}</h4>
                <span className="text-xs text-gray-500">{chat.lastMessage}</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Hab. {chat.room}</p>
                {chat.unread > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {chat.unread}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1 truncate">
                {chat.messages[chat.messages.length - 1]?.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Panel de chat */}
      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <>
            {/* Header del chat */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-800">{activeChat.guest}</h3>
                  <p className="text-sm text-gray-600">Habitación {activeChat.room}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {activeChat.messages.map((message, index) => (
                <div key={index} className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === 'admin' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-800 border'
                  }`}>
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'admin' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input de mensaje */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && newMessage.trim()) {
                      const updatedChat = {
                        ...activeChat,
                        messages: [...activeChat.messages, {
                          sender: 'admin',
                          text: newMessage,
                          time: new Date().toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'})
                        }]
                      };
                      setChatMessages(prev => prev.map(chat => 
                        chat.id === activeChat.id ? updatedChat : chat
                      ));
                      setActiveChat(updatedChat);
                      setNewMessage('');
                    }
                  }}
                />
                <button 
                  onClick={() => {
                    if (newMessage.trim()) {
                      const updatedChat = {
                        ...activeChat,
                        messages: [...activeChat.messages, {
                          sender: 'admin',
                          text: newMessage,
                          time: new Date().toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'})
                        }]
                      };
                      setChatMessages(prev => prev.map(chat => 
                        chat.id === activeChat.id ? updatedChat : chat
                      ));
                      setActiveChat(updatedChat);
                      setNewMessage('');
                    }
                  }}
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Selecciona una conversación para comenzar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Vista de Configuración
  const SettingsView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">⚙️ Configuración del Sistema</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
          <Download className="w-4 h-4 inline mr-1" />
          Exportar Configuración
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuración del hotel */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">🏨 Información del Hotel</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Hotel</label>
              <input type="text" value="Hotel Vista Mar" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
              <input type="text" value="Rúa da Praia 15, Vigo" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
              <input type="text" value="+34 986 123 456" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input type="email" value="info@hotelvistamr.com" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
          </div>
        </div>

        {/* Configuración de check-in/out */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">🕐 Horarios y Políticas</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hora de Check-in</label>
              <input type="time" value="15:00" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hora de Check-out</label>
              <input type="time" value="11:00" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tiempo de gracia (minutos)</label>
              <input type="number" value="30" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
            <div className="flex items-center">
              <input type="checkbox" checked className="mr-2" />
              <label className="text-sm text-gray-700">Permitir check-in anticipado</label>
            </div>
          </div>
        </div>

        {/* Configuración de notificaciones */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">🔔 Notificaciones</h3>
          <div className="space-y-4">
            {[
              'Check-in completado',
              'Check-out retrasado',
              'Pago recibido',
              'Nuevo mensaje de huésped',
              'Solicitud de mantenimiento',
              'Limpieza completada'
            ].map((notification, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{notification}</span>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Integraciones */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">🔗 Integraciones</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                  <Database className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">SES Hospedajes</p>
                  <p className="text-sm text-gray-600">Sistema oficial de registro</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600">Conectado</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Pasarela de Pago</p>
                  <p className="text-sm text-gray-600">Procesamiento de pagos</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600">Conectado</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded flex items-center justify-center">
                  <Mail className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Email Marketing</p>
                  <p className="text-sm text-gray-600">Comunicaciones automáticas</p>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-800 text-sm">Configurar</button>
            </div>
          </div>
        </div>
      </div>

      {/* Configuración avanzada */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">🔧 Configuración Avanzada</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium text-gray-800 mb-3">Seguridad</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Autenticación 2FA</span>
                <input type="checkbox" className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Logs de actividad</span>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Sesiones seguras</span>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-800 mb-3">Automatización</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Check-in automático</span>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Emails de bienvenida</span>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Recordatorios check-out</span>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-800 mb-3">Datos</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Backup automático</span>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Retención de logs</span>
                <select className="text-xs border rounded px-2 py-1">
                  <option>30 días</option>
                  <option>90 días</option>
                  <option>1 año</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Exportación GDPR</span>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Navegación lateral expandida
  const Sidebar = () => {
    const navItems = [
      { id: 'dashboard', icon: Home, label: 'Dashboard', badge: null },
      { id: 'notifications', icon: Bell, label: 'Notificaciones', badge: notifications.filter(n => n.status === 'unread').length },
      { id: 'guests', icon: Users, label: 'Huéspedes', badge: null },
      { id: 'rooms', icon: Bed, label: 'Habitaciones', badge: rooms.filter(r => r.status === 'maintenance').length },
      { id: 'messages', icon: MessageSquare, label: 'Mensajes', badge: chatMessages.reduce((acc, chat) => acc + chat.unread, 0) },
      { id: 'staff', icon: HardHat, label: 'Personal', badge: null },
      { id: 'payments', icon: CreditCard, label: 'Pagos', badge: realTimeData.pendingPayments },
      { id: 'analytics', icon: BarChart, label: 'Analytics', badge: null },
      { id: 'settings', icon: Settings, label: 'Configuración', badge: null }
    ];

    return (
      <div className="w-64 bg-white shadow-lg h-screen flex flex-col">
        {/* Header del sidebar */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">TurisGal Admin</h2>
              <p className="text-sm text-gray-500">Hotel Vista Mar</p>
            </div>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map(item => (
              <li key={item.id}>
                <button
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                    currentView === item.id 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.badge && item.badge > 0 && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      currentView === item.id ? 'bg-white text-blue-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer del sidebar */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40" 
              alt="Admin" 
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="text-sm font-medium text-gray-800">Admin Hotel</p>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-xs text-gray-500">En línea</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Header principal expandido
  const Header = () => (
    <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {currentView === 'dashboard' && '📊 Dashboard Principal'}
            {currentView === 'notifications' && '🔔 Centro de Notificaciones'}
            {currentView === 'guests' && '👥 Gestión de Huéspedes'}
            {currentView === 'rooms' && '🏨 Gestión de Habitaciones'}
            {currentView === 'messages' && '💬 Centro de Mensajes'}
            {currentView === 'staff' && '👷 Gestión de Personal'}
            {currentView === 'payments' && '💰 Gestión de Pagos'}
            {currentView === 'analytics' && '📈 Analytics & Reportes'}
            {currentView === 'settings' && '⚙️ Configuración del Sistema'}
          </h1>
          <p className="text-gray-600">
            {new Date().toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Indicadores de estado */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-700 font-medium">Sistema activo</span>
            </div>
            
            <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg">
              <Wifi className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-700 font-medium">TurisGal conectado</span>
            </div>
          </div>
          
          {/* Notificaciones rápidas */}
          <div className="relative">
            <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-gray-800" />
            {notifications.filter(n => n.status === 'unread').length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notifications.filter(n => n.status === 'unread').length}
              </span>
            )}
          </div>

          {/* Acciones rápidas */}
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <RefreshCw className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render principal
  const renderCurrentView = () => {
    switch(currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'notifications':
        return <NotificationsView />;
      case 'guests':
        return <GuestsView />;
      case 'rooms':
        return <RoomsView />;
      case 'messages':
        return <MessagesView />;
      case 'staff':
        return <StaffView />;
      case 'payments':
        return <PaymentsView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;