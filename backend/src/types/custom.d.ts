// src/types/custom.d.ts
import { Request } from 'express';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user: JWTPayload;
}

// También extender Express globalmente
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}