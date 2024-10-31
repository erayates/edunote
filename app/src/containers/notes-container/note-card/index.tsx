import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";

import { formatDistance } from "date-fns";
import Link from "next/link";

interface NoteCardProps {
  description: string;
  title: string;
  thumbnailUrl: string;
  avatarUrl: string;
  author: string;
  updatedAt: Date;
  slug: string;
  tags: string[];
}

const NoteCard: React.FC<NoteCardProps> = ({
  description,
  title,
  thumbnailUrl,
  avatarUrl,
  author,
  updatedAt,
  slug,
  tags,
}) => {
  return (
    <Link href={`/notes/${slug}`}>
      <div className="bg-foreground h-[300px] max-h-[300px] overflow-hidden w-full relative border border-primary rounded-lg">
        <div className="h-[120px] max-h-[120px] relative overflow-hidden w-full rounded-t shadow-card">
          <Image
            src={thumbnailUrl ?? "/assets/images/default-note-thumbnail.jpg"}
            alt={description}
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-auto object-cover object-center"
          />

          <div className="right-2 absolute top-2 z-20 flex">
            <span className="bg-blue-600 text-white font-medium text-[10px] h-fit p-1 pr-8 -mr-6 rounded-l-xl pl-3">
              {author}
            </span>
            <Avatar className="border-2 border-blue-600 ">
              <AvatarImage src={avatarUrl} alt="@shadcn" />
              <AvatarFallback className="bg-white">E</AvatarFallback>
            </Avatar>
          </div>

          <div className="absolute h-[120px] max-h-[120px] w-full inset-0 top-0 left-0 shadow-card"></div>
        </div>

        <div className="flex flex-col p-2">
          <h3 className="text-white text-lg leading-6 font-semibold">
            {title.length > 25 ? title.slice(0, 20) + "..." : title}
          </h3>

          <p className="text-white/30 text-xs">
            {description.length > 75
              ? description.slice(0, 75) + "..."
              : description}
          </p>

          <div className="">
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className=" text-[8px] font-semibold bg-green-300 text-primary px-2 py-1 rounded-full"
                >
                  {tag.length > 8 ? tag.slice(0, 8) + "..." : tag}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-background h-[64px] rounded-full mt-4 absolute -bottom-10 left-0 text-center w-full">
            <p className=" text-white/30 text-[12px] mt-1 font-medium">
              {formatDistance(new Date(updatedAt), new Date())} ago
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NoteCard;
