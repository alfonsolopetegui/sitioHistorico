import admin from 'firebase-admin';

if (!admin.apps.length) {
  // Obtener el JSON de las credenciales desde la variable de entorno
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

  // Inicializar Firebase Admin
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://sitiohistorico-2519c.firebaseio.com",
  });
}

const db = admin.firestore();
export { db };
