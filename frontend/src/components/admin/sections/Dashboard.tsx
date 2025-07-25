// src/components/admin/sections/Dashboard.tsx
import React from 'react';
import { TrendingUp, UserCheck, Hotel, AlertTriangle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = {
    occupancyRate: 78,
    todayCheckIns: 12,
    todayCheckOuts: 8,
    totalProperties: 15,
    activeProperties: 12,
    pendingIncidents: 5,
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Ocupación</p>
              <p className="text-3xl font-bold text-gray-800">{stats.occupancyRate}%</p>
              <p className="text-green-600 text-sm">↗ +5% vs ayer</p>
            </div>
            <TrendingUp className="w-12 h-12 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Check-ins Hoy</p>
              <p className="text-3xl font-bold text-gray-800">{stats.todayCheckIns}</p>
              <p className="text-blue-600 text-sm">Check-outs: {stats.todayCheckOuts}</p>
            </div>
            <UserCheck className="w-12 h-12 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Propiedades</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalProperties}</p>
              <p className="text-purple-600 text-sm">{stats.activeProperties} activas</p>
            </div>
            <Hotel className="w-12 h-12 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Incidencias</p>
              <p className="text-3xl font-bold text-gray-800">{stats.pendingIncidents}</p>
              <p className="text-red-600 text-sm">Pendientes</p>
            </div>
            <AlertTriangle className="w-12 h-12 text-red-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">🎯 Bienvenido al Panel de TurisGal</h3>
        <p className="text-gray-600 mb-4">
          Desde aquí puedes gestionar todas las operaciones de tu plataforma de check-in digital.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">📊 Estadísticas en tiempo real</h4>
            <p className="text-sm text-blue-600">
              Monitoriza la ocupación, check-ins y satisfacción de los huéspedes.
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">🏠 Gestión de propiedades</h4>
            <p className="text-sm text-green-600">
              Administra tus alojamientos, habitaciones y servicios desde la sección de propiedades.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;