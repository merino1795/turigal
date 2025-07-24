import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/verifyToken';
import { Parser } from 'json2csv';

const prisma = new PrismaClient();

// Crear nueva propiedad
export const createProperty = async (req: AuthRequest, res: Response) => {
  const {
    name,
    description,
    propertyType,
    address,
    totalRooms,
    maxGuests,
    amenities,
    houseRules,
    checkInTime,
    checkOutTime,
    images
  } = req.body;

  try {
    // Validar datos requeridos
    if (!name || !propertyType || !address || !maxGuests) {
      return res.status(400).json({ 
        message: 'Nombre, tipo de propiedad, dirección y número máximo de huéspedes son requeridos' 
      });
    }

    // Generar QR code único (por ahora un UUID simple)
    const qrCodeData = `property_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const newProperty = await prisma.property.create({
      data: {
        name,
        description,
        propertyType,
        address: typeof address === 'string' ? JSON.parse(address) : address,
        totalRooms: parseInt(totalRooms) || 1,
        maxGuests: parseInt(maxGuests),
        amenities: amenities ? (typeof amenities === 'string' ? JSON.parse(amenities) : amenities) : null,
        houseRules,
        checkInTime: checkInTime ? new Date(checkInTime) : null,
        checkOutTime: checkOutTime ? new Date(checkOutTime) : null,
        qrCodeData,
        images: images ? (typeof images === 'string' ? JSON.parse(images) : images) : null,
        ownerId: req.user.userId, // Asumiendo que el usuario actual es el propietario
      },
      include: {
        owner: {
          select: {
            id: true,
            contactName: true,
            email: true,
            companyName: true
          }
        },
        rooms: true,
        _count: {
          select: {
            bookings: true,
            reviews: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Propiedad creada exitosamente',
      property: newProperty
    });

  } catch (error: any) {
    console.error('Error al crear propiedad:', error);
    res.status(500).json({ 
      message: 'Error interno al crear la propiedad', 
      error: error.message 
    });
  }
};

// Obtener todas las propiedades con filtros y paginación
export const getAllProperties = async (req: Request, res: Response) => {
  const {
    page = '1',
    limit = '10',
    search = '',
    propertyType,
    isActive,
    ownerId,
    from,
    to
  } = req.query;

  const pageNumber = parseInt(page as string, 10) || 1;
  const limitNumber = parseInt(limit as string, 10) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  const searchTerm = (search as string).trim();

  let where: any = {};

  // Filtro de búsqueda
  if (searchTerm) {
    where.OR = [
      { name: { contains: searchTerm, mode: 'insensitive' } },
      { description: { contains: searchTerm, mode: 'insensitive' } },
      { propertyType: { contains: searchTerm, mode: 'insensitive' } }
    ];
  }

  // Filtro por tipo de propiedad
  if (propertyType) {
    where.propertyType = propertyType;
  }

  // Filtro por estado activo
  if (isActive !== undefined) {
    where.isActive = isActive === 'true';
  }

  // Filtro por propietario
  if (ownerId) {
    where.ownerId = ownerId;
  }

  // Filtro por fechas
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from as string);
    if (to) where.createdAt.lte = new Date(to as string);
  }

  try {
    const properties = await prisma.property.findMany({
      where,
      skip,
      take: limitNumber,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        owner: {
          select: {
            id: true,
            contactName: true,
            email: true,
            companyName: true
          }
        },
        rooms: {
          select: {
            id: true,
            roomNumber: true,
            roomType: true,
            maxGuests: true,
            pricePerNight: true,
            isAvailable: true
          }
        },
        _count: {
          select: {
            bookings: true,
            reviews: true,
            rooms: true
          }
        }
      }
    });

    const totalProperties = await prisma.property.count({ where });

    res.json({
      page: pageNumber,
      limit: limitNumber,
      total: totalProperties,
      properties
    });

  } catch (error: any) {
    console.error('Error al obtener propiedades:', error);
    res.status(500).json({ 
      message: 'Error al obtener propiedades', 
      error: error.message 
    });
  }
};

// Obtener una propiedad específica
export const getPropertyById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            contactName: true,
            email: true,
            companyName: true,
            phone: true
          }
        },
        rooms: {
          orderBy: {
            roomNumber: 'asc'
          }
        },
        bookings: {
          take: 5,
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        },
        reviews: {
          take: 5,
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        },
        _count: {
          select: {
            bookings: true,
            reviews: true,
            rooms: true
          }
        }
      }
    });

    if (!property) {
      return res.status(404).json({ message: 'Propiedad no encontrada' });
    }

    res.json(property);

  } catch (error: any) {
    console.error('Error al obtener propiedad:', error);
    res.status(500).json({ 
      message: 'Error al obtener la propiedad', 
      error: error.message 
    });
  }
};

// Actualizar propiedad
export const updateProperty = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const {
    name,
    description,
    propertyType,
    address,
    totalRooms,
    maxGuests,
    amenities,
    houseRules,
    checkInTime,
    checkOutTime,
    images,
    isActive
  } = req.body;

  try {
    // Verificar que la propiedad existe
    const existingProperty = await prisma.property.findUnique({
      where: { id }
    });

    if (!existingProperty) {
      return res.status(404).json({ message: 'Propiedad no encontrada' });
    }

    // Verificar permisos (solo el propietario o admin puede editar)
    if (req.user.role !== 'ADMIN' && existingProperty.ownerId !== req.user.userId) {
      return res.status(403).json({ message: 'No tienes permisos para editar esta propiedad' });
    }

    const updatedProperty = await prisma.property.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(propertyType && { propertyType }),
        ...(address && { address: typeof address === 'string' ? JSON.parse(address) : address }),
        ...(totalRooms && { totalRooms: parseInt(totalRooms) }),
        ...(maxGuests && { maxGuests: parseInt(maxGuests) }),
        ...(amenities !== undefined && { 
          amenities: amenities ? (typeof amenities === 'string' ? JSON.parse(amenities) : amenities) : null 
        }),
        ...(houseRules !== undefined && { houseRules }),
        ...(checkInTime !== undefined && { checkInTime: checkInTime ? new Date(checkInTime) : null }),
        ...(checkOutTime !== undefined && { checkOutTime: checkOutTime ? new Date(checkOutTime) : null }),
        ...(images !== undefined && { 
          images: images ? (typeof images === 'string' ? JSON.parse(images) : images) : null 
        }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) })
      },
      include: {
        owner: {
          select: {
            id: true,
            contactName: true,
            email: true,
            companyName: true
          }
        },
        rooms: true,
        _count: {
          select: {
            bookings: true,
            reviews: true
          }
        }
      }
    });

    res.json({
      message: 'Propiedad actualizada exitosamente',
      property: updatedProperty
    });

  } catch (error: any) {
    console.error('Error al actualizar propiedad:', error);
    res.status(500).json({ 
      message: 'Error al actualizar la propiedad', 
      error: error.message 
    });
  }
};

// Eliminar propiedad
export const deleteProperty = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    // Verificar que la propiedad existe
    const existingProperty = await prisma.property.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            bookings: true
          }
        }
      }
    });

    if (!existingProperty) {
      return res.status(404).json({ message: 'Propiedad no encontrada' });
    }

    // Verificar permisos
    if (req.user.role !== 'ADMIN' && existingProperty.ownerId !== req.user.userId) {
      return res.status(403).json({ message: 'No tienes permisos para eliminar esta propiedad' });
    }

    // Verificar si tiene reservas activas
    if (existingProperty._count.bookings > 0) {
      return res.status(400).json({ 
        message: 'No se puede eliminar una propiedad con reservas existentes. Desactívala en su lugar.' 
      });
    }

    await prisma.property.delete({
      where: { id }
    });

    res.json({ message: 'Propiedad eliminada exitosamente' });

  } catch (error: any) {
    console.error('Error al eliminar propiedad:', error);
    res.status(500).json({ 
      message: 'Error al eliminar la propiedad', 
      error: error.message 
    });
  }
};

// Exportar propiedades a CSV
export const exportProperties = async (req: Request, res: Response) => {
  const { search = '', propertyType, isActive, ownerId, from, to } = req.query;

  const searchTerm = (search as string).trim();

  let where: any = {};

  if (searchTerm) {
    where.OR = [
      { name: { contains: searchTerm, mode: 'insensitive' } },
      { description: { contains: searchTerm, mode: 'insensitive' } },
      { propertyType: { contains: searchTerm, mode: 'insensitive' } }
    ];
  }

  if (propertyType) {
    where.propertyType = propertyType;
  }

  if (isActive !== undefined) {
    where.isActive = isActive === 'true';
  }

  if (ownerId) {
    where.ownerId = ownerId;
  }

  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from as string);
    if (to) where.createdAt.lte = new Date(to as string);
  }

  try {
    const properties = await prisma.property.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        owner: {
          select: {
            contactName: true,
            email: true,
            companyName: true
          }
        },
        _count: {
          select: {
            bookings: true,
            reviews: true,
            rooms: true
          }
        }
      }
    });

    // Formatear datos para CSV
    const csvData = properties.map(property => ({
      id: property.id,
      nombre: property.name,
      descripcion: property.description || '',
      tipoPropiedad: property.propertyType,
      propietario: property.owner.contactName,
      emailPropietario: property.owner.email,
      empresa: property.owner.companyName || '',
      habitaciones: property._count.rooms,
      maxHuespedes: property.maxGuests,
      reservas: property._count.bookings,
      resenas: property._count.reviews,
      activa: property.isActive ? 'Sí' : 'No',
      fechaCreacion: property.createdAt.toLocaleDateString('es-ES')
    }));

    const parser = new Parser({ delimiter: ';' });
    const csv = parser.parse(csvData);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=propiedades.csv');
    res.send('\uFEFF' + csv);

  } catch (error: any) {
    console.error('Error al exportar propiedades:', error);
    res.status(500).json({ 
      message: 'Error al exportar propiedades', 
      error: error.message 
    });
  }
};

// Obtener estadísticas de propiedades
export const getPropertiesStats = async (req: Request, res: Response) => {
  try {
    // Total de propiedades
    const totalProperties = await prisma.property.count();
    
    // Propiedades activas
    const activeProperties = await prisma.property.count({
      where: { isActive: true }
    });
    
    // Propiedades por tipo
    const propertiesByTypeRaw = await prisma.property.groupBy({
      by: ['propertyType'],
      _count: {
        _all: true
      }
    });
    
    // Formatear los datos de propiedades por tipo
    const propertiesByType = propertiesByTypeRaw.map(item => ({
      type: item.propertyType,
      count: item._count._all
    }));
    
    // Propiedades con más reservas (todas las propiedades con su conteo)
    const propertiesWithBookings = await prisma.property.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            bookings: true
          }
        }
      }
    });

    // Ordenar por número de reservas y tomar las top 5
    const topProperties = propertiesWithBookings
      .map(property => ({
        id: property.id,
        name: property.name,
        bookingsCount: property._count.bookings
      }))
      .sort((a, b) => b.bookingsCount - a.bookingsCount)
      .slice(0, 5);

    res.json({
      totalProperties,
      activeProperties,
      propertiesByType,
      topProperties
    });

  } catch (error: any) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ 
      message: 'Error al obtener estadísticas', 
      error: error.message 
    });
  }
};