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
    { nik: "3578010101800001", name: "Budi Santoso", dusun: "Dusun Pelita" },
    { nik: "3578010101800002", name: "Siti Aminah", dusun: "Dusun Rasabou" },
    { nik: "3578010101800003", name: "Ahmad Rizal", dusun: "Dusun Lawiti" },
    { nik: "3578010101800004", name: "Fatimah Zahra", dusun: "Dusun Restu" },
    { nik: "3578010101800005", name: "Hamdan Yusuf", dusun: "Dusun Nata Kehe" },
    { nik: "3578010101800006", name: "Nurul Hidayah", dusun: "Dusun Pelita" },
    { nik: "3578010101800007", name: "Ridwan Kamil", dusun: "Dusun Rasabou" },
    { nik: "3578010101800008", name: "Dewi Rahayu", dusun: "Dusun Lawiti" },
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
      title: "Perbaikan Jalan Dusun Pelita yang Rusak",
      category: "Infrastruktur",
      location: "DUSUN_PELITA" as const,
      description:
        "Kondisi jalan di Dusun Pelita sangat memprihatinkan dengan banyak lubang dan kerusakan. Hal ini menyulitkan akses kendaraan dan membahayakan pengendara.",
    },
    {
      nik: "3578010101800002",
      title: "Penambahan Kegiatan Posyandu Rutin Dusun Rasabou",
      category: "Sosial",
      location: "DUSUN_RASABOU" as const,
      description:
        "Kami mengusulkan penambahan kegiatan posyandu dan penyuluhan kesehatan secara rutin untuk ibu dan anak di Dusun Rasabou.",
    },
    {
      nik: "3578010101800003",
      title: "Penanganan Sampah di Dusun Lawiti",
      category: "Lingkungan",
      location: "DUSUN_LAWITI" as const,
      description:
        "Sampah menumpuk di area pemukiman Dusun Lawiti, terutama di dekat jalan utama. Perlu penanganan serius agar tidak menimbulkan penyakit.",
    },
    {
      nik: "3578010101800004",
      title: "Penerangan Jalan Dusun Restu Masih Minim",
      category: "Infrastruktur",
      location: "DUSUN_RESTU" as const,
      description:
        "Banyak titik jalan di Dusun Restu yang masih gelap di malam hari. Kami mohon pemasangan lampu jalan untuk keamanan warga.",
    },
    {
      nik: "3578010101800005",
      title: "Usulan Pembangunan Taman Bermain Dusun Nata Kehe",
      category: "Sosial",
      location: "DUSUN_NATA_KEHE" as const,
      description:
        "Anak-anak di Dusun Nata Kehe membutuhkan ruang bermain yang aman. Kami mengusulkan pembangunan taman bermain sederhana di area kosong dekat balai dusun.",
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
