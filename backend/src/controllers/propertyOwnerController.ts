import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { AuthRequest } from '../middleware/verifyToken';

const prisma = new PrismaClient();

// Crear nuevo propietario
export const createPropertyOwner = async (req: Request, res: Response) => {
  const {
    email,
    password,
    contactName,
    companyName,
    phone,
    taxId,
    permissions
  } = req.body;

  try {
    // Validar campos requeridos
    if (!email || !password || !contactName) {
      return res.status(400).json({ 
        message: 'Email, contraseña y nombre de contacto son requeridos' 
      });
    }

    // Verificar si el email ya existe
    const existingOwner = await prisma.propertyOwner.findUnique({
      where: { email }
    });

    if (existingOwner) {
      return res.status(400).json({ message: 'El email ya está en uso' });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const newOwner = await prisma.propertyOwner.create({
      data: {
        email,
        passwordHash: hashedPassword,
        contactName,
        companyName,
        phone,
        taxId,
        permissions: permissions ? (typeof permissions === 'string' ? JSON.parse(permissions) : permissions) : null
      }
    });

    // Obtener el conteo de propiedades por separado
    const propertiesCount = await prisma.property.count({
      where: { ownerId: newOwner.id }
    });

    // Excluir el hash de la contraseña de la respuesta
    const { passwordHash, ...ownerResponse } = newOwner;

    res.status(201).json({
      message: 'Propietario creado exitosamente',
      owner: {
        ...ownerResponse,
        _count: {
          properties: propertiesCount
        }
      }
    });

  } catch (error: any) {
    console.error('Error al crear propietario:', error);
    res.status(500).json({ 
      message: 'Error interno al crear el propietario', 
      error: error.message 
    });
  }
};

// Obtener todos los propietarios
export const getAllPropertyOwners = async (req: Request, res: Response) => {
  const {
    page = '1',
    limit = '10',
    search = '',
    from,
    to
  } = req.query;

  const pageNumber = parseInt(page as string, 10) || 1;
  const limitNumber = parseInt(limit as string, 10) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  const searchTerm = (search as string).trim();

  let where: any = {};

  if (searchTerm) {
    where.OR = [
      { contactName: { contains: searchTerm, mode: 'insensitive' } },
      { email: { contains: searchTerm, mode: 'insensitive' } },
      { companyName: { contains: searchTerm, mode: 'insensitive' } }
    ];
  }

  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from as string);
    if (to) where.createdAt.lte = new Date(to as string);
  }

  try {
    const owners = await prisma.propertyOwner.findMany({
      where,
      skip,
      take: limitNumber,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        email: true,
        contactName: true,
        companyName: true,
        phone: true,
        taxId: true,
        role: true,
        createdAt: true
      }
    });

    // Obtener propiedades y conteos por separado para cada propietario
    const ownersWithDetails = await Promise.all(
      owners.map(async (owner) => {
        const properties = await prisma.property.findMany({
          where: { ownerId: owner.id },
          select: {
            id: true,
            name: true,
            propertyType: true,
            isActive: true
          }
        });

        const propertiesCount = properties.length;
        const verifiedCheckInsCount = await prisma.checkIn.count({
          where: { verifiedById: owner.id }
        });
        const processedCheckOutsCount = await prisma.checkOut.count({
          where: { processedById: owner.id }
        });

        return {
          ...owner,
          properties,
          _count: {
            properties: propertiesCount,
            verifiedCheckIns: verifiedCheckInsCount,
            processedCheckOuts: processedCheckOutsCount
          }
        };
      })
    );

    const totalOwners = await prisma.propertyOwner.count({ where });

    res.json({
      page: pageNumber,
      limit: limitNumber,
      total: totalOwners,
      owners: ownersWithDetails
    });

  } catch (error: any) {
    console.error('Error al obtener propietarios:', error);
    res.status(500).json({ 
      message: 'Error al obtener propietarios', 
      error: error.message 
    });
  }
};

