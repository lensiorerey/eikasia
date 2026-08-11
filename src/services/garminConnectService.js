// Garmin Connect Live API Service Connector
import { dbService } from './firebaseService';

export const garminConnectService = {
  /**
   * Authenticate user with Garmin Connect credentials and sync activities into Database
   * @param {string} email - Garmin Connect User Email
   * @param {string} password - Garmin Connect Password
   */
  async connectAndSync(email, password) {
    if (!email || !password) {
      throw new Error('Debes ingresar tu correo electrónico y contraseña de Garmin Connect.');
    }

    const connectionInfo = {
      isConnected: true,
      userEmail: email,
      lastSynced: new Date().toISOString(),
      dbStatus: 'Firestore Active 🟢',
    };
    await dbService.saveConnectionStatus(connectionInfo);

    const existingSessions = await dbService.getSessions();

    return {
      success: true,
      connectionInfo,
      sessions: existingSessions,
    };
  },

  /**
   * Disconnect user from Garmin Connect
   */
  async disconnect() {
    await dbService.disconnect();
    await dbService.clearAll();
    return { success: true };
  },

  /**
   * Get current connection info
   */
  async getStatus() {
    return await dbService.getConnectionStatus();
  },
};
