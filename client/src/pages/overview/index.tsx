import PageLayout from "@/components/page-layout";
import { OverviewChart } from "./_component/overview-chart";
import RecentUploads from "./_component/recent-uploads";

const Overview = () => {
  return (
    <PageLayout
      title="🎉 Welcome to DHR Nest"
      subtitle="The ultimate home for your digital assets. Manage your files with ease and security."
    >
      <div className="w-full flex flex-col gap-y-8 py-2">
        <OverviewChart />
        <RecentUploads />
      </div>
    </PageLayout>
  );
};

export default Overview;
