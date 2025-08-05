"use client";
import React from "react";
import Image from "next/image";

import { Linkedin, Github, Newspaper } from "lucide-react";
import ServicesSection from "./ServicesSection";
import DeveloperTeamSection from "./DeveloperTeamSection";

export default function AboutPage() {
  return (
    <div className="bg-white text-gray-800 px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        <h2 className="text-4xl font-extrabold text-center text-gray-900 dark:text-white mb-10">
          {" "}
          About Us{" "}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-6 border rounded-xl bg-white dark:bg-gray-950 shadow-sm">
          {/* Image Section */}
          <div className="flex justify-center items-center">
            <Image
              src="https://placehold.co/300x300.png"
              alt="Kaizen AI Logo"
              data-ai-hint="logo"
              className="rounded-xl shadow-md"
              width={300}
              height={300}
            />
          </div>

          {/* Text Section */}
          <div className="flex flex-col justify-center">
            <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
              <strong className="text-2xl text-gray-900 dark:text-white font-semibold">
                Kaizen AI
              </strong>{" "}
              is your intelligent career companion, founded by{" "}
              <span className="font-semibold text-blue-600">
                Sudhanshu Gaikwad
              </span>
              , with a mission to eliminate the friction in career growth. What
              began as a personal journey now empowers students, job seekers,
              and professionals with smart tools like resume analyzers, roadmap
              generators, and AI-driven chat guidance.
            </p>

            <p className="mt-4 text-gray-700 dark:text-gray-300 text-base leading-relaxed">
              Blending the power of AI, real-world insights, and intuitive
              design, Kaizen AI helps users make informed decisions, track
              progress, and confidently advance in their careers—anytime,
              anywhere.
            </p>

            {/* Social Media Icons */}
            <div className="flex gap-6 mt-6">
              <a
                href="https://www.linkedin.com/in/sudhanshugaikwad"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-600 transition"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a
                href="https://github.com/sudhanshugaikwad"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition"
              >
                <Github className="w-6 h-6" />
              </a>
              <a
                href="https://dev.to/sudhanshudevelopers"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-purple-600 transition"
              >
                <Newspaper className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <ServicesSection />

        {/* Developer Team */}
        <DeveloperTeamSection />

        {/* Footer */}
        <footer className="text-center text-sm text-gray-400 mt-12 border-t pt-6">
          &copy; {new Date().getFullYear()} Kaizen Ai. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
