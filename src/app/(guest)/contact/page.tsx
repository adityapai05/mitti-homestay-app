"use client";

import { Mail } from "lucide-react";
import { Button } from "@/components/ui/prebuilt-components/button";
import { Input } from "@/components/ui/prebuilt-components/input";
import { Textarea } from "@/components/ui/prebuilt-components/textarea";
import { useState } from "react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      setSuccess(true);
      form.reset();
    } catch {
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="bg-mitti-beige w-full">
      <section className="px-4 sm:px-6 py-12 flex justify-center">
        <div className="max-w-4xl w-full">
          {/* Header */}
          <div className="mb-10 text-center">
            <div className="flex justify-center mb-3">
              <Mail className="text-mitti-brown size-8" />
            </div>

            <p className="text-sm uppercase tracking-widest text-mitti-brown mb-2">
              Contact
            </p>

            <h1 className="text-3xl sm:text-4xl font-semibold text-mitti-dark-brown mb-4">
              Get in touch with the MITTI team
            </h1>

            <p className="text-mitti-dark-brown/80 max-w-xl mx-auto leading-relaxed">
              Questions, feedback, or ideas related to the platform.
              <br />
              We usually respond within 2–3 working days.
            </p>
          </div>

          {/* Form Surface */}
          <div className="relative bg-mitti-cream rounded-3xl p-6 sm:p-10 shadow-md">
            <div className="absolute inset-0 rounded-3xl ring-1 ring-mitti-dark-brown/10 pointer-events-none" />

            {success ? (
              <div className="relative text-center py-14">
                <h3 className="text-2xl font-semibold text-mitti-dark-brown mb-3">
                  Message sent successfully
                </h3>
                <p className="text-mitti-dark-brown/80 max-w-md mx-auto">
                  Thank you for reaching out. We will get back to you shortly.
                </p>
              </div>
            ) : (
              <form
                className="relative space-y-6 max-w-2xl mx-auto"
                onSubmit={handleSubmit}
              >
                <div>
                  <label className="block text-sm font-medium text-mitti-dark-brown mb-2">
                    Full name
                  </label>
                  <Input
                    name="name"
                    type="text"
                    placeholder="Your full name"
                    className="h-12 bg-white border border-mitti-dark-brown/30 rounded-xl focus-visible:ring-2 focus-visible:ring-mitti-brown"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-mitti-dark-brown mb-2">
                    Email address
                  </label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className="h-12 bg-white border border-mitti-dark-brown/30 rounded-xl focus-visible:ring-2 focus-visible:ring-mitti-brown"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-mitti-dark-brown mb-2">
                    Subject
                  </label>
                  <Input
                    name="subject"
                    type="text"
                    placeholder="What is this regarding?"
                    className="h-12 bg-white border border-mitti-dark-brown/30 rounded-xl focus-visible:ring-2 focus-visible:ring-mitti-brown"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-mitti-dark-brown mb-2">
                    Message
                  </label>
                  <Textarea
                    name="message"
                    placeholder="Write your message here..."
                    rows={5}
                    className="bg-white border border-mitti-dark-brown/30 rounded-xl focus-visible:ring-2 focus-visible:ring-mitti-brown"
                    required
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600 text-center">{error}</p>
                )}

                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-mitti-brown text-mitti-beige hover:bg-mitti-dark-brown cursor-pointer rounded-xl py-3 text-base shadow-sm disabled:opacity-70"
                  >
                    {loading ? "Sending..." : "Send message"}
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Transparency note */}
          <p className="mt-8 text-center text-sm text-mitti-dark-brown/60 leading-relaxed max-w-2xl mx-auto">
            MITTI is an academic project developed as part of a B. Sc. I.T.
            program. Messages are intended for general queries, feedback, and
            platform related discussions.
          </p>
        </div>
      </section>
    </main>
  );
}
