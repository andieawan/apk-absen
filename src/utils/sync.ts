// =============================
// Utilitas Sinkronisasi Offline/Online
// Fitur: sync data offline ke server, clear data offline setelah sukses.
// Cocok untuk aplikasi PWA/offline-first.
// Kode sederhana, mudah dikembangkan untuk pemula.
// =============================

import { db } from './db';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || '/api/sync';

export async function syncOfflineData() {
  const offlineData = db.getOfflineData();

  if (!offlineData || offlineData.length === 0) {
    return { success: true, message: 'No offline data to sync.' };
  }

  try {
    const response = await fetch(SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(offlineData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Sync failed: ${response.status} ${errorText}`);
    }

    db.clearOfflineData();
    return { success: true, message: 'Offline data synced successfully.' };
  } catch (error) {
    console.error('Failed to sync offline data:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
}
