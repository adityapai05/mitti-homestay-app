"use client";

import { useState } from "react";

const NewsletterForm = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(email);
    // TODO: Call Firestore API here
    setEmail("");
  };
  return (
    <div className="max-w-6xl mx-auto bg-mitti-cream text-mitti-dark-brown p-6 rounded-2xl flex flex-col justify-between items-center gap-4 mb-10">
      <h3 className="text-xl/6 font-semibold text-center lg:text-left ">
        Get updates on  new <br className="block sm:hidden" /> rural experiences
        and stays
      </h3>
      <form
        className="flex flex-col sm:flex-row gap-2 w-full max-w-xl"
        onSubmit={handleSubmit}
      >
        <label htmlFor="email" className="sr-only">
          Enter your email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1 px-4 py-2 rounded-md border border-mitti-brown focus:outline-none focus:ring-2 focus:ring-mitti-dark-brown"
        />
        <button
          type="submit"
          className="bg-mitti-brown text-white px-6 py-2 rounded-md hover:bg-mitti-dark-brown transition"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
};

export default NewsletterForm;
