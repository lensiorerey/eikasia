// Garmin Connect Backend Proxy Microservice (Node.js / Express)
// Executes Server-to-Server Authentication to bypass Browser CORS restrictions

import express from 'express';
import cors from 'cors';
import { garminConnectClient } from './garminClient.js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

/**
 * Direct Login & Sync Endpoint
 * POST /api/garmin/login
 * Body: { email, password }
 */
app.post('/api/garmin/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Se requiere correo electrónico y contraseña de Garmin Connect.',
    });
  }

  try {
    console.log(`[Garmin Backend Proxy] Iniciando sesión Server-to-Server para: ${email}`);

    // Execute Garmin Connect authentication on backend server
    const garminSession = await garminConnectClient.login(email, password);

    // Fetch user swim activities directly from Garmin Connect API
    const swimActivities = await garminConnectClient.getSwimActivities(garminSession);

    console.log(`[Garmin Backend Proxy] ¡Éxito! Se obtuvieron ${swimActivities.length} entrenamientos reales de natación.`);

    return res.json({
      success: true,
      message: 'Conexión directa exitosa con Garmin Connect.',
      userEmail: email,
      sessionCount: swimActivities.length,
      activities: swimActivities,
    });
  } catch (err) {
    console.error('[Garmin Backend Proxy Error]:', err.message);
    return res.status(401).json({
      success: false,
      error: 'No se pudo iniciar sesión en Garmin Connect. Verifica tus credenciales.',
      details: err.message,
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Garmin Connect Backend Proxy' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Microservicio Garmin Backend Proxy corriendo en puerto ${PORT}`);
  });
}

export default app;