// Obtener un propietario específico
export const getPropertyOwnerById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const owner = await prisma.propertyOwner.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        contactName: true,
        companyName: true,
        phone: true,
        taxId: true,
        role: true,
        permissions: true,
        createdAt: true
      }
    });

    if (!owner) {
      return res.status(404).json({ message: 'Propietario no encontrado' });
    }

    // Obtener propiedades con sus conteos
    const properties = await prisma.property.findMany({
      where: { ownerId: id },
      select: {
        id: true,
        name: true,
        propertyType: true,
        isActive: true,
        createdAt: true
      }
    });

    // Obtener conteos por separado
    const propertiesWithCounts = await Promise.all(
      properties.map(async (property) => {
        const roomsCount = await prisma.room.count({
          where: { propertyId: property.id }
        });
        const bookingsCount = await prisma.booking.count({
          where: { propertyId: property.id }
        });
        const reviewsCount = await prisma.review.count({
          where: { propertyId: property.id }
        });

        return {
          ...property,
          _count: {
            rooms: roomsCount,
            bookings: bookingsCount,
            reviews: reviewsCount
          }
        };
      })
    );

    const totalProperties = properties.length;
    const verifiedCheckInsCount = await prisma.checkIn.count({
      where: { verifiedById: id }
    });
    const processedCheckOutsCount = await prisma.checkOut.count({
      where: { processedById: id }
    });

    const result = {
      ...owner,
      properties: propertiesWithCounts,
      _count: {
        properties: totalProperties,
        verifiedCheckIns: verifiedCheckInsCount,
        processedCheckOuts: processedCheckOutsCount
      }
    };

    res.json(result);

  } catch (error: any) {
    console.error('Error al obtener propietario:', error);
    res.status(500).json({ 
      message: 'Error al obtener el propietario', 
      error: error.message 
    });
  }
};

// Actualizar propietario
export const updatePropertyOwner = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const {
    contactName,
    companyName,
    phone,
    taxId,
    permissions
  } = req.body;

  try {
    // Verificar que el propietario existe
    const existingOwner = await prisma.propertyOwner.findUnique({
      where: { id }
    });

    if (!existingOwner) {
      return res.status(404).json({ message: 'Propietario no encontrado' });
    }

    // Verificar permisos (solo admin puede editar)
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'No tienes permisos para editar propietarios' });
    }

    const updatedOwner = await prisma.propertyOwner.update({
      where: { id },
      data: {
        ...(contactName && { contactName }),
        ...(companyName !== undefined && { companyName }),
        ...(phone !== undefined && { phone }),
        ...(taxId !== undefined && { taxId }),
        ...(permissions !== undefined && { 
          permissions: permissions ? (typeof permissions === 'string' ? JSON.parse(permissions) : permissions) : null 
        })
      },
      select: {
        id: true,
        email: true,
        contactName: true,
        companyName: true,
        phone: true,
        taxId: true,
        role: true,
        permissions: true,
        createdAt: true
      }
    });

    // Obtener conteo de propiedades
    const propertiesCount = await prisma.property.count({
      where: { ownerId: id }
    });

    res.json({
      message: 'Propietario actualizado exitosamente',
      owner: {
        ...updatedOwner,
        _count: {
          properties: propertiesCount
        }
      }
    });

  } catch (error: any) {
    console.error('Error al actualizar propietario:', error);
    res.status(500).json({ 
      message: 'Error al actualizar el propietario', 
      error: error.message 
    });
  }
};

// Eliminar propietario
export const deletePropertyOwner = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    // Verificar que el propietario existe
    const existingOwner = await prisma.propertyOwner.findUnique({
      where: { id }
    });

    if (!existingOwner) {
      return res.status(404).json({ message: 'Propietario no encontrado' });
    }

    // Verificar permisos (solo admin)
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'No tienes permisos para eliminar propietarios' });
    }

    // Verificar si tiene propiedades asociadas
    const propertiesCount = await prisma.property.count({
      where: { ownerId: id }
    });

    if (propertiesCount > 0) {
      return res.status(400).json({ 
        message: 'No se puede eliminar un propietario con propiedades asociadas' 
      });
    }

    await prisma.propertyOwner.delete({
      where: { id }
    });

    res.json({ message: 'Propietario eliminado exitosamente' });

  } catch (error: any) {
    console.error('Error al eliminar propietario:', error);
    res.status(500).json({ 
      message: 'Error al eliminar el propietario', 
      error: error.message 
    });
  }
};