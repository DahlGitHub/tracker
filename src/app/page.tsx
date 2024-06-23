import Link from "next/link";

import { Button } from "@/components/ui/button";
import { RedirectToSignIn, SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <RedirectToSignIn signInFallbackRedirectUrl={"/dashboard"} signUpFallbackRedirectUrl={"/dashboard"}  />
    </div>
  );
}
