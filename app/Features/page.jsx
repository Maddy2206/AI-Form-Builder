import React from 'react';
import { Pencil } from 'lucide-react';
import { Palette ,Share2,Bot} from 'lucide-react';
function Features() {
  return (
    <div>
      <section className="bg-gray-100 text-gray-900">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-lg text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Why choose Intelliform?</h2>

            <p className="mt-4 text-gray-700 text-lg">
              Intelliform is an innovative AI-powered form creation tool that transforms the way you build and manage forms. By simply providing a brief description, Intelliform generates fully structured, customized forms in seconds, saving you time and effort.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2 w-3/4 mx-auto">
            <a
              className="block rounded-xl border border-gray-300 p-8 shadow-xl transition hover:border-pink-500/10 hover:shadow-pink-500/10"
              href="#"
            >
               <Bot className='h-5 w-5 text-pink-500'></Bot>
              <h2 className="mt-4 text-xl font-bold text-gray-900">AI-Powered Form Automation</h2>
              <p className="mt-1 text-sm text-gray-700">
                Automatically generate fully structured forms by simply providing a brief description, saving time and effort. Intelliform's AI engine intelligently analyzes your input to create forms tailored to your needs.
              </p>
            </a>

            <a
              className="block rounded-xl border border-gray-300 p-8 shadow-xl transition hover:border-pink-500/10 hover:shadow-pink-500/10"
              href="#"
            >
                <Pencil className='h-5 w-5 text-pink-500'></Pencil>
              <h2 className="mt-4 text-xl font-bold text-gray-900">Edit and Preview</h2>
              <p className="mt-1 text-sm text-gray-700">
                Easily edit your forms and preview them in real-time to ensure they look exactly how you want. Intelliform's intuitive interface lets you make changes effortlessly, with instant visual feedback.
              </p>
            </a>

            <a
              className="block rounded-xl border border-gray-300 p-8 shadow-xl transition hover:border-pink-500/10 hover:shadow-pink-500/10"
              href="#"
            >
               <Palette className='h-5 w-5 text-pink-500'></Palette>
              <h2 className="mt-4 text-xl font-bold text-gray-900">Customizable Form Themes and Colors</h2>
              <p className="mt-1 text-sm text-gray-700">
                Customize your form's theme and colors to match your brand and make your forms stand out. With Intelliform, you have full control over the look and feel of your forms, ensuring a seamless integration with your website or application.
              </p>
            </a>

            <a
              className="block rounded-xl border border-gray-300 p-8 shadow-xl transition hover:border-pink-500/10 hover:shadow-pink-500/10"
              href="#"
            >
               <Share2 className='h-5 w-5 text-pink-500'></Share2>
              <h2 className="mt-4 text-xl font-bold text-gray-900">Share and Download User Responses</h2>
              <p className="mt-1 text-sm text-gray-700">
                Easily share your forms and download user responses for further analysis and record-keeping. Intelliform's comprehensive reporting tools allow you to gain insights from user feedback, helping you make data-driven decisions.
              </p>
            </a>
          </div>

          <div className="mt-12 text-center">
            <a
              href="/dashboard"
              className="inline-block rounded bg-pink-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-pink-700 focus:outline-none focus:ring focus:ring-yellow-400"
            >
              Get Started Today
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Features;
