# 🖥️ Frontend SWAT Recruitment

Frontend dari aplikasi **SWAT Recruitment**, sistem rekrutmen karyawan yang dirancang untuk mempermudah proses seleksi dan penerimaan calon karyawan. Proyek ini dibangun menggunakan **Vue 3** dan **Bootstrap 5** agar responsif dan mudah digunakan.

## ✨ Fitur Utama

### 🔧 General
- 🔐 Autentikasi pengguna (Login & Register)

### 👤 Pelamar
- 📝 Upload KTP dan CV (formulir pengiriman lamaran)
- 📊 Lihat hasil seleksi

### 🧑‍💼 Admin
- 📊 Dashboard admin untuk melihat daftar pelamar
- 👥 Kelola pengguna (tambah/edit/hapus)
- 🧠 Kelola kunci jawaban soal psikotes
- 📷 Scan jawaban psikotes (berbasis gambar)
- 🧾 Lihat hasil seleksi semua pelamar
- 📈 Laporan seleksi (export / rekap data)

## 🛠️ Teknologi

- [Vue 3](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [Bootstrap 5](https://getbootstrap.com/)
- [Axios](https://axios-http.com/)
- [Vue Router](https://router.vuejs.org/)

## 🚀 Cara Menjalankan

1. Clone repository:

```bash
git clone https://github.com/ceceprokani/kharis-bengkel-fe.git
cd kharis-bengkel-fe
```

2. Install dependencies:

```bash
npm install
```

3. Jalankan proyek:

```bash
npm run dev
```

4. Pastikan file `.env` telah dikonfigurasi dengan benar dan mengarah ke backend yang aktif.

## 📁 Struktur Folder

```
src/
├── assets/        # File statis (gambar, ikon, dll)
├── components/    # Komponen UI
├── views/         # Halaman aplikasi
├── router/        # Konfigurasi routing
├── services/      # API service (axios)
└── App.vue        # Entry point utama
```

## 📌 Catatan

- Pastikan backend API sudah berjalan dan dapat diakses dari frontend.
- Gunakan Node.js versi terbaru untuk hasil terbaik.

---

## 👤 Author

Proyek ini dikembangkan oleh [Cecep Rokani](https://github.com/ceceprokani) untuk memenuhi Skripsi.