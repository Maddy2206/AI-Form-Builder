import { SignUp } from "@clerk/nextjs";
import Image from "next/image";

export default function Page() {
  return (
    <div className="relative min-h-screen flex items-center justify-end">
      {/* Full-screen background image */}
      <Image
        src="/sign-in-page.png"
        alt="IntelliForm background"
        fill
        className="object-cover"
        priority
      />

      {/* Subtle dark overlay so the form stays readable */}
      <div className="absolute" />

      {/* Sign-in box — right side */}
      <div className="relative z-10 w-full max-w-md px-4 mr-0 lg:mr-20 xl:mr-24">
        <SignUp path="/sign-up" />
      </div>
    </div>
  );
}
