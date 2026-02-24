"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin, ExternalLink } from "lucide-react";

export function LocationSection() {
  return (
    <section id="location" className="py-20 px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Lokasi <span className="text-primary">Kami</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Temukan kami di Desa Tembalae
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          {/* Map */}
          <div className="relative w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden border border-border shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3944.8335493588606!2d118.49140170000001!3d-8.6119743!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dca7b2dc20f1db1%3A0x5afa1b35004ac40c!2sKantor%20Desa%20Temba%20Lae%20Kecamatan%20Pajo%20Kabupaten%20Dompu%20NTB!5e0!3m2!1sid!2sid!4v1771821400160!5m2!1sid!2sid"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lokasi Desa Tembalae"
            />
          </div>

          {/* Address */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 bg-muted/50 rounded-lg border border-border">
            <div className="flex items-start gap-3 text-left">
              <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-foreground mb-1">Desa Tembalae</p>
                <p className="text-sm text-muted-foreground">
                  Kecamatan Pajo, Kabupaten Dompu
                  <br />
                  Nusa Tenggara Barat, Indonesia
                </p>
              </div>
            </div>
            <Button
              size="default"
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground flex-shrink-0 dark:hover:text-primary"
              asChild
            >
              <a
                href="https://www.google.com/maps/place/9FQR%2B6H6+Kantor+Desa+Temba+Lae+Kecamatan+Pajo+Kabupaten+Dompu+NTB,+Jl.+Lintas+Lakey+Desa+Temba+Lae,+Ranggo,+Pajo,+Dompu+Regency,+West+Nusa+Tenggara+84272/data=!4m2!3m1!1s0x2dca7b2dc20f1db1:0x5afa1b35004ac40c!17m2!4m1!1e3!18m1!1e1?utm_source=mstt_1&entry=gps&coh=192189&g_ep=CAESBjI2LjcuNRgAIJ6dCiqUASw5NDI2NzcyNyw5NDI5MjE5NSw5NDI5OTUzMiwxMDA3OTY0OTgsMTAwNzk2NTMxLDk0MjgwNTc2LDk0MjA3Mzk0LDk0MjA3NTA2LDk0MjA4NTA2LDk0MjE4NjUzLDk0MjI5ODM5LDk0Mjc1MTY4LDk0Mjc5NjE5LDk0MjYyNzM5LDEwMDc5OTI0NiwxMDA3OTE0ODNCAklE&skid=d54f5316-aeae-4f01-a348-5408005bdbbb"
                target="_blank"
                rel="noopener noreferrer"
              >
                Buka di Google Maps
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
