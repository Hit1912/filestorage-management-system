import SignUpForm from "./_component/signup-form";
import Logo from "@/components/logo/logo";
import { FolderUp, HardDriveUpload, ShieldCheck } from "lucide-react";

const SignUp = () => {
  return (
    <div className="flex w-full min-h-svh bg-background">
      {/* Left side - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between bg-primary p-12 text-primary-foreground relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white blur-3xl mix-blend-overlay" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-white blur-3xl mix-blend-overlay" />
        </div>

        <div className="relative z-10 flex items-center gap-2">
          <div className="bg-background text-foreground p-2 rounded-xl shadow-lg">
            <Logo url="/" />
          </div>
        </div>

        <div className="relative z-10 space-y-6 mt-12 animate-in fade-in slide-in-from-left-8 duration-700">
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
            Secure File Storage <br/> for Modern Teams
          </h1>
          <p className="text-lg text-primary-foreground/90 max-w-md">
            Join DHR Nest to seamlessly store, share, and manage your files with industry-leading security and lightning-fast speeds.
          </p>

          <div className="space-y-5 pt-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-foreground/10 rounded-xl shadow-inner border border-primary-foreground/20 backdrop-blur-sm">
                <HardDriveUpload className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-base font-medium">Lightning Fast Uploads</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-foreground/10 rounded-xl shadow-inner border border-primary-foreground/20 backdrop-blur-sm">
                <FolderUp className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-base font-medium">Organized File Management</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-foreground/10 rounded-xl shadow-inner border border-primary-foreground/20 backdrop-blur-sm">
                <ShieldCheck className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-base font-medium">Bank-grade Security Encryption</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-auto text-sm text-primary-foreground/70 font-medium">
          © {new Date().getFullYear()} DHR Nest Inc. All rights reserved.
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex w-full lg:w-1/2 flex-col justify-center items-center p-6 md:p-12 relative bg-[var(--bg-color)] dark:bg-background">
        <div className="lg:hidden absolute top-6 left-6 md:top-8 md:left-8">
          <Logo url="/" />
        </div>
        
        <div className="w-full max-w-sm xl:max-w-md animate-in slide-in-from-bottom-4 fade-in duration-500">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
