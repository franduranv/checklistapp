require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Unit = require('./models/Unit');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/checklist-app';

const users = [
  { name: 'Operador1', pin: '1234', role: 'operator' },
  { name: 'Operador2', pin: '5678', role: 'operator' },
  { name: 'Admin', pin: '9999', role: 'admin' }
];

const units = [
  // Renta a corto plazo
  { code: 'BaW ALM809P-D101', name: 'D101', category: 'short-term', floor: 1 },
  { code: 'BaW ALM809P-D102', name: 'D102', category: 'short-term', floor: 1 },
  { code: 'BaW ALM809P-D103', name: 'D103', category: 'short-term', floor: 1 },
  { code: 'BaW ALM809P-D104', name: 'D104', category: 'short-term', floor: 1 },
  { code: 'BaW ALM809P-D201', name: 'D201', category: 'short-term', floor: 2 },
  { code: 'BaW ALM809P-D202', name: 'D202', category: 'short-term', floor: 2 },
  { code: 'BaW ALM809P-D304', name: 'D304', category: 'short-term', floor: 3 },
  { code: 'BaW ALM809P-D403', name: 'D403', category: 'short-term', floor: 4 },
  // Renta fija
  { code: 'BaW ALM809P-D203', name: 'D203', category: 'long-term', floor: 2 },
  { code: 'BaW ALM809P-D204', name: 'D204', category: 'long-term', floor: 2 },
  { code: 'BaW ALM809P-D301', name: 'D301', category: 'long-term', floor: 3 },
  { code: 'BaW ALM809P-D302', name: 'D302', category: 'long-term', floor: 3 },
  { code: 'BaW ALM809P-D303', name: 'D303', category: 'long-term', floor: 3 },
  { code: 'BaW ALM809P-D401', name: 'D401', category: 'long-term', floor: 4 },
  { code: 'BaW ALM809P-D402', name: 'D402', category: 'long-term', floor: 4 },
  { code: 'BaW ALM809P-D404', name: 'D404', category: 'long-term', floor: 4 }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Conectado a MongoDB');

    await User.deleteMany({});
    await Unit.deleteMany({});

    await User.insertMany(users);
    await Unit.insertMany(units);

    console.log('Usuarios y unidades insertados correctamente.');
    process.exit(0);
  } catch (error) {
    console.error('Error al insertar datos:', error);
    process.exit(1);
  }
}

seed(); 