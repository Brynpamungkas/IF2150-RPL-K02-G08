-- =============================================================================
-- KlimPooL - skema database (MySQL 8.x, InnoDB, utf8mb4)
-- Acuan: DPPL Tabel 4.1 / 4.2, query Q-001..Q-137, dan Tabel B.1 laporan M9.
-- Dijalankan otomatis oleh Docker pada startup pertama (lihat docker-compose.yml).
-- Manual: mysql -u <user> -p <nama_db> < db/migrations/001_schema.sql
-- =============================================================================

SET NAMES utf8mb4;

-- ---------------------------------------------------------------- Bagian A ---

-- C00 PenggunaUmum. Email disimpan di tabel akun (satu sumber kebenaran).
CREATE TABLE pengguna (
  id_pengguna       VARCHAR(36)  NOT NULL,
  nama              VARCHAR(100) NOT NULL,
  peran             ENUM('volunteer','pembuat_project','admin') NOT NULL DEFAULT 'volunteer',
  telepon           VARCHAR(20)  NULL,
  kota              VARCHAR(100) NULL,
  tanggal_bergabung DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_pengguna)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- C12 Akun (Q-001, Q-002, Q-003). Kolom email memiliki unique index.
CREATE TABLE akun (
  id_akun        VARCHAR(36)  NOT NULL,
  id_pengguna    VARCHAR(36)  NOT NULL,
  email          VARCHAR(255) NOT NULL,
  password_hash  VARCHAR(255) NOT NULL,
  status_akun    ENUM('aktif','nonaktif') NOT NULL DEFAULT 'aktif',
  tanggal_dibuat DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_akun),
  UNIQUE KEY uq_akun_email (email),
  UNIQUE KEY uq_akun_pengguna (id_pengguna),
  CONSTRAINT fk_akun_pengguna FOREIGN KEY (id_pengguna)
    REFERENCES pengguna (id_pengguna) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- C13 SesiLogin (Q-004, Q-005, Q-006)
