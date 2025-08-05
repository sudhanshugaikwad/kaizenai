'use client';
import React from 'react';

export default function ServicesSection() {
    return (
        <section className="py-12 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h3 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">Our Services</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                        <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">AI-Powered Tools</h4>
                        <p className="text-gray-600 dark:text-gray-300">From resume analysis to cover letter generation, our tools are designed to give you a competitive edge.</p>
                    </div>
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                        <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Career Roadmaps</h4>
                        <p className="text-gray-600 dark:text-gray-300">Get personalized roadmaps to guide you towards your career goals with actionable steps.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
