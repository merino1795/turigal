import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Limpiar datos existentes (opcional)
  console.log('🧹 Limpiando datos existentes...');
  await prisma.user.deleteMany();

  // Crear usuarios de ejemplo
  console.log('👥 Creando usuarios de ejemplo...');

  const saltRounds = 10;

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

  console.log('\n🎉 Seed completado exitosamente!');
  console.log('\n📝 Puedes usar estas credenciales para probar el login:');
  console.log('   Email: admin@turisgal.com');
  console.log('   Contraseña: admin123');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });