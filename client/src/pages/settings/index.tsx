import PageLayout from "@/components/page-layout";
import Appearance from "./appearance";
import Account from "./account";

const Settings = () => {
  return (
    <PageLayout
      title="Settings"
      subtitle="Manage your account preferences and application settings"
    >
      <div className="max-w-4xl mx-auto space-y-10 pb-20">
        <div className="bg-card/30 backdrop-blur-sm border border-border/40 rounded-[2rem] p-8 sm:p-12 shadow-xl shadow-black/5 dark:shadow-white/5 space-y-12">
          <Appearance />
          <div className="h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />
          <Account />
        </div>
      </div>
    </PageLayout>
  );
};

export default Settings;

