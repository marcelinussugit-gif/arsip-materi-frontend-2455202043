import { useEffect, useState } from 'react';
import { ambilMateri, tambahMateri } from './api/materi.js';

const INITIAL_FORM = {
  judul: '',
  mata_kuliah: '',
  pertemuan: '',
  tautan: '',
};

export default function App() {
  const [daftarMateri, setDaftarMateri] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  async function muatMateri() {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await ambilMateri();
      setDaftarMateri(Array.isArray(data) ? data : []);
    } catch (err) {
      setErrorMsg(err.message || 'Gagal memuat data materi');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    muatMateri();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setSubmitting(true);

    try {
      const payload = {
        judul: form.judul,
        mata_kuliah: form.mata_kuliah,
        pertemuan: Number(form.pertemuan),
        tautan: form.tautan.trim() === '' ? null : form.tautan.trim(),
      };

      const itemBaru = await tambahMateri(payload);
      setDaftarMateri((prev) => [...prev, itemBaru]);
      setForm(INITIAL_FORM);
      setSuccessMsg('Materi berhasil disimpan.');
    } catch (err) {
      setErrorMsg(err.message || 'Gagal menyimpan materi');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main style={{ maxWidth: 820, margin: '2rem auto', padding: '0 1rem', fontFamily: 'sans-serif' }}>
      <h1>Arsip Materi Kuliah</h1>

      <section style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: 8 }}>
        <h2>Tambah Materi</h2>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.75rem' }}>
          <div>
            <label>
              Judul Materi
              <input
                type="text"
                name="judul"
                value={form.judul}
                onChange={handleChange}
                placeholder="Contoh: Routing Express"
                required
                style={{ display: 'block', width: '100%', padding: '0.45rem', marginTop: 4 }}
              />
            </label>
          </div>

          <div>
            <label>
              Mata Kuliah
              <input
                type="text"
                name="mata_kuliah"
                value={form.mata_kuliah}
                onChange={handleChange}
                placeholder="Contoh: Pemrograman Web"
                required
                style={{ display: 'block', width: '100%', padding: '0.45rem', marginTop: 4 }}
              />
            </label>
          </div>

          <div>
            <label>
              Pertemuan (1–16)
              <input
                type="number"
                name="pertemuan"
                min="1"
                max="16"
                value={form.pertemuan}
                onChange={handleChange}
                placeholder="Contoh: 9"
                required
                style={{ display: 'block', width: '100%', padding: '0.45rem', marginTop: 4 }}
              />
            </label>
          </div>

          <div>
            <label>
              Tautan (Opsional)
              <input
                type="url"
                name="tautan"
                value={form.tautan}
                onChange={handleChange}
                placeholder="https://contoh.ac.id/materi.pdf"
                style={{ display: 'block', width: '100%', padding: '0.45rem', marginTop: 4 }}
              />
            </label>
          </div>

          <button type="submit" disabled={submitting} style={{ padding: '0.6rem 1rem', cursor: 'pointer' }}>
            {submitting ? 'Menyimpan...' : 'Simpan Materi'}
          </button>
        </form>

        {successMsg && <p style={{ color: '#15803d', marginTop: '0.75rem' }}>{successMsg}</p>}
      </section>

      <section>
        <h2>Daftar Materi</h2>

        {loading && <p>Memuat data...</p>}

        {!loading && errorMsg && (
          <div style={{ padding: '0.85rem', border: '1px solid #fca5a5', borderRadius: 8, background: '#fef2f2' }}>
            <p style={{ color: '#b91c1c', margin: '0 0 0.6rem 0' }}>{errorMsg}</p>
            <button type="button" onClick={muatMateri} style={{ padding: '0.45rem 0.85rem', cursor: 'pointer' }}>
              Coba lagi
            </button>
          </div>
        )}

        {!loading && !errorMsg && daftarMateri.length === 0 && (
          <p>Belum ada data materi.</p>
        )}

        {!loading && !errorMsg && daftarMateri.length > 0 && (
          <ul style={{ display: 'grid', gap: '0.75rem', paddingLeft: 0, listStyle: 'none' }}>
            {daftarMateri.map((item) => (
              <li
                key={item.id}
                style={{ padding: '0.85rem', border: '1px solid #ddd', borderRadius: 8 }}
              >
                <strong>{item.judul}</strong> — {item.mata_kuliah} (Pertemuan {item.pertemuan})
                <div>
                  {item.tautan ? (
                    <a href={item.tautan} target="_blank" rel="noreferrer">
                      Buka Tautan
                    </a>
                  ) : (
                    <span style={{ color: '#666' }}>Tidak ada tautan</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
