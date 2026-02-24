import "dotenv/config";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

async function seedAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  const name = process.env.SEED_ADMIN_NAME ?? "Administrator";

  if (!email || !password) {
    throw new Error(
      "SEED_ADMIN_EMAIL dan SEED_ADMIN_PASSWORD harus diisi di .env",
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`✓ Admin sudah ada: ${email}`);
    await prisma.user.update({ where: { email }, data: { role: "admin" } });
    return;
  }

  await auth.api.signUpEmail({ body: { email, password, name } });

  await prisma.user.update({ where: { email }, data: { role: "admin" } });

  console.log(`✓ Admin berhasil dibuat: ${email}`);
}

async function seedNIKRecords() {
  const testNIKs = [
    { nik: "3578010101800001", name: "Budi Santoso", dusun: "Dusun 1" },
    { nik: "3578010101800002", name: "Siti Aminah", dusun: "Dusun 2" },
    { nik: "3578010101800003", name: "Ahmad Rizal", dusun: "Dusun 3" },
    { nik: "3578010101800004", name: "Fatimah Zahra", dusun: "Dusun 4" },
    { nik: "3578010101800005", name: "Hamdan Yusuf", dusun: "Dusun 5" },
    { nik: "3578010101800006", name: "Nurul Hidayah", dusun: "Dusun 1" },
    { nik: "3578010101800007", name: "Ridwan Kamil", dusun: "Dusun 2" },
    { nik: "3578010101800008", name: "Dewi Rahayu", dusun: "Dusun 3" },
  ];

  for (const { nik, name } of testNIKs) {
    await prisma.nIKRecord.upsert({
      where: { nik },
      update: {},
      create: { nik, name, isActive: true },
    });
    console.log(`✓ NIK: ${nik} (${name})`);
  }
}

async function seedReports() {
  const count = await prisma.report.count();
  if (count > 0) {
    console.log(`✓ Laporan sudah ada (${count} data), dilewati`);
    return;
  }

  const sampleReports = [
    {
      nik: "3578010101800001",
      title: "Perbaikan Jalan Dusun 1 yang Rusak",
      category: "Infrastruktur",
      location: "DUSUN_1" as const,
      description:
        "Kondisi jalan di Dusun 1 sangat memprihatinkan dengan banyak lubang dan kerusakan. Hal ini menyulitkan akses kendaraan dan membahayakan pengendara.",
    },
    {
      nik: "3578010101800002",
      title: "Penambahan Kegiatan Posyandu Rutin Dusun 2",
      category: "Sosial",
      location: "DUSUN_2" as const,
      description:
        "Kami mengusulkan penambahan kegiatan posyandu dan penyuluhan kesehatan secara rutin untuk ibu dan anak di Dusun 2.",
    },
    {
      nik: "3578010101800003",
      title: "Penanganan Sampah di Dusun 3",
      category: "Lingkungan",
      location: "DUSUN_3" as const,
      description:
        "Sampah menumpuk di area pemukiman Dusun 3, terutama di dekat jalan utama. Perlu penanganan serius agar tidak menimbulkan penyakit.",
    },
    {
      nik: "3578010101800004",
      title: "Penerangan Jalan Dusun 4 Masih Minim",
      category: "Infrastruktur",
      location: "DUSUN_4" as const,
      description:
        "Banyak titik jalan di Dusun 4 yang masih gelap di malam hari. Kami mohon pemasangan lampu jalan untuk keamanan warga.",
    },
    {
      nik: "3578010101800005",
      title: "Usulan Pembangunan Taman Bermain Dusun 5",
      category: "Sosial",
      location: "DUSUN_5" as const,
      description:
        "Anak-anak di Dusun 5 membutuhkan ruang bermain yang aman. Kami mengusulkan pembangunan taman bermain sederhana di area kosong dekat balai dusun.",
    },
  ];

  for (const data of sampleReports) {
    await prisma.report.create({ data: { ...data, status: "DRAFT" } });
    console.log(`✓ Laporan: "${data.title}"`);
  }
}

async function main() {
  console.log("🌱 Memulai seeding database...\n");

  console.log("👤 Membuat admin...");
  await seedAdmin();

  console.log("\n🪪  Membuat data NIK...");
  await seedNIKRecords();

  console.log("\n📋 Membuat laporan contoh...");
  await seedReports();

  console.log("\n✅ Seeding selesai!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding gagal:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
