import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";

interface NoteCardProps {
  description: string;
  title: string;
  thumbnailUrl: string;
  avatarUrl: string;
  author: string;
}

const NoteCard: React.FC<NoteCardProps> = ({
  description,
  title,
  thumbnailUrl,
  avatarUrl,
  author,
}) => {
  return (
    <div className="bg-foreground h-[300px] max-h-[300px] overflow-hidden w-full relative border border-secondary rounded-lg">
      <div className="h-[120px] max-h-[120px] relative overflow-hidden w-full rounded-t shadow-card">
        <Image
          src={thumbnailUrl}
          alt="asd"
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
            <AvatarFallback>E</AvatarFallback>
          </Avatar>
        </div>

        <div className="absolute h-[120px] max-h-[120px] w-full inset-0 top-0 left-0 shadow-card"></div>
      </div>

      <div className="flex flex-col p-2">
        <h3 className="text-white text-lg leading-6 font-semibold">
          {title.slice(0, title.length > 40 ? 40 : title.length)}
          {title.length > 40 && "..."}
        </h3>

        <p className="text-white/30 text-xs">
          {description.slice(0, description.length > 260 ? 260 : title.length)}
          {description.length > 260 && "..."}
        </p>

        <div className="bg-background h-[64px] rounded-full mt-4 absolute w-full -bottom-10 -right-28">
          <p className="ml-8 text-white/30 text-[12px] mt-1 font-medium">
            24 March 2024
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
