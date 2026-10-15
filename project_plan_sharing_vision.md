# Rencana Kerja (Project Plan) - Fullstack Test Sharing Vision

Dokumen ini berisi panduan langkah demi langkah untuk menyelesaikan tugas fullstack berdasarkan spesifikasi pada **Test Backend Sharing Vision.pdf** dan **Test Frontend Sharing Vision.pdf**.

## 📌 Fase 1: Persiapan Proyek & Arsitektur (Hari 1)

1. **Inisialisasi Repositori Git (Terpisah)**

   * Buat **dua repositori Git yang sepenuhnya terpisah**: satu khusus untuk project **Backend** dan satu khusus untuk project **Frontend**.

   * Lakukan inisialisasi (`git init`) pada masing-masing folder.

   * Siapkan file `.gitignore` standar pada masing-masing repositori (satu khusus untuk Golang di repo backend, dan satu khusus untuk Node.js/Vue di repo frontend).

2. **Setup Database Lokal**

   * Install MySQL di lingkungan lokal (atau gunakan Docker: `docker run --name mysql-db -e MYSQL_ROOT_PASSWORD=root -d mysql`).

   * Buat database dengan nama `article`.

## ⚙️ Fase 2: Pengembangan Backend - Golang & MySQL (Hari 1 - 2)

*Referensi: Test Backend Sharing Vision.pdf*

1. **Setup Project Golang**

   * Jalankan `go mod init <nama-module>`.

   * Install framework/router (menggunakan **Gin Gonic** untuk mempermudah routing dan implementasi API).

   * Install driver database dan ORM/Migration tools menggunakan **GORM** (package: `gorm.io/gorm` dan `gorm.io/driver/mysql`) untuk mempermudah manipulasi data dan auto-migrasi.

   * Install library validasi (rekomendasi: `go-playground/validator/v10` untuk validasi JSON yang ketat. Gin juga sudah memiliki built-in validator yang berbasis pada library ini).

2. **Pembuatan Skema & Migrasi Database**

   * Buat struct `Post` yang merepresentasikan tabel `posts` dengan field:

     * `Id` (Int, auto increment, PK)

     * `Title` (varchar 200)

     * `Content` (Text)

     * `Category` (varchar 100)

     * `Created_date` (Timestamp)

     * `Updated_date` (Timestamp)

     * `Status` (Varchar 100) -> *Catatan: Gunakan enum/konstanta untuk Publish, Draft, Thrash*.

   * Jalankan fungsi `AutoMigrate` dari GORM saat aplikasi dijalankan untuk memenuhi syarat poin 2 (Membuat database menggunakan migrate golang).

3. **Pembuatan JSON Validator Strict**

   * Buat DTO (Data Transfer Object) untuk request body.

   * Pasang tag validasi sesuai soal (pada Gin Gonic gunakan tag `binding`):

     * `Title`: `binding:"required,min=20"`

     * `Content`: `binding:"required,min=200"`

     * `Category`: `binding:"required,min=3"`

     * `Status`: `binding:"required,oneof=publish draft thrash"`

4. **Implementasi 5 Endpoint API**

   * `POST /article/` : Menerima JSON body, melakukan validasi, dan insert ke tabel `posts`.

   * `GET /article/:limit/:offset` : Menampilkan data dengan pagination menggunakan parameter di URL.

   * `GET /article/:id` : Menampilkan detail artikel berdasarkan ID.

   * `PUT /article/:id` (atau PATCH/POST) : Menerima JSON body, melakukan validasi, dan update data artikel berdasarkan ID.

   * `DELETE /article/:id` (atau POST) : Menghapus data. *(Best practice: Ubah status menjadi "thrash" atau hapus permanen dari tabel sesuai kebijakan, namun karena ada tab "Trashed" di frontend, disarankan melakukan soft-delete dengan mengubah status menjadi "thrash")*.

5. **Postman Collection**

   * Buat Collection baru di Postman.

   * Tambahkan 5 request untuk masing-masing endpoint di atas.

   * Simpan contoh request body yang valid dan tidak valid untuk menguji validasi.

   * Export collection menjadi format `.json` untuk diserahkan sebagai hasil tes.

## 🎨 Fase 3: Pengembangan Frontend (Hari 3 - 4)

*Referensi: Test Frontend Sharing Vision.pdf*
*Rekomendasi Tech Stack: Vue.js (menggunakan Vite), digabungkan dengan Tailwind CSS agar cepat dalam styling.*

1. **Setup Project Frontend**

   * Inisialisasi project Vue (contoh: `npm create vite@latest frontend -- --template vue`).

   * Install Tailwind CSS (`npm install -D tailwindcss postcss autoprefixer` dan jalankan `npx tailwindcss init -p`).

   * Setup router menggunakan Vue Router (`npm install vue-router@4`).

   * Buat struktur layout utama (Sidebar/Navbar untuk navigasi antar halaman).

