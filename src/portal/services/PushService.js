import { API_BASE_URL } from '../../utils/config';

const permissionGuidance = () => {
  const ua = navigator.userAgent || '';
  const vendor = navigator.vendor || '';
  const isEdge = /Edg\/\d+/.test(ua);
  const isFirefox = /Firefox\/\d+/.test(ua);
  const isChrome = /Chrome\/\d+/.test(ua) && /Google Inc/.test(vendor);
  const isSafari = /Safari\/\d+/.test(ua) && !isChrome && !isEdge;
  if (isSafari) return 'Permission denied — enable in Settings > Websites > Notifications';
  if (isFirefox) return 'Permission denied — allow via Site Information panel';
  if (isEdge) return 'Permission denied — click the lock icon and allow notifications';
  if (isChrome) return 'Permission denied — click the lock icon and allow notifications';
  return 'Permission denied';
};

const isLocalhost = () => {
  const h = location.hostname;
  return h === 'localhost' || h === '127.0.0.1';
};

const apiBase = () => (isLocalhost() ? '' : API_BASE_URL);

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
    const hasSW = 'serviceWorker' in navigator;
    const hasPush = 'PushManager' in window;
    const hasNotif = 'Notification' in window;
    return hasSW && hasPush && hasNotif;
  },
  supportReason() {
    const reasons = [];
    if (!('serviceWorker' in navigator)) reasons.push('Service Worker missing');
    if (!('Notification' in window)) reasons.push('Notification API missing');
    if (!('PushManager' in window)) {
      const ua = navigator.userAgent || '';
      const isIOS = /iPad|iPhone|iPod/.test(ua);
      const isStandalone = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches || !!navigator.standalone;
      if (isIOS && !isStandalone) {
        reasons.push('On iPhone/iPad, Web Push works only from “Add to Home Screen” apps (iOS 16.4+)');
      } else {
        reasons.push('PushManager missing');
      }
    }
    if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
      reasons.push('HTTPS required');
    }
    return reasons.join('; ');
  },
  async getPublicKey() {
    const envKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
    if (envKey && envKey.trim().length > 0) return envKey.trim();
    try {
      const res = await fetch(`${apiBase()}/api/notifications/vapid-public`, {
        headers: { Accept: 'application/json' },
        credentials: 'include'
      });
      if (!res.ok) throw new Error('failed');
      const data = await res.json();
      const key = data.publicKey || data.vapidPublicKey || data.key;
      if (key && key.trim().length > 0) return key.trim();
    } catch {
      return null;
    }
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
      return { ok: false, error: this.supportReason() || 'Not supported' };
    }
    if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
      return { ok: false, error: 'Requires HTTPS (or localhost) for push notifications' };
    }
    const ua = navigator.userAgent || '';
    const isIOS = /iPad|iPhone|iPod/.test(ua);
    const isStandalone = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches || !!navigator.standalone;
    if (isIOS && !isStandalone) {
      return { ok: false, error: 'On iPhone/iPad, enable after “Add to Home Screen” (iOS 16.4+)' };
    }
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return { ok: false, error: permissionGuidance() };
    }
    const [reg, vapidPublicKey] = await Promise.all([
      navigator.serviceWorker.ready,
      this.getPublicKey()
    ]);
    if (!vapidPublicKey) {
      return { ok: false, error: 'Missing VAPID public key' };
    }
    const subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });
    const userId = getUserId();
    try {
      const r1 = await fetch(`${apiBase()}/api/notifications/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ subscription, userId }),
      });
      if (!r1.ok) {
        let reason = `Failed to store subscription (${r1.status} ${r1.statusText || ''})`.trim();
        try {
          const ct = r1.headers.get('content-type') || '';
          if (ct.includes('application/json')) {
            const data = await r1.json();
            reason = data.message || data.error || reason;
          } else {
            const text = await r1.text();
            if (text) reason = text.slice(0, 200);
          }
        } catch { void 0; }
        return { ok: false, error: reason };
      }
      localStorage.setItem('pushEnabled', 'true');
    } catch { 
      return { ok: false, error: 'Failed to store subscription' };
    }
    return { ok: true };
  },
  async testSend(title = 'BCVWorld', body = 'Subscribed successfully', url = '/') {
    try {
      const userId = getUserId();
      const r = await fetch(`${apiBase()}/api/notifications/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId, title, body, url }),
      });
      if (!r.ok) return { ok: false };
      return { ok: true };
    } catch {
      return { ok: false };
    }
  }
};

export default PushService;
