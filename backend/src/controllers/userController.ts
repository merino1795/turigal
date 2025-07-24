import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const createUser = async (req: Request, res: Response) => {
  const { email, firstName, lastName, password } = req.body;

  try {
    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        passwordHash: hashedPassword,
        role: 'USER',
        isVerified: false,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isVerified: true,
        createdAt: true,
      }
    });

    res.status(201).json(newUser);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear usuario', error: error.message });
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  const userId = req.user.userId;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isVerified: true,
        createdAt: true,
      },
    });

    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el usuario', error });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  const { 
    page = '1', 
    limit = '10', 
    search = '', 
    verified, 
    from, 
    to 
} = req.query;

  const pageNumber = parseInt(page as string, 10) || 1;
  const limitNumber = parseInt(limit as string, 10) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  const searchTerm = (search as string).trim();
  const verifiedParam = req.query.verified;
let isVerified: boolean | undefined = undefined;

if (verifiedParam === 'true') isVerified = true;
if (verifiedParam === 'false') isVerified = false;

  let where: any = {};

  if (searchTerm) {
    where.OR = [
        { firstName: { contains: searchTerm, mode: 'insensitive' } },
        { lastName: { contains: searchTerm, mode: 'insensitive' } },
        { email: { contains: searchTerm, mode: 'insensitive' } }
      ];
  }

  if (isVerified !== undefined){
    where.isVerified = isVerified;
  }

  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from as string);
    if (to) where.createdAt.lte = new Date (to as string);
  }

  try {
    const users = await prisma.user.findMany({
      where,
      skip,
      take: limitNumber,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isVerified: true,
        createdAt: true
      }
    });

    const totalUsers = await prisma.user.count({ where });

    res.json({
      page: pageNumber,
      limit: limitNumber,
      total: totalUsers,
      users
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
  }
};

// ✅ NUEVA FUNCIÓN: Obtener usuario por ID
export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el usuario', error: error.message });
  }
};

// ✅ NUEVA FUNCIÓN: Actualizar usuario por ID
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { firstName, lastName, email, role, isVerified } = req.body;

  try {
    // Verificar si el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Si se está cambiando el email, verificar que no esté en uso
    if (email && email !== existingUser.email) {
      const emailInUse = await prisma.user.findUnique({
        where: { email }
      });

      if (emailInUse) {
        return res.status(400).json({ message: 'El email ya está en uso por otro usuario' });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(email && { email }),
        ...(role && { role }),
        ...(isVerified !== undefined && { isVerified }),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json(updatedUser);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el usuario', error: error.message });
  }
};

// ✅ NUEVA FUNCIÓN: Eliminar usuario por ID
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Verificar si el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Prevenir que el usuario se elimine a sí mismo
    const currentUserId = (req as any).user?.userId;
    if (currentUserId === id) {
      return res.status(400).json({ message: 'No puedes eliminar tu propia cuenta desde aquí' });
    }

    // Verificar si el usuario tiene reservas o check-ins activos
    const hasBookings = await prisma.booking.findFirst({
      where: { userId: id }
    });

    if (hasBookings) {
      return res.status(400).json({ 
        message: 'No se puede eliminar el usuario porque tiene reservas asociadas. Considera desactivarlo en su lugar.' 
      });
    }

    await prisma.user.delete({
      where: { id }
    });

    res.json({ 
      message: 'Usuario eliminado correctamente',
      deletedUser: {
        id: existingUser.id,
        email: existingUser.email,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName
      }
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el usuario', error: error.message });
  }
};

// ✅ NUEVA FUNCIÓN: Cambiar contraseña de usuario
export const changeUserPassword = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  try {
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
    }

    // Verificar si el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id },
      data: {
        passwordHash: hashedPassword,
      },
    });

    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Error al cambiar la contraseña', error: error.message });
  }
};

export const updateCurrentUser = async (req: AuthRequest, res: Response) => {
  const userId = req.user.userId;
  const { firstName, lastName, email } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        email,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        updatedAt: true,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el usuario', error });
  }
};

export const deleteCurrentUser = async (req: AuthRequest, res: Response) => {
  const userId = req.user.userId;

  try {
    await prisma.user.delete({
      where: { id: userId },
    });

    res.json({ message: 'Cuenta eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el usuario', error });
  }
};

import { Parser } from 'json2csv';
import { AuthRequest } from '../middleware/verifyToken';

export const exportUsers = async (req: Request, res: Response) => {
  const { search = '', verified, from, to } = req.query;

  const searchTerm = (search as string).trim();
  const verifiedParam = req.query.verified;
  let isVerified: boolean | undefined = undefined;

  if (verifiedParam === 'true') isVerified = true;
  if (verifiedParam === 'false') isVerified = false;

  let where: any = {};

  if (searchTerm) {
    where.OR = [
      { firstName: { contains: searchTerm, mode: 'insensitive' } },
      { lastName: { contains: searchTerm, mode: 'insensitive' } },
      { email: { contains: searchTerm, mode: 'insensitive' } }
    ];
  }

  if (isVerified !== undefined) {
    where.isVerified = isVerified;
  }

  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from as string);
    if (to) where.createdAt.lte = new Date(to as string);
  }

  try {
    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isVerified: true,
        createdAt: true
      }
    });

    const parser = new Parser({ delimiter: ';' });
    const csv = parser.parse(users);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=usuarios.csv');
    res.send('\uFEFF' + csv);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Error al exportar usuarios', error: error.message });
  }
};
