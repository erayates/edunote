import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Tag  from "@/components/ui/tag";
import Image from "next/image";
import { formatDistance } from "date-fns";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
      <div 
        className="bg-foreground h-[485px] overflow-hidden max-h-[485px] w-full relative rounded-2xl transition-shadow duration-300 shadow-3xl hover:shadow-4xl transition-all duration-300"
      >
        <div className="h-[165px] max-h-[165px] relative overflow-hidden w-full rounded-t shadow-card">
          <Image
              src={thumbnailUrl ?? "/assets/images/default-note-thumbnail.jpg"}
              alt={description}
            width={0}
            height={0}
              sizes="100vw"
            className="w-full h-auto object-cover object-center rounded-2xl"
            />

          <div className="absolute h-[165px] max-h-[165px] w-full inset-0 top-0 left-0 shadow-card"></div>
        </div>

        <div className="h-fit pt-2 px-4 w-full">
            <p className=" text-white/30 text-[12px] mt-1 font-medium">
              {formatDistance(new Date(updatedAt), new Date())} ago
            </p>
          </div>

        <div className="flex flex-col">
          <h3 className="px-4 py-1 text-white text-lg leading-6 font-semibold">
            {title/* {title.length > 25 ? title.slice(0, 20) + "..." : title} */}
          </h3>

          <p className="px-4 py-1 text-white/30 text-xs">
            {description.length > 355 ? description.slice(0, 355) + "..." : description}
          </p>

          <div className="">
            <div className="px-4 pb-1 flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <Tag tag={tag}/>
              ))}
            </div>
          </div>

          <div className="h-[24px] flex items-center absolute p-4 bottom-0 left-0 w-full justify-ends">
            <div className="flex m-[6px] p-[2px] rounded-2xl pb-2 pr-2 items-center absolute bottom-0 left-0 w-fit justify-ends">
              <Avatar className="mx-2 w-[24px] h-[24px]">
                <AvatarImage src={avatarUrl} alt="@shadcn"/>
                <AvatarFallback className="bg-white">U</AvatarFallback>
              </Avatar>
              <p className=" text-white/70 text-[14px] mt-1 font-medium">
                {author}
              </p>
            </div>
          </div>

        </div>
      </div>
    </Link>
  );
};

export default NoteCard;