CREATE TABLE sesi_login (
  id_sesi           VARCHAR(64) NOT NULL,
  id_pengguna       VARCHAR(36) NOT NULL,
  waktu_mulai       DATETIME    NOT NULL,
  waktu_kedaluwarsa DATETIME    NOT NULL,
  status_sesi       ENUM('aktif','berakhir') NOT NULL DEFAULT 'aktif',
  PRIMARY KEY (id_sesi),
  KEY idx_sesi_pengguna (id_pengguna),
  KEY idx_sesi_kedaluwarsa (waktu_kedaluwarsa),
  CONSTRAINT fk_sesi_pengguna FOREIGN KEY (id_pengguna)
    REFERENCES pengguna (id_pengguna) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------- Bagian B ---

-- C04 Donatur (Q-105, Q-106, Q-109). Setiap pengguna non-admin memiliki satu baris.
CREATE TABLE donatur (
  id_donatur VARCHAR(36)   NOT NULL,
  saldo      DECIMAL(15,2) NOT NULL DEFAULT 0,
  PRIMARY KEY (id_donatur),
  CONSTRAINT chk_donatur_saldo CHECK (saldo >= 0),
  CONSTRAINT fk_donatur_pengguna FOREIGN KEY (id_donatur)
    REFERENCES pengguna (id_pengguna) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- C03 Campaign (B.1 baris 3 dan 4: provinsi/kota/koordinat dan status dua langkah)
CREATE TABLE campaign (
  id_campaign             VARCHAR(36)   NOT NULL,
  id_pembuat              VARCHAR(36)   NOT NULL,
  judul                   VARCHAR(200)  NOT NULL,
  deskripsi               TEXT          NOT NULL,
  kategori                VARCHAR(50)   NULL,
  target_nominal          DECIMAL(15,2) NOT NULL,
  periode_mulai           DATE          NOT NULL,
  periode_selesai         DATE          NOT NULL,
  provinsi                VARCHAR(100)  NOT NULL,
  kota                    VARCHAR(150)  NOT NULL,
  latitude                DECIMAL(9,6)  NULL,
  longitude               DECIMAL(9,6)  NULL,
  kebutuhan               TEXT          NULL,
  rincian_penggunaan_dana JSON          NULL,
  status                  ENUM('draft','menunggu_verifikasi','terpublikasi','ditolak') NOT NULL DEFAULT 'draft',
  alasan_penolakan        TEXT          NULL,
  dana_terkumpul          DECIMAL(15,2) NOT NULL DEFAULT 0,
  tanggal_dibuat          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  tanggal_pengajuan       DATETIME      NULL,
  tanggal_verifikasi      DATETIME      NULL,
  PRIMARY KEY (id_campaign),
  KEY idx_campaign_status (status),
  KEY idx_campaign_pembuat (id_pembuat),
  CONSTRAINT chk_campaign_target   CHECK (target_nominal > 0),
  CONSTRAINT chk_campaign_dana     CHECK (dana_terkumpul >= 0),
  CONSTRAINT chk_campaign_periode  CHECK (periode_mulai <= periode_selesai),
  CONSTRAINT chk_campaign_lat      CHECK (latitude  IS NULL OR latitude  BETWEEN -90  AND 90),
  CONSTRAINT chk_campaign_lng      CHECK (longitude IS NULL OR longitude BETWEEN -180 AND 180),
  CONSTRAINT chk_campaign_ditolak  CHECK (status <> 'ditolak' OR alasan_penolakan IS NOT NULL),
  CONSTRAINT fk_campaign_pembuat FOREIGN KEY (id_pembuat)
    REFERENCES pengguna (id_pengguna)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- C02 Project (B.1 baris 2-5). jadwal_* dan lokasi_kumpul boleh NULL saat draf;
-- aplikasi wajib memastikan terisi (mulai <= selesai) saat project dikirim (KF10).
CREATE TABLE project (
  id_project                 VARCHAR(36)   NOT NULL,
  id_pembuat                 VARCHAR(36)   NOT NULL,
  nama                       VARCHAR(200)  NOT NULL,
  deskripsi                  TEXT          NOT NULL,
  tujuan                     TEXT          NULL,
  kategori                   VARCHAR(50)   NULL,
  provinsi                   VARCHAR(100)  NOT NULL,
  kota                       VARCHAR(150)  NOT NULL,
  latitude                   DECIMAL(9,6)  NULL,
  longitude                  DECIMAL(9,6)  NULL,
  kebutuhan_dana             DECIMAL(15,2) NOT NULL DEFAULT 0,
  kebutuhan_logistik         TEXT          NULL,
  kriteria_volunteer         TEXT          NULL,
  rincian_penggunaan_dana    JSON          NULL,
  kuota_relawan              INT           NOT NULL DEFAULT 0,
  status_pendaftaran_project ENUM('dibuka','ditutup') NOT NULL DEFAULT 'dibuka',
  jadwal_mulai               DATE          NULL,
  jadwal_selesai             DATE          NULL,
  lokasi_kumpul              VARCHAR(255)  NULL,
  status                     ENUM('draft','menunggu_verifikasi','terpublikasi','ditolak') NOT NULL DEFAULT 'draft',
  alasan_penolakan           TEXT          NULL,
  dana_terkumpul             DECIMAL(15,2) NOT NULL DEFAULT 0,
  milestone                  VARCHAR(255)  NULL,
  status_pelaksanaan         ENUM('persiapan','berjalan','ditunda','selesai') NOT NULL DEFAULT 'persiapan',
  timestamp_pembaruan        DATETIME      NULL,
  tanggal_dibuat             DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  tanggal_pengajuan          DATETIME      NULL,
  tanggal_verifikasi         DATETIME      NULL,
  PRIMARY KEY (id_project),
  KEY idx_project_status (status),
  KEY idx_project_pembuat (id_pembuat),
  CONSTRAINT chk_project_kebutuhan CHECK (kebutuhan_dana >= 0),
  CONSTRAINT chk_project_dana      CHECK (dana_terkumpul >= 0),
  CONSTRAINT chk_project_kuota     CHECK (kuota_relawan >= 0),
  CONSTRAINT chk_project_jadwal    CHECK (jadwal_mulai IS NULL OR jadwal_selesai IS NULL OR jadwal_mulai <= jadwal_selesai),
  CONSTRAINT chk_project_lat       CHECK (latitude  IS NULL OR latitude  BETWEEN -90  AND 90),
  CONSTRAINT chk_project_lng       CHECK (longitude IS NULL OR longitude BETWEEN -180 AND 180),
  CONSTRAINT chk_project_ditolak   CHECK (status <> 'ditolak' OR alasan_penolakan IS NOT NULL),
  CONSTRAINT fk_project_pembuat FOREIGN KEY (id_pembuat)
    REFERENCES pengguna (id_pengguna)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- C06 TransaksiDonasi (Q-107, Q-108). id_tujuan menunjuk campaign atau project
-- menurut jenis_tujuan, jadi tidak dapat diberi foreign key tunggal.
CREATE TABLE transaksi_donasi (
  id_transaksi     VARCHAR(36)   NOT NULL,
  id_donatur       VARCHAR(36)   NOT NULL,
  id_tujuan        VARCHAR(36)   NOT NULL,
  jenis_tujuan     ENUM('campaign','project') NOT NULL,
  idempotency_key  VARCHAR(100)  NOT NULL,
  nominal          DECIMAL(15,2) NOT NULL,
  tanggal          DATETIME      NOT NULL,
  status_transaksi ENUM('berhasil','gagal') NOT NULL DEFAULT 'berhasil',
  PRIMARY KEY (id_transaksi),
  UNIQUE KEY uq_transaksi_idempotency (idempotency_key),
  KEY idx_transaksi_donatur (id_donatur, tanggal),
  KEY idx_transaksi_tujuan (jenis_tujuan, id_tujuan),
  CONSTRAINT chk_transaksi_nominal CHECK (nominal > 0),
  CONSTRAINT fk_transaksi_donatur FOREIGN KEY (id_donatur)
    REFERENCES donatur (id_donatur)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- C07 BuktiTransaksi (Q-113: ON DUPLICATE KEY memerlukan unique pada id_transaksi)
CREATE TABLE bukti_transaksi (
  id_bukti     VARCHAR(36) NOT NULL,
  id_transaksi VARCHAR(36) NOT NULL,
  rincian      TEXT        NOT NULL,
  PRIMARY KEY (id_bukti),
  UNIQUE KEY uq_bukti_transaksi (id_transaksi),
  CONSTRAINT fk_bukti_transaksi FOREIGN KEY (id_transaksi)
    REFERENCES transaksi_donasi (id_transaksi)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- C09 PendaftaranRelawan (Q-115, Q-116, Q-118). Unique (id_volunteer, id_project).
CREATE TABLE pendaftaran_relawan (
  id_pendaftaran      VARCHAR(36) NOT NULL,
  id_volunteer        VARCHAR(36) NOT NULL,
  id_project          VARCHAR(36) NOT NULL,
  data_diri           TEXT        NOT NULL,
  keahlian            TEXT        NULL,
  pengalaman          TEXT        NULL,
  ketersediaan_jadwal TEXT        NULL,
  status_pendaftaran  ENUM('pending','accepted','rejected') NOT NULL DEFAULT 'pending',
  tanggal_daftar      DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  tanggal_keputusan   DATETIME    NULL,
  PRIMARY KEY (id_pendaftaran),
  UNIQUE KEY uq_pendaftaran_volunteer_project (id_volunteer, id_project),
  KEY idx_pendaftaran_project (id_project, status_pendaftaran),
  CONSTRAINT fk_pendaftaran_volunteer FOREIGN KEY (id_volunteer)
    REFERENCES pengguna (id_pengguna),
  CONSTRAINT fk_pendaftaran_project FOREIGN KEY (id_project)
    REFERENCES project (id_project) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Riwayat pembaruan progres project (Q-133..Q-137). catatan, persentase, dan
-- dana_terpakai adalah tambahan dari prototipe (nullable).
CREATE TABLE progres_project (
  id_progres          VARCHAR(36)   NOT NULL,
  id_project          VARCHAR(36)   NOT NULL,
  id_pengguna         VARCHAR(36)   NOT NULL,
  milestone           VARCHAR(255)  NOT NULL,
  status_pelaksanaan  ENUM('persiapan','berjalan','ditunda','selesai') NOT NULL,
  catatan             TEXT          NULL,
  persentase          TINYINT UNSIGNED NULL,
  dana_terpakai       DECIMAL(15,2) NULL,
  dokumentasi_url     VARCHAR(500)  NULL,
  timestamp_pembaruan DATETIME      NOT NULL,
  PRIMARY KEY (id_progres),
  KEY idx_progres_project (id_project, timestamp_pembaruan),
  CONSTRAINT chk_progres_persen CHECK (persentase IS NULL OR persentase <= 100),
  CONSTRAINT fk_progres_project FOREIGN KEY (id_project)
    REFERENCES project (id_project) ON DELETE CASCADE,
  CONSTRAINT fk_progres_pengguna FOREIGN KEY (id_pengguna)
    REFERENCES pengguna (id_pengguna)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tambahan B.1 baris 1: top-up saldo simulasi. Terpisah dari transaksi_donasi
-- supaya atomisitas donasi (KF15-KF18) tidak tercampur.
CREATE TABLE topup_saldo (
  id_topup   VARCHAR(36)   NOT NULL,
  id_donatur VARCHAR(36)   NOT NULL,
  nominal    DECIMAL(15,2) NOT NULL,
  metode     VARCHAR(50)   NOT NULL,
  waktu      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_topup),
  KEY idx_topup_donatur (id_donatur, waktu),
  CONSTRAINT chk_topup_nominal CHECK (nominal > 0),
  CONSTRAINT fk_topup_donatur FOREIGN KEY (id_donatur)
    REFERENCES donatur (id_donatur)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
