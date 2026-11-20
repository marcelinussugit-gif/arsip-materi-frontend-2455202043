const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function ambilMateri() {
  const res = await fetch(`${BASE_URL}/api/materi`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Gagal memuat data materi dari server');
  }
  return data;
}

export async function tambahMateri(payload) {
  const res = await fetch(`${BASE_URL}/api/materi`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Gagal menyimpan data materi');
  }
  return data;
}
