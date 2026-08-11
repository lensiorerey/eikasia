// Firebase & Storage Service for Garmin Swim Telemetry Database

const STORAGE_KEY = 'eikasia_garmin_sessions';
const CONNECTION_KEY = 'eikasia_garmin_connection';

export const dbService = {
  // Save swim session to Database
  async saveSession(session) {
    try {
      const existing = await this.getSessions();
      const updated = [session, ...existing.filter((s) => s.id !== session.id)];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { success: true, count: updated.length };
    } catch (err) {
      console.error('Error saving session to DB:', err);
      return { success: false, error: err.message };
    }
  },

  // Save multiple sessions to Database (Replaces or appends real user items)
  async saveSessionsBatch(sessions) {
    try {
      const existing = await this.getSessions();
      const realExisting = existing.filter(
        (s) => s.source || s.id.startsWith('garmin-real') || s.id.startsWith('garmin-manual')
      );
      const existingIds = new Set(realExisting.map((s) => s.id));
      const newItems = sessions.filter((s) => !existingIds.has(s.id));
      const updated = [...newItems, ...realExisting];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { success: true, count: updated.length, newAdded: newItems.length };
    } catch (err) {
      console.error('Error saving batch sessions to DB:', err);
      return { success: false, error: err.message };
    }
  },

  // Get all swim sessions from Database (Filters out legacy mock data)
  async getSessions() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      // Filter out legacy hardcoded mock sessions completely
      const realOnly = parsed.filter(
        (s) => s.source || s.id.startsWith('garmin-real') || s.id.startsWith('garmin-manual')
      );
      return realOnly;
    } catch (err) {
      console.error('Error fetching sessions from DB:', err);
      return [];
    }
  },

  // Clear all stored data
  async clearAll() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CONNECTION_KEY);
  },

  // Save Garmin user connection status
  async saveConnectionStatus(status) {
    localStorage.setItem(CONNECTION_KEY, JSON.stringify(status));
    return status;
  },

  // Get saved connection status
  async getConnectionStatus() {
    try {
      const data = localStorage.getItem(CONNECTION_KEY);
      return data
        ? JSON.parse(data)
        : { isConnected: false, userEmail: null, lastSynced: null };
    } catch (err) {
      return { isConnected: false, userEmail: null, lastSynced: null };
    }
  },

  // Clear connection
  async disconnect() {
    localStorage.removeItem(CONNECTION_KEY);
    localStorage.removeItem(STORAGE_KEY);
    return { isConnected: false, userEmail: null };
  },
};
