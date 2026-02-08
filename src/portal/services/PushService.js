import { API_BASE_URL } from '../../utils/config';

const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const getUserId = () => {
  try {
    const s = localStorage.getItem('user');
    if (!s || s === 'undefined') return null;
    const u = JSON.parse(s);
    const a = u.data || u.user || u;
    return a.id || a.userId || a._id || a.uid || null;
  } catch {
    return null;
  }
};

export const PushService = {
  isSupported() {
    return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  },
  async getPublicKey() {
    const envKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
    if (envKey && envKey.trim().length > 0) return envKey.trim();
    try {
      const res = await fetch(`${API_BASE_URL}/api/notifications/vapid-public`);
      if (!res.ok) throw new Error('failed');
      const data = await res.json();
      const key = data.publicKey || data.vapidPublicKey || data.key;
      if (key && key.trim().length > 0) return key.trim();
    } catch (_) {}
    return null;
  },
  async isEnabled() {
    if (!this.isSupported()) return false;
    if (Notification.permission !== 'granted') return false;
    try {
      const reg = await navigator.serviceWorker.ready;
      const existing = await reg.pushManager.getSubscription();
      return !!existing;
    } catch {
      return localStorage.getItem('pushEnabled') === 'true';
    }
  },
  async enableNotifications() {
    if (!this.isSupported()) {
      return { ok: false, error: 'Not supported' };
    }
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return { ok: false, error: 'Permission denied' };
    }
    const reg = await navigator.serviceWorker.ready;
    const vapidPublicKey = await this.getPublicKey();
    if (!vapidPublicKey) {
      return { ok: false, error: 'Missing VAPID public key' };
    }
    const subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });
    const userId = getUserId();
    try {
      await fetch(`${API_BASE_URL}/api/notifications/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription, userId }),
      });
      localStorage.setItem('pushEnabled', 'true');
    } catch (e) {
      return { ok: false, error: 'Failed to store subscription' };
    }
    return { ok: true };
  },
  async testSend(title = 'BCVWorld', body = 'Subscribed successfully', url = '/') {
    try {
      const userId = getUserId();
      await fetch(`${API_BASE_URL}/api/notifications/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, title, body, url }),
      });
      return { ok: true };
    } catch {
      return { ok: false };
    }
  }
};

export default PushService;
