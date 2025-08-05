"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 text-white">
      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-10">
        
        {/* Left Text Section */}
        <motion.div
          className="flex-1 text-center md:text-left"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Connect. Chat. Collaborate.
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8">
            Experience seamless video calls and group conversations with crystal‑clear quality.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link
              href="/sign-up"
              className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-2xl shadow-lg text-lg font-semibold transition"
            >
              Get Started
            </Link>
            <Link
              href="/sign-in"
              className="bg-white hover:bg-gray-100 text-pink-600 px-6 py-3 rounded-2xl shadow-lg text-lg font-semibold transition"
            >
              Log In
            </Link>
          </div>
        </motion.div>

        {/* Right Image Section */}
        <motion.div
          className="flex-1 flex justify-center md:justify-end"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Image
            src="/app-preview.png"
            alt="App Preview"
            width={500}
            height={500}
            className="rounded-3xl shadow-2xl"
          />
        </motion.div>
      </div>

      {/* Bottom Feature Highlights */}
      <section className="mt-16 w-full px-6 md:px-12">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {[
            { title: "HD Video", desc: "Enjoy crisp and smooth video calls." },
            { title: "Group Calls", desc: "Connect with your whole team instantly." },
            { title: "Secure & Private", desc: "Your conversations stay protected." },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-md hover:bg-white/20 transition"
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-200">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
