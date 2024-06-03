import React from 'react'

function About() {
  return (
    <div>

<section class="overflow-hidden bg-gray-50 sm:grid sm:grid-cols-2">
  <div class="p-8 md:p-12 lg:px-16 lg:py-24">
    <div class="mx-auto max-w-xl text-center ltr:sm:text-left rtl:sm:text-right">
      <h2 class="text-2xl font-bold text-gray-900 md:text-3xl">
      ABOUT INTELLIFORM
      </h2>

      <p class="hidden text-gray-500 md:mt-4 md:block">
      Discover the future of form building with our AI-powered solution. At Intelliform , we're revolutionizing the way you create and manage forms. Our innovative platform harnesses the power of artificial intelligence to streamline the entire process, from form creation to data management. Say goodbye to tedious manual work and hello to effortless form building. With Intelliform, you can create fully customized forms in seconds, saving you time and effort. Our intuitive interface and advanced features make it easy for anyone to design professional-looking forms with ease. Whether you're a business owner, marketer, educator, or individual, Intelliform empowers you to unleash your creativity and achieve your goals faster than ever before. Join the AI form-building revolution today and experience the future of digital transformation.
      </p>

      <div class="mt-4 md:mt-8">
        <a
          href="/dashboard"
          class="inline-block rounded bg-emerald-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 focus:outline-none focus:ring focus:ring-yellow-400"
        >
          Get Started Today
        </a>
      </div>
    </div>
  </div>

  <img
    alt=""
    src="/freepik.svg"
    class="h-56 w-full object-cover sm:h-full"
  />
</section>
    </div>
  )
}

export default About