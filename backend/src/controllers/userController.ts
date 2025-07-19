import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const createUser = async (req: Request, res: Response) => {
  const { email, firstName, lastName, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password,10);

    const newUser = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        passwordHash: hashedPassword,
        role: 'USER',
        isVerified: false,
      },
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

