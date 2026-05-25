import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'authToken';
const GUEST_KEY = 'guestMode';

const memory: Record<string, string | undefined> = {};

async function safeGet(key: string): Promise<string | null> {
  if (memory[key] !== undefined) return memory[key] ?? null;
  try {
    const v = await AsyncStorage.getItem(key);
    memory[key] = v ?? undefined;
    return v;
  } catch {
    return memory[key] ?? null;
  }
}

async function safeSet(key: string, value: string): Promise<void> {
  memory[key] = value;
  try {
    await AsyncStorage.setItem(key, value);
  } catch {
    // swallow — value lives in memory for this session
  }
}

async function safeRemove(key: string): Promise<void> {
  memory[key] = undefined;
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    // swallow
  }
}

export const tokenStorage = {
  get: () => safeGet(TOKEN_KEY),
  set: (token: string) => safeSet(TOKEN_KEY, token),
  clear: () => safeRemove(TOKEN_KEY),
};

const guestSubscribers = new Set<() => void>();
let guestCache: boolean | null = null;

function notifyGuest() {
  guestSubscribers.forEach((fn) => fn());
}

export const guestStorage = {
  async isGuest(): Promise<boolean> {
    if (guestCache !== null) return guestCache;
    const v = (await safeGet(GUEST_KEY)) === '1';
    guestCache = v;
    return v;
  },
  isGuestSync(): boolean {
    return guestCache === true;
  },
  async enable() {
    guestCache = true;
    await safeSet(GUEST_KEY, '1');
    notifyGuest();
  },
  async disable() {
    guestCache = false;
    await safeRemove(GUEST_KEY);
    notifyGuest();
  },
  subscribe(fn: () => void): () => void {
    guestSubscribers.add(fn);
    return () => guestSubscribers.delete(fn);
  },
};
