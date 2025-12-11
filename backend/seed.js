const mongoose = require('mongoose');
const User = require('./models/User');
const Unit = require('./models/Unit');
const Template = require('./models/Template');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/checklist-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const seedData = async () => {
  try {
    // Limpiar base de datos
    await User.deleteMany({});
    await Unit.deleteMany({});
    await Template.deleteMany({});

    console.log('🧹 Base de datos limpia');

    // 1. Crear Template Básico
    const createdTemplate = await Template.create({
      name: 'Limpieza Estándar',
      description: 'Checklist general para salidas de huéspedes',
      areas: [
        {
          name: 'Cocina',
          items: [
            { text: 'Refrigerador limpio y vacío', type: 'boolean' },
            { text: 'Trastes lavados y guardados', type: 'boolean' },
            { text: 'Bote de basura vacío', type: 'boolean' }
          ]
        },
        {
          name: 'Baño',
          items: [
            { text: 'Inodoro limpio', type: 'boolean' },
            { text: 'Espejo sin manchas', type: 'boolean' },
            { text: 'Toallas limpias puestas', type: 'boolean' }
          ]
        },
        {
          name: 'Habitación',
          items: [
            { text: 'Cama tendida sin arrugas', type: 'boolean' },
            { text: 'No hay objetos olvidados', type: 'boolean' }
          ]
        }
      ]
    });

    console.log('📝 Template creado');

    // 2. Crear Usuarios
    await User.create([
      { name: 'Operador1', pin: '1234', role: 'operator' },
      { name: 'Admin', pin: '0000', role: 'admin' }
    ]);

    console.log('👥 Usuarios creados');

    // 3. Crear Unidades
    await Unit.create([
      { code: '101', name: 'Apartamento Playa', floor: 1, category: 'short-term' },
      { code: 'PH1', name: 'Penthouse Vista', floor: 10, category: 'short-term' },
      { code: '205', name: 'Estudio Centro', floor: 2, category: 'long-term' }
    ]);

    console.log('🏢 Unidades creadas');
    console.log('✨ Seed completado con éxito');
    process.exit();

  } catch (error) {
    console.error('❌ Error en seed:', error);
    process.exit(1);
  }
};

seedData();