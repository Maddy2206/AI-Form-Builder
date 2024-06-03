import React from "react";
import Footer from "./Footer";

function Body() {
  return (
    <div className="">
      <div className="min-h-screen">
        <section className="py-20">
          <div className="max-w-screen-xl lg:flex lg:h-screen">
            <div className="text-center w-full lg:w-3/4 mx-auto">
              <h1 className="text-3xl font-extrabold sm:text-5xl mb-2">
                Build Smarter
              </h1>
              <h1 className="text-3xl font-extrabold sm:text-5xl mb-2">
                Not Harder
              </h1>
              <h1 className="text-3xl font-extrabold sm:text-5xl">
                <strong className="font-extrabold sm:block sm:mt-0 mt-2 text-yellow-500">
                  AI-Driven Form Creation at Your Fingertips!
                </strong>
              </h1>
              <p className="mt-4 sm:text-xl/relaxed mb-3">
                Effortlessly Design, Customize, and Optimize Forms in Minutes
                with Our AI-Powered Builder
              </p>
              <div className="mb-8 py-4">
               
              </div>
              <Footer className="mb-20" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Body;
