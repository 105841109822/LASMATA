"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export function ProfileSection() {
  return (
    <section id="profile" className="py-20 px-6 lg:px-8 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Profil <span className="text-primary">Desa</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="order-2 md:order-1"
          >
            <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-lg border border-border">
              <Image
                src="/desa-placeholder.jpg"
                alt="Pemandangan Desa Kita"
                fill
                className="object-cover"
                onError={(e) => {
                  // Fallback to gradient if image fails to load
                  const target = e.target as HTMLElement;
                  target.style.background =
                    "linear-gradient(135deg, rgb(16 185 129 / 0.2) 0%, rgb(16 185 129 / 0.05) 100%)";
                }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="order-1 md:order-2 space-y-4"
          >
            <h3 className="text-2xl font-bold text-foreground">Desa Tembalae</h3>
            <p className="text-foreground leading-relaxed">
              Desa Tembalae adalah sebuah desa yang terus berkembang dengan semangat
              gotong royong dan partisipasi aktif seluruh warga. Desa ini
              memiliki potensi besar dalam bidang pertanian, budaya, dan sumber
              daya manusia.
            </p>
            <p className="text-foreground leading-relaxed">
              Dengan populasi yang terus berkembang, Desa Tembalae berkomitmen untuk
              meningkatkan kualitas pelayanan publik dan infrastruktur desa.
              Melalui partisipasi aktif masyarakat, kami bersama-sama membangun
              desa yang lebih baik.
            </p>
            <p className="text-foreground leading-relaxed">
              <span className="font-semibold text-primary">Visi kami:</span>{" "}
              Mewujudkan Desa Tembalae sebagai desa yang maju, mandiri, dan
              sejahtera berbasis partisipasi masyarakat.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
