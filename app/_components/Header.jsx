"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SignInButton, useUser } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Header() {
  const { user, isSignedIn } = useUser();
  const path = usePathname();
  useEffect(() => {}, []);
  return (
    !path.includes("aiform") && !path.includes("About") && !path.includes("Features")&&(
      <div className="p-3.5 border-b shadow-sm">
        <div className="flex items-centre justify-between">
          <div className="flex gap-3 items-center">
            <Image src={"/freepik.svg"} width={50} height={30} alt="logo" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
              INTELLIFORM
            </h2>
          </div>
          {isSignedIn ? (
            <div className="flex items-center gap-5">
              <Link href={"/About"}>
                <Button variant="outline">About</Button>
              </Link>
              <Link href={"/Features"}>
                <Button variant="outline">Features</Button>
              </Link>

              <Link href={"/dashboard"}>
                <Button variant="outline">DashBoard</Button>
              </Link>
              <UserButton></UserButton>
            </div>
          ) : (
            <SignInButton>
              <Button>Get Started</Button>
            </SignInButton>
          )}
        </div>
      </div>
    )
  );
}

export default Header;
