import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Limpiar datos existentes (opcional)
  console.log('🧹 Limpiando datos existentes...');
  await prisma.review.deleteMany();
  await prisma.checkOut.deleteMany();
  await prisma.checkIn.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.room.deleteMany();
  await prisma.property.deleteMany();
  await prisma.propertyOwner.deleteMany();
  await prisma.user.deleteMany();

  const saltRounds = 10;

  // ===== CREAR USUARIOS =====
  console.log('👥 Creando usuarios de ejemplo...');

  // Admin principal
  const adminPassword = await bcrypt.hash('admin123', saltRounds);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@turisgal.com',
      firstName: 'Carlos',
      lastName: 'Administrador',
      passwordHash: adminPassword,
      role: 'ADMIN',
      isVerified: true,
    },
  });

  // Manager/Owner
  const managerPassword = await bcrypt.hash('manager123', saltRounds);
  const manager = await prisma.user.create({
    data: {
      email: 'manager@turisgal.com',
      firstName: 'Ana',
      lastName: 'Manager',
      passwordHash: managerPassword,
      role: 'OWNER',
      isVerified: true,
    },
  });

  // Usuario normal
  const userPassword = await bcrypt.hash('user123', saltRounds);
  const user = await prisma.user.create({
    data: {
      email: 'user@turisgal.com',
      firstName: 'Juan',
      lastName: 'Usuario',
      passwordHash: userPassword,
      role: 'USER',
      isVerified: true,
    },
  });

  // Usuario no verificado
  const unverifiedPassword = await bcrypt.hash('test123', saltRounds);
  const unverifiedUser = await prisma.user.create({
    data: {
      email: 'test@ejemplo.com',
      firstName: 'María',
      lastName: 'Test',
      passwordHash: unverifiedPassword,
      role: 'USER',
      isVerified: false,
    },
  });

  console.log('✅ Usuarios creados:');
  console.log(`   👑 Admin: ${admin.email} (contraseña: admin123)`);
  console.log(`   🏢 Manager: ${manager.email} (contraseña: manager123)`);
  console.log(`   👤 Usuario: ${user.email} (contraseña: user123)`);
  console.log(`   🚫 Sin verificar: ${unverifiedUser.email} (contraseña: test123)`);

  // ===== CREAR PROPIETARIOS =====
  console.log('\n🏢 Creando propietarios de ejemplo...');

  const owner1Password = await bcrypt.hash('owner123', saltRounds);
  const owner1 = await prisma.propertyOwner.create({
    data: {
      email: 'propietario1@turisgal.com',
      passwordHash: owner1Password,
      contactName: 'Miguel Fernández',
      companyName: 'Galicia Turismo SL',
      phone: '+34 981 123 456',
      taxId: 'B15123456',
      permissions: {
        canManageProperties: true,
        canViewReports: true,
        canManageBookings: true
      }
    }
  });

  const owner2Password = await bcrypt.hash('owner456', saltRounds);
  const owner2 = await prisma.propertyOwner.create({
    data: {
      email: 'propietario2@turisgal.com',
      passwordHash: owner2Password,
      contactName: 'Carmen González',
      companyName: 'Rías Altas Hospedaje',
      phone: '+34 986 789 012',
      taxId: 'B36789012',
      permissions: {
        canManageProperties: true,
        canViewReports: false,
        canManageBookings: true
      }
    }
  });

  console.log('✅ Propietarios creados:');
  console.log(`   🏢 Propietario 1: ${owner1.email} (contraseña: owner123)`);
  console.log(`   🏢 Propietario 2: ${owner2.email} (contraseña: owner456)`);

  // ===== CREAR PROPIEDADES =====
  console.log('\n🏠 Creando propiedades de ejemplo...');

  const property1 = await prisma.property.create({
    data: {
      ownerId: owner1.id,
      name: 'Hotel Ría de Arousa',
      description: 'Encantador hotel boutique ubicado en primera línea de mar con vistas espectaculares a la Ría de Arousa. Perfecto para una escapada romántica o vacaciones familiares.',
      propertyType: 'Hotel',
      address: {
        street: 'Paseo Marítimo, 15',
        city: 'Vilagarcía de Arousa',
        state: 'Pontevedra',
        country: 'España',
        zipCode: '36600',
        coordinates: {
          lat: 42.5959,
          lng: -8.7706
        }
      },
      totalRooms: 20,
      maxGuests: 4,
      amenities: [
        'WiFi gratis',
        'Aire acondicionado',
        'Calefacción',
        'TV por cable',
        'Minibar',
        'Caja fuerte',
        'Balcón con vistas al mar',
        'Restaurante',
        'Bar',
        'Piscina exterior',
        'Spa',
        'Gimnasio',
        'Aparcamiento'
      ],
      houseRules: 'Check-in: 15:00 - 22:00. Check-out: 12:00. No se permiten mascotas. No fumar en las habitaciones.',
      checkInTime: new Date('2024-01-01T15:00:00'),
      checkOutTime: new Date('2024-01-01T12:00:00'),
      qrCodeData: 'property_arousa_hotel_2024',
      images: [
        'https://example.com/hotel-arousa-exterior.jpg',
        'https://example.com/hotel-arousa-lobby.jpg',
        'https://example.com/hotel-arousa-room.jpg',
        'https://example.com/hotel-arousa-pool.jpg'
      ],
      isActive: true
    }
  });

  const property2 = await prisma.property.create({
    data: {
      ownerId: owner1.id,
      name: 'Casa Rural O Muíño',
      description: 'Acogedora casa rural restaurada del siglo XVIII, rodeada de naturaleza en pleno corazón de Galicia. Ideal para desconectar y disfrutar del turismo rural.',
      propertyType: 'Casa Rural',
      address: {
        street: 'Lugar de Muíños, 7',
        city: 'Palas de Rei',
        state: 'Lugo',
        country: 'España',
        zipCode: '27200',
        coordinates: {
          lat: 42.8718,
          lng: -7.8646
        }
      },
      totalRooms: 8,
      maxGuests: 6,
      amenities: [
        'WiFi gratis',
        'Calefacción',
        'Chimenea',
        'Cocina completa',
        'Lavadora',
        'Jardín',
        'Barbacoa',
        'Aparcamiento gratuito',
        'Zona de juegos infantil',
        'Rutas de senderismo',
        'Bicicletas disponibles'
      ],
      houseRules: 'Check-in: 16:00 - 20:00. Check-out: 11:00. Se admiten mascotas pequeñas (consultar). Respetar el descanso de otros huéspedes.',
      checkInTime: new Date('2024-01-01T16:00:00'),
      checkOutTime: new Date('2024-01-01T11:00:00'),
      qrCodeData: 'property_muino_rural_2024',
      images: [
        'https://example.com/casa-muino-exterior.jpg',
        'https://example.com/casa-muino-salon.jpg',
        'https://example.com/casa-muino-cocina.jpg',
        'https://example.com/casa-muino-jardin.jpg'
      ],
      isActive: true
    }
  });

  const property3 = await prisma.property.create({
    data: {
      ownerId: owner2.id,
      name: 'Apartamentos Playa de Samil',
      description: 'Modernos apartamentos a 100 metros de la playa de Samil en Vigo. Totalmente equipados con todas las comodidades para una estancia perfecta.',
      propertyType: 'Apartamento',
      address: {
        street: 'Avenida de Samil, 142',
        city: 'Vigo',
        state: 'Pontevedra',
        country: 'España',
        zipCode: '36213',
        coordinates: {
          lat: 42.1754,
          lng: -8.7575
        }
      },
      totalRooms: 12,
      maxGuests: 4,
      amenities: [
        'WiFi gratis',
        'Aire acondicionado',
        'Calefacción',
        'Cocina completamente equipada',
        'Lavadora',
        'Lavavajillas',
        'TV Smart',
        'Balcón',
        'Cerca de la playa',
        'Supermercado cercano',
        'Transporte público'
      ],
      houseRules: 'Check-in: 15:00 - 21:00. Check-out: 11:00. No se permiten fiestas. Máximo 4 personas por apartamento.',
      checkInTime: new Date('2024-01-01T15:00:00'),
      checkOutTime: new Date('2024-01-01T11:00:00'),
      qrCodeData: 'property_samil_apartments_2024',
      images: [
        'https://example.com/apt-samil-exterior.jpg',
        'https://example.com/apt-samil-salon.jpg',
        'https://example.com/apt-samil-cocina.jpg',
        'https://example.com/apt-samil-terraza.jpg'
      ],
      isActive: true
    }
  });

  const property4 = await prisma.property.create({
    data: {
      ownerId: owner2.id,
      name: 'Hostal Camino de Santiago',
      description: 'Acogedor hostal ubicado en el Camino de Santiago, perfecto para peregrinos y viajeros. Ambiente familiar y servicios pensados para el descanso del caminante.',
      propertyType: 'Hostal',
      address: {
        street: 'Rúa do Peregrino, 28',
        city: 'Santiago de Compostela',
        state: 'A Coruña',
        country: 'España',
        zipCode: '15704',
        coordinates: {
          lat: 42.8805,
          lng: -8.5456
        }
      },
      totalRooms: 15,
      maxGuests: 2,
      amenities: [
        'WiFi gratis',
        'Calefacción',
        'Cocina compartida',
        'Lavandería',
        'Consigna de equipajes',
        'Credencial del Camino',
        'Información turística',
        'Desayuno disponible',
        'Zona común',
        'Cerca de la Catedral'
      ],
      houseRules: 'Check-in: 14:00 - 22:00. Check-out: 08:00 - 11:00. Respeto absoluto al descanso. Silencio a partir de las 22:00.',
      checkInTime: new Date('2024-01-01T14:00:00'),
      checkOutTime: new Date('2024-01-01T11:00:00'),
      qrCodeData: 'property_camino_hostal_2024',
      images: [
        'https://example.com/hostal-camino-exterior.jpg',
        'https://example.com/hostal-camino-habitacion.jpg',
        'https://example.com/hostal-camino-cocina.jpg',
        'https://example.com/hostal-camino-salon.jpg'
      ],
      isActive: true
    }
  });

  console.log('✅ Propiedades creadas:');
  console.log(`   🏨 ${property1.name} - ${property1.propertyType}`);
  console.log(`   🏠 ${property2.name} - ${property2.propertyType}`);
  console.log(`   🏢 ${property3.name} - ${property3.propertyType}`);
  console.log(`   🛏️ ${property4.name} - ${property4.propertyType}`);

  // ===== CREAR HABITACIONES =====
  console.log('\n🛏️ Creando habitaciones de ejemplo...');

  // Habitaciones para Hotel Ría de Arousa
  const hotelRooms = [];
  for (let i = 1; i <= 20; i++) {
    const roomType = i <= 15 ? 'Estándar' : 'Suite';
    const maxGuests = roomType === 'Suite' ? 4 : 2;
    const pricePerNight = roomType === 'Suite' ? 120.00 : 85.00;
    
    const room = await prisma.room.create({
      data: {
        propertyId: property1.id,
        roomNumber: `${Math.floor((i-1)/10) + 1}${String(i).padStart(2, '0')}`,
        roomType,
        maxGuests,
        pricePerNight,
        qrCodeData: `room_arousa_${i}_2024`,
        isAvailable: true
      }
    });
    hotelRooms.push(room);
  }

  // Habitaciones para Casa Rural O Muíño
  const ruralRooms = [];
  const ruralRoomTypes = ['Doble', 'Familiar', 'Individual'];
  for (let i = 1; i <= 8; i++) {
    const roomType = ruralRoomTypes[i % 3];
    const maxGuests = roomType === 'Familiar' ? 4 : roomType === 'Doble' ? 2 : 1;
    const pricePerNight = roomType === 'Familiar' ? 95.00 : roomType === 'Doble' ? 65.00 : 45.00;
    
    const room = await prisma.room.create({
      data: {
        propertyId: property2.id,
        roomNumber: `R${i}`,
        roomType,
        maxGuests,
        pricePerNight,
        qrCodeData: `room_muino_${i}_2024`,
        isAvailable: true
      }
    });
    ruralRooms.push(room);
  }

  console.log(`✅ Creadas ${hotelRooms.length} habitaciones para ${property1.name}`);
  console.log(`✅ Creadas ${ruralRooms.length} habitaciones para ${property2.name}`);

  console.log('\n🎉 Seed completado exitosamente!');
  console.log('\n📝 Credenciales disponibles:');
  console.log('   🔐 ADMIN: admin@turisgal.com / admin123');
  console.log('   🔐 MANAGER: manager@turisgal.com / manager123');
  console.log('   🔐 PROPIETARIO 1: propietario1@turisgal.com / owner123');
  console.log('   🔐 PROPIETARIO 2: propietario2@turisgal.com / owner456');
  console.log('   🔐 USUARIO: user@turisgal.com / user123');
  
  console.log('\n🏠 Propiedades disponibles:');
  console.log(`   📍 ${property1.name} (${property1.totalRooms} habitaciones)`);
  console.log(`   📍 ${property2.name} (${property2.totalRooms} habitaciones)`);
  console.log(`   📍 ${property3.name}`);
  console.log(`   📍 ${property4.name}`);

  console.log('\n🚀 API Endpoints disponibles:');
  console.log('   📋 GET /api/properties - Listar propiedades');
  console.log('   🔍 GET /api/properties/:id - Ver propiedad específica');
  console.log('   ➕ POST /api/properties - Crear propiedad (requiere auth)');
  console.log('   📊 GET /api/properties/stats/overview - Estadísticas (admin)');
  console.log('   📥 GET /api/properties/export/csv - Exportar (admin)');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });