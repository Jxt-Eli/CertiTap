// INFO: ─── Change in prod/dev ────────────────────────────────────
//
const DEV_URL = 'http://10.29.129.30:8080/api/elements';  // NOTE: Take note of laptop IP changes
const PROD_URL = 'https://certitap.onrender.com';

// HACK: Switch to false when building for presentation
const IS_DEV = false;

const BASE_URL = IS_DEV ? DEV_URL : PROD_URL;

// ─── Types ────────────────────────────────────────────────────────────────────

export type ScanResult =
  | { status: 'verified'; message: string }
  | { status: 'not_found'; message: string }
  | { status: 'mismatch'; message: string }
  | { status: 'error'; message: string };

export type RegisterPayload = {
  incomingNfc: string;
  fullName: string;
  indexNumber: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function post(path: string, body: object): Promise<{ ok: boolean; text: string }> {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const text = await response.text();
    return { ok: response.ok, text };
  } catch {
    return { ok: false, text: 'Could not reach the server. Check your connection.' };
  }
}

async function postQuery(
  path: string,
  params: Record<string, string | number>
): Promise<{ ok: boolean; text: string }> {
  try {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)]))
    ).toString();
    const response = await fetch(`${BASE_URL}${path}?${query}`, { method: 'POST' });
    const text = await response.text();
    return { ok: response.ok, text };
  } catch {
    return { ok: false, text: 'Could not reach the server.' };
  }
}

// ─── Endpoint 1: Pull from school registry ────────────────────────────────────

export async function fetchExternalStudents(
  startIndex: string,
  limitAmount: number
): Promise<{ success: boolean; message: string }> {
  const result = await postQuery('/fetch-external', { startIndex, limitAmount });
  return { success: result.ok, message: result.text };
}

// ─── Endpoint 2a: Scan card — send only UID, backend does lookup ──────────────

export async function scanCard(uid: string): Promise<ScanResult> {
  const result = await post('/verify-nfc', { incomingNfc: uid });
  const msg = result.text;
  if (!result.ok) return { status: 'error', message: msg };
  if (msg.toLowerCase().includes('verified') || msg.toLowerCase().includes('marked')) {
    return { status: 'verified', message: msg };
  }
  if (msg.toLowerCase().includes('not found') || msg.toLowerCase().includes('no record')) {
    return { status: 'not_found', message: msg };
  }
  if (msg.toLowerCase().includes('mismatch') || msg.toLowerCase().includes('failed')) {
    return { status: 'mismatch', message: msg };
  }
  if (msg === 'NOT_FOUND') {
    return { status: 'not_found', message: 'Card not registered. Add this student?' };
  }
  return { status: 'error', message: msg };
}

// ─── Endpoint 2b: Register a new student with their card ─────────────────────

export async function registerStudent(
  payload: RegisterPayload
): Promise<{ success: boolean; message: string }> {
  const result = await post('/verify-nfc', payload);
  return { success: result.ok, message: result.text };
}

// ─── Endpoint 3: Fetch unchecked student names ────────────────────────────────

// export async function fetchMissingStudents(): Promise<string[]> {
//   try {
//     const response = await fetch(`${BASE_URL}/unchecked`);
//     if (!response.ok) return [];
//     return await response.json();
//   } catch {
//     return [];
//   }
// }
export async function fetchMissingStudents(): Promise<string[]> {
  try {
    const response = await fetch(`${BASE_URL}/unchecked`);
    const text = await response.text();
    console.log('unchecked response:', response.status, text);
    if (!response.ok) return [];
    return JSON.parse(text);
  } catch (e) {
    console.log('unchecked fetch error:', e);
    return [];
  }
}

// ─── Endpoint 4: Manual index check-in ───────────────────────────────────────

export async function manualCheckIn(
  indexNumber: string
): Promise<{ success: boolean; message: string }> {
  const result = await post(`/${indexNumber}/check-backup`, {});
  return { success: result.ok, message: result.text };
}

// ─── Endpoint 5: Reset pulled registry (DELETE /reset — wire in controller) ───

export async function resetRegistry(): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${BASE_URL}/reset`, { method: 'DELETE' });
    const text = await response.text();
    return { success: response.ok, message: text };
  } catch {
    return { success: false, message: 'Could not reach the server.' };
  }
}
