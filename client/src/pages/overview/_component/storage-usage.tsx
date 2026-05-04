
interface StorageUsageProps {
  usage: number; // in bytes
  quota: number;
  formattedUsage: string;
  formattedQuota: string;
}

const StorageUsage = ({
  usage,
  quota,
  formattedUsage,
  formattedQuota,
}: StorageUsageProps) => {
  const percentage = quota > 0 ? (usage / quota) * 100 : 0;

  return (
    <div className="pt-5 pb-2">
      <div className="flex flex-col gap-3 px-2 sm:px-6">
        <div className="flex justify-between items-end">
          <span className="font-semibold text-foreground text-sm tracking-tight">
            Storage Usage
          </span>
          <span className="font-medium text-muted-foreground text-[13px]">
            {formattedUsage} / {formattedQuota}
          </span>
        </div>
        <div className="relative h-3 w-full overflow-hidden rounded-full bg-secondary/60">
          <div
            className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-primary/80 to-primary transition-all duration-1000 ease-out"
            style={{ width: `${Math.min(Math.max(percentage, 2), 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default StorageUsage;
