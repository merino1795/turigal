import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const createUser = async (req: Request, res: Response) => {
  const { email, firstName, lastName, password } = req.body;

  try {
    const newUser = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        passwordHash: password,
        isVerified: false,
      },
    });

    res.status(201).json(newUser);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear usuario', error: error.message });
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
