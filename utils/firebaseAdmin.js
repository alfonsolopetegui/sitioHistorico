import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

// Cargar el archivo JSON desde el sistema de archivos
const serviceAccount = JSON.parse(
  fs.readFileSync(path.resolve('config', 'firebase-service-account.json'))
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://sitiohistorico-2519c.firebaseio.com",
  });
}

const db = admin.firestore();
export { db };