2. **Halaman Dashboard (All Posts)**

   * Buat sistem Tabs UI: **Published**, **Drafts**, **Trashed**.

   * Integrasikan dengan endpoint `GET /article/:limit/:offset` (lakukan filter di frontend, atau modifikasi sedikit backend untuk menerima filter status jika datanya terlalu besar).

   * Di dalam tabel tampilkan: `Title`, `Category`, `Action` (Ikon Edit & Ikon Trash).

   * **Logika Ikon Trash**: Jika di-klik, panggil API `PUT/DELETE /article/:id` untuk mengubah status artikel menjadi `thrash`. Refresh data tabel setelahnya.

   * **Logika Ikon Edit**: Jika di-klik, arahkan ke rute edit (contoh: `/edit/:id`).

3. **Halaman Add New**

   * Buat form input (menggunakan `v-model` Vue) untuk: `Title`, `Content`, dan `Category`.

   * Tambahkan dua tombol submit: **Publish** (set status = "publish") dan **Draft** (set status = "draft").

   * Integrasikan dengan `POST /article/`. Tangkap pesan error dari backend jika validasi gagal (misal teks kurang dari 20 karakter) dan tampilkan ke user (Alert/Toast).

4. **Halaman Edit Article**

   * Tampilkan form yang sama dengan "Add New".

   * Saat komponen di-mount (`onMounted`), panggil `GET /article/:id` untuk mengisi nilai (populate) ke dalam input form.

   * Tambahkan tombol **Publish** dan **Draft** untuk memperbarui data via API `PUT /article/:id`.

5. **Halaman Preview**

   * Halaman publik untuk menampilkan daftar blog.

   * Hanya fetch dan tampilkan data yang memiliki status `publish`.

   * Buat sistem **Pagination** (Prev/Next atau angka halaman) yang terhubung dengan endpoint `GET /article/:limit/:offset`.

## 🚀 Fase 4: Deployment & Hosting Gratis (Hari 5)

Berikut adalah rekomendasi platform *Free Tier* terbaik untuk arsitektur ini beserta langkah-langkahnya:

### 1. Database: Aiven for MySQL

*Rekomendasi:* Menggunakan **Aiven** karena menyediakan *free tier* MySQL murni yang stabil dan sangat mudah diintegrasikan dengan GORM.

* **Langkah Persiapan:**

  1. Daftar di [Aiven.io](https://aiven.io/).

  2. Buat service baru, pilih MySQL, dan pilih paket "Free".

  3. Dapatkan *Connection URI* (Host, Port, User, Password).

  4. Pastikan untuk mengonfigurasi **IP Allowlist** di dashboard Aiven agar service backend dari Render diizinkan untuk mengakses database ini.

  5. Masukkan kredensial ini ke dalam file `.env` di project backend Golang Anda.

### 2. Backend (Golang): Render.com

*Render memiliki Web Service gratis yang sangat cocok untuk Golang.*

* **Langkah Persiapan:**

  1. Push kode dari repositori GitHub **Backend** Anda.

  2. Daftar ke [Render.com](https://render.com/) dan buat "New Web Service".

  3. Hubungkan ke repositori backend tersebut.

  4. Render akan mendeteksi project Go. Set Build Command: `go build -o main .` dan Start Command: `./main`.

  5. Masukkan Environment Variables (termasuk koneksi MySQL dari Aiven) di tab Environment Render.

  6. Deploy dan simpan URL endpoint yang dihasilkan (contoh: `https://backend-sv.onrender.com`).

### 3. Frontend (Web): Vercel

* **Langkah Persiapan:**

  1. Pastikan di kode frontend Vue.js, Base URL API mengambil dari Environment Variable (contoh: `import.meta.env.VITE_API_BASE_URL`).

  2. Push kode dari repositori GitHub **Frontend** Anda.

  3. Daftar ke [Vercel.com](https://vercel.com/) dan klik "Add New Project".

  4. Hubungkan repositori frontend tersebut. Vercel akan otomatis mengenali project Vite/Vue.

  5. Tambahkan Environment Variable (`VITE_API_BASE_URL` diset dengan URL backend dari Render).

  6. Deploy dan aplikasi siap digunakan.

## ✅ Final Checklist Sebelum Submit

* \[ \] Apakah backend memvalidasi *title min 20* dan *content min 200*?

* \[ \] Apakah migrasi database ter-generate secara terprogram dari Golang menggunakan GORM?

* \[ \] Apakah endpoint GET all menggunakan format URL param `<limit>/<offset>`?

* \[ \] Apakah Dashboard Vue bisa filter/pindah tab berdasarkan Publish, Draft, Thrash?

* \[ \] Apakah klik Trash di tabel benar-benar memindahkan artikel ke tab Trashed?

* \[ \] Apakah Preview Page memilki pagination dan khusus status 'Publish'?

* \[ \] Apakah Postman Collection sudah di-export?

* \[ \] Apakah link URL aplikasi yang sudah di-deploy bisa diakses publik?