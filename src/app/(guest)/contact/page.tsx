"use client";

import { Mail } from "lucide-react";
import { Button } from "@/components/ui/prebuilt-components/button";
import { Input } from "@/components/ui/prebuilt-components/input";
import { Textarea } from "@/components/ui/prebuilt-components/textarea";
import { useState } from "react";
import { motion, cubicBezier } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const EASE_OUT = cubicBezier(0.16, 1, 0.3, 1);

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT },
  },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const contactSchema = z
  .object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().email(),
    subject: z.string().trim().min(3).max(150),
    message: z.string().trim().min(10).max(3000),
  })
  .strict();

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Failed");

      setSuccess(true);
      reset();
    } catch {
      setError("Something went wrong. Please try again later.");
    }
  });

  return (
    <main className="bg-mitti-beige w-full">
      <motion.section
        className="px-6 py-12 flex justify-center"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        <div className="max-w-3xl w-full">
          {/* Header */}
          <motion.div variants={fadeUp} className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, ease: EASE_OUT }}
                className="flex items-center justify-center w-14 h-14 rounded-full bg-mitti-brown/10"
              >
                <Mail className="text-mitti-brown size-6" />
              </motion.div>
            </div>

            <p className="text-sm uppercase tracking-widest text-mitti-brown mb-4">
              Contact
            </p>

            <h1 className="text-3xl sm:text-4xl font-semibold text-mitti-dark-brown mb-4">
              Get in touch with the MITTI team
            </h1>

            <p className="text-mitti-dark-brown/80 leading-relaxed max-w-xl mx-auto">
              Questions, feedback, or ideas related to the platform.
              <br />
              We usually respond within 2 to 3 working days.
            </p>
          </motion.div>

          {/* Divider */}
          <motion.div
            variants={fadeUp}
            className="h-px w-full bg-mitti-dark-brown/15 mb-8"
          />

          {/* Form */}
          {success ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE_OUT }}
              className="text-center py-24"
            >
              <h3 className="text-2xl font-semibold text-mitti-dark-brown mb-4">
                Message sent successfully
              </h3>
              <p className="text-mitti-dark-brown/80 max-w-md mx-auto">
                Thank you for reaching out. We will get back to you shortly.
              </p>
            </motion.div>
          ) : (
            <motion.form
              onSubmit={onSubmit}
              className="space-y-5"
              variants={stagger}
            >
              {[
                {
                  label: "Full name",
                  name: "name",
                  type: "text",
                  placeholder: "Your full name",
                },
                {
                  label: "Email address",
                  name: "email",
                  type: "email",
                  placeholder: "you@example.com",
                },
                {
                  label: "Subject",
                  name: "subject",
                  type: "text",
                  placeholder: "What is this regarding?",
                },
              ].map((field) => (
                <motion.div key={field.name} variants={fadeUp}>
                  <label className="block text-sm font-medium text-mitti-dark-brown mb-3">
                    {field.label}
                  </label>
                  <Input
                    type={field.type}
                    placeholder={field.placeholder}
                    {...register(
                      field.name as keyof ContactFormValues,
                    )}
                    className="h-12 bg-white/70 border border-mitti-dark-brown/25 rounded-xl focus-visible:ring-2 focus-visible:ring-mitti-brown transition-shadow"
                  />
                  {errors[field.name as keyof ContactFormValues] && (
                    <p className="text-sm text-red-600 mt-2">
                      {errors[field.name as keyof ContactFormValues]?.message}
                    </p>
                  )}
                </motion.div>
              ))}

              <motion.div variants={fadeUp}>
                <label className="block text-sm font-medium text-mitti-dark-brown mb-3">
                  Message
                </label>
                <Textarea
                  rows={5}
                  placeholder="Write your message here..."
                  {...register("message")}
                  className="bg-white/70 border border-mitti-dark-brown/25 rounded-xl focus-visible:ring-2 focus-visible:ring-mitti-brown transition-shadow"
                />
                {errors.message && (
                  <p className="text-sm text-red-600 mt-2">
                    {errors.message.message}
                  </p>
                )}
              </motion.div>

              {error && (
                <p className="text-sm text-red-600 text-center">{error}</p>
              )}

              <motion.div variants={fadeUp} className="pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  className="w-full bg-mitti-brown text-mitti-beige hover:bg-mitti-dark-brown cursor-pointer rounded-xl py-3 text-base transition-transform active:scale-[0.98]"
                >
                  {isSubmitting ? "Sending..." : "Send message"}
                </Button>
              </motion.div>
            </motion.form>
          )}

          {/* Footnote */}
          <motion.p
            variants={fadeUp}
            className="mt-10 text-center text-sm text-mitti-dark-brown/60 leading-relaxed max-w-2xl mx-auto"
          >
            MITTI is an academic project developed as part of a B. Sc. I.T.
            program. Messages are intended for general queries, feedback, and
            platform related discussions.
          </motion.p>
        </div>
      </motion.section>
    </main>
  );
}
