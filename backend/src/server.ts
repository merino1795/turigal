import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import protectedRoutes from './routes/protectedRoutes';
import propertyRoutes from './routes/propertyRoutes';
import propertyOwnerRoutes from './routes/propertyOwnerRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/property-owners', propertyOwnerRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});