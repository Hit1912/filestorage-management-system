import {
  Folder,
  FileText,
  FileIcon as FilePdf,
  FileArchive,
  FileImage,
  FileQuestion,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";
import { FileType } from "@/features/files/filesType";
import { IMAGE_EXTENSIONS } from "@/constant";

interface FileCardProps {
  file: FileType;
  isSelected: boolean;
  toggleFileSelection: (file: FileType) => void;
}

// Map file types to Lucide React icons
const fileTypeIcons: Record<string, any> = {
  PDF: FilePdf,
  DOCX: FileText,
  TXT: FileText,
  XLSX: FileText, // Using FileText for general documents, could be more specific
  PPTX: FileText,
  ZIP: FileArchive,
  RAR: FileArchive,
  TAR: FileArchive,
  JPG: FileImage,
  PNG: FileImage,
  GIF: FileImage,
  SVG: FileImage,
  // Add more as needed
  DEFAULT: FileQuestion, // Fallback for unknown types
};

const FileCard = ({ file, isSelected, toggleFileSelection }: FileCardProps) => {
  const isImageType = IMAGE_EXTENSIONS.includes(file.ext.toUpperCase());

  const IconComponent =
    fileTypeIcons[file.ext.toUpperCase()] || fileTypeIcons.DEFAULT;

  return (
    <Card
      className={`group relative !p-0 rounded-2xl border border-border/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-border/80 cursor-pointer overflow-hidden ${
        isSelected
          ? "bg-primary/5 dark:bg-primary/20 ring-2 ring-primary/60 dark:ring-primary/60 border-primary/30"
          : "hover:border-border/60"
      }`}
      onClick={() => toggleFileSelection(file)}
    >
      <div className="absolute top-3 left-3 z-10">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => toggleFileSelection(file)}
          className={cn(
            "backdrop-blur-sm cursor-pointer border dark:border-gray-300 shadow-sm size-6 bg-white",
            isSelected && "dark:border-inherit"
          )}
        />
      </div>

      {/* Image Container */}
      <div className="aspect-auto relative !overflow-hidden h-72">
        <div className="flex flex-col items-center h-full transition-transform duration-500 ease-out group-hover:scale-105 bg-muted/30">
          {isImageType && file.url ? (
            <img
              src={file.url || "/placeholder.svg"}
              alt={file.originalName}
              className="w-full h-full object-contain"
            />
          ) : isImageType && !file.url ? (
            <img
              src={"/placeholder.png"}
              alt={file.originalName}
              className="w-full h-full object-cover"
            />
          ) : (
            <IconComponent className="w-20 h-20 text-muted-foreground/60 mt-16 transition-colors duration-300 group-hover:text-primary/70" />
          )}
        </div>

        {/* File Info Overlay */}
        <div className="px-5 w-full pb-3 absolute inset-x-0 -bottom-0 z-[50] backdrop-blur-md bg-gradient-to-t from-black/80 dark:from-black/95 to-transparent text-white pt-10">
          <div className="pt-2">
            <h3 className="font-medium text-sm mb-1 truncate drop-shadow-sm">
              {file.originalName}
            </h3>
            <div className="flex items-center gap-1 text-gray-300 text-xs mb-1.5 opacity-80">
              <Folder className="w-3 h-3" />
              <span>/</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-3">
              <Badge
                variant="secondary"
                className="bg-white/20 hover:bg-white/30 backdrop-blur-md border-white/10 text-white text-[10px] !py-[2px] font-semibold tracking-wider"
              >
                {file.ext?.toUpperCase()}
              </Badge>
              <span className="text-gray-200 text-xs font-medium">
                {file.formattedSize}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FileCard;
