import SignInForm from "./_component/signin-form";
import Logo from "@/components/logo/logo";
import { Cloud, Zap, Lock } from "lucide-react";

const SignIn = () => {
  return (
    <div className="flex w-full min-h-svh bg-background">
      {/* Left side - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between bg-zinc-950 p-12 text-zinc-50 relative overflow-hidden dark:bg-zinc-950/50 dark:border-r">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-zinc-950 to-zinc-950 dark:to-background z-0" />
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/20 blur-3xl mix-blend-screen z-0" />

        <div className="relative z-10 flex items-center gap-2">
          <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 p-2 rounded-xl shadow-lg">
            <Logo url="/" />
          </div>
        </div>

        <div className="relative z-10 space-y-6 mt-12 animate-in fade-in slide-in-from-left-8 duration-700">
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl text-white">
            Welcome back to <br/> DHR Nest
          </h1>
          <p className="text-lg text-zinc-400 max-w-md">
            Access your files from anywhere, securely and instantly. We're glad to see you back.
          </p>

          <div className="space-y-5 pt-8 text-zinc-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-zinc-900/50 rounded-xl border border-zinc-800 backdrop-blur-sm shadow-inner">
                <Cloud className="w-6 h-6 text-primary" />
              </div>
              <span className="text-base font-medium">Access your cloud storage</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-zinc-900/50 rounded-xl border border-zinc-800 backdrop-blur-sm shadow-inner">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <span className="text-base font-medium">Lightning fast syncing</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-zinc-900/50 rounded-xl border border-zinc-800 backdrop-blur-sm shadow-inner">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <span className="text-base font-medium">End-to-end encryption</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-auto text-sm text-zinc-600 font-medium">
          © {new Date().getFullYear()} DHR Nest Inc. All rights reserved.
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex w-full lg:w-1/2 flex-col justify-center items-center p-6 md:p-12 relative bg-[var(--bg-color)] dark:bg-background">
        <div className="lg:hidden absolute top-6 left-6 md:top-8 md:left-8">
          <Logo url="/" />
        </div>
        
        <div className="w-full max-w-sm xl:max-w-md animate-in slide-in-from-bottom-4 fade-in duration-500">
          <SignInForm />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
