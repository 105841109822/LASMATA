"use client";

import { motion } from "framer-motion";

export function CollaborationSection() {
  return (
    <section className="py-16 px-6 lg:px-8 bg-muted/50 dark:bg-muted/30">
      <div className="container mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-relaxed">
            Dipersembahkan oleh
            <br />
            <span className="text-primary">Desa Tembalae</span>
            <br />
            Bersama <span className="text-primary">Tim Pengembang LASMATA</span>
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Sebuah wujud sinergi antara masyarakat dan aparatur Desa Tembalae
            bersama rekan-rekan mahasiswa dari Fakultas Teknik Universitas
            Muhammadiyah Makassar dalam menciptakan transparansi dan kemudahan
            akses layanan publik.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
