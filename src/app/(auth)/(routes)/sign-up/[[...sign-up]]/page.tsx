import { BackgroundBeams } from "@/components/ui/background-beams";
import { SignUp } from "@clerk/nextjs";

import { Activity } from "lucide-react";

export default function Page() {
  return (
    <section className="bg-zinc-900">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt=""
            src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=2070"
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />

          <div className="hidden lg:relative lg:block lg:p-12">
            <a className="block text-white" href="#">
              <span className="sr-only">Home</span>
              <Activity />
            </a>

            <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
              Tracker
            </h2>

            <p className="mt-4 leading-relaxed text-white/90">
              Adrian is doing something...
            </p>
          </div>
        </section>

        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6 relative">
          <div className="max-w-xl lg:max-w-3xl">
            <div className="relative -mt-16 block lg:hidden">
              <a
                className="inline-flex size-16 items-center justify-center rounded-full bg-zinc-950 text-white"
                href="#"
              >
                <span className="sr-only">Home</span>
                <Activity />
              </a>

              <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl dark:text-white">
                Tracker
              </h1>

              <p className="mt-4 leading-relaxed text-gray-500 dark:text-gray-400">
                Adrian is doing something...
              </p>
            </div>
            <div className="flex justify-center p-4">
              <SignUp forceRedirectUrl={"/dashboard"} />
              <BackgroundBeams />
            </div>
          </div>
        </main>
      </div>
    </section>
  );
}
