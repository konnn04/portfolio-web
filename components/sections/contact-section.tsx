"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, Loader2, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { useLanguage } from "@/components/providers/providers";
import { useMyInfo } from "@/hooks/use-my-info";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { WireCube } from "../about/about-timeline";

type Status = "idle" | "sending" | "sent" | "error" | "rate_limited" | "not_configured";
const STORAGE_KEY = "contact_last_sent";
const DAY_MS = 24 * 60 * 60 * 1000;

export function ContactSection() {
  const { t } = useLanguage();
  const { profile } = useMyInfo();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    const last = Number(localStorage.getItem(STORAGE_KEY) || 0);
    if (last && Date.now() - last < DAY_MS) setStatus("rate_limited");
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending" || status === "sent" || status === "rate_limited") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (res.ok) {
        localStorage.setItem(STORAGE_KEY, String(Date.now()));
        setStatus("sent");
        setName("");
        setEmail("");
        setMessage("");
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (res.status === 429) {
        localStorage.setItem(STORAGE_KEY, String(Date.now()));
        setStatus("rate_limited");
      } else if (data.error === "not_configured") {
        setStatus("not_configured");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const disabled = status === "sending" || status === "sent" || status === "rate_limited";

  return (
    <section id="contact" className="relative w-full scroll-mt-20 py-24 md:py-32">
      <div className="container mx-auto max-w-3xl px-4 md:px-6">
        <div className="flex flex-col items-center">
          <ScrollReveal>
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="relative mx-auto mb-6"
            >
              <div className="absolute inset-0 rounded-2xl bg-primary/30 blur-xl" />
              <div className="relative flex h-16 w-16 items-center justify-center text-primary">
                <Mail className="h-7 w-7" />
                <WireCube icon={Mail}/>
              </div>
              <motion.span
                className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-primary"
                animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
                transition={{ repeat: Infinity, duration: 1.8 }}
              />
            </motion.div>
          </ScrollReveal>
          <SectionHeading
            index="07"
            kicker={t("sections.contact")}
            title={t("contact.title")}
            subtitle={t("contact.subtitle")}
          />
        </div>

        <ScrollReveal direction="up" delay={0.1}>
          <div className="group relative rounded-3xl">
            <div className="absolute -inset-px rounded-3xl bg-gradient-to-r from-primary/50 via-primary/10 to-primary/50 opacity-60 blur-[1px] transition-opacity duration-500 group-hover:opacity-100" />
            <form
              onSubmit={submit}
              className="card-3d relative flex flex-col gap-5 rounded-3xl border bg-card/80 p-6 backdrop-blur-md sm:p-8"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm font-medium">
                  {t("contact.name")}
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={disabled}
                    placeholder={t("contact.name_placeholder")}
                    className="rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary disabled:opacity-60"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium">
                  {t("contact.email")}
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={disabled}
                    placeholder="you@example.com"
                    className="rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary disabled:opacity-60"
                  />
                </label>
              </div>
              <label className="flex flex-col gap-2 text-sm font-medium">
                {t("contact.message")}
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={disabled}
                  placeholder={t("contact.message_placeholder")}
                  className="resize-none rounded-xl border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary disabled:opacity-60"
                />
              </label>

              {/* Status messages */}
              {status === "sent" && (
                <p className="flex items-center gap-2 text-sm font-medium text-green-500">
                  <CheckCircle2 className="h-4 w-4" /> {t("contact.success")}
                </p>
              )}
              {status === "rate_limited" && (
                <p className="flex items-center gap-2 text-sm font-medium text-yellow-500">
                  <Clock className="h-4 w-4" /> {t("contact.rate_limited")}
                </p>
              )}
              {status === "error" && (
                <p className="flex items-center gap-2 text-sm font-medium text-destructive">
                  <AlertCircle className="h-4 w-4" /> {t("contact.error")}
                </p>
              )}
              {status === "not_configured" && (
                <p className="flex items-center gap-2 text-sm font-medium text-destructive">
                  <AlertCircle className="h-4 w-4" /> {t("contact.not_configured")}
                </p>
              )}

              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <button
                  type="submit"
                  disabled={disabled}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
                >
                  {status === "sending" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> {t("contact.sending")}
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" /> {t("contact.send")}
                    </>
                  )}
                </button>
                <a
                  href={profile.socials.mail.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {profile.socials.mail.label}
                </a>
              </div>
            </form>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
