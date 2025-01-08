"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import Tag from "@/components/ui/tag";
import Image from "next/image";
import { formatDistance } from "date-fns";
import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Heart } from "lucide-react";
// import { toast } from "sonner";
// import { toggleNoteFavorite } from "@/actions/user-notes";
// import { useUser } from "@clerk/nextjs";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
import { Group, GroupWithRelations } from "@/types/group";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface GroupCardProps {
  description: string;
  name: string;
  imageUrl: string;
  avatar: string;
  slug: string;
  visibility: "PUBLIC" | "PRIVATE";
  //   groupId: string;
}

const GroupCard: React.FC<GroupCardProps> = ({
  description,
  name,
  imageUrl,
  //   groupId,
  visibility,
  avatar,
  slug,
}) => {
  //   const { user } = useUser();

  //   const { refresh } = useRouter();,
  console.log(avatar);

  return (
    <Link href={`/groups/${slug}`}>
      <div
        className="bg-foreground h-[485px] overflow-hidden max-h-[485px] w-full relative rounded-2xl 
       shadow-3xl hover:shadow-4xl transition-all duration-300"
      >
        <div className="h-[165px] max-h-[165px] relative overflow-hidden w-full rounded-t shadow-card">
          <Image
            src={imageUrl ?? "/assets/images/default-note-thumbnail.jpg"}
            alt={name + "Group Thumbnail"}
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-auto object-cover object-center rounded-2xl"
          />

          <div className="absolute h-[165px] max-h-[165px] w-full inset-0 top-0 left-0 shadow-card"></div>
        </div>

        <div className="w-full ">
          <div className="flex mx-6 -mt-12 relative w-28 h-28 rounded-2xl pb-2 pr-2">
            <Image
              src={avatar}
              width={128}
              height={128}
              sizes="100vw"
              alt={name}
              className="rounded-full object-cover"
            />
          </div>
        </div>

        {/* <div className="h-fit pt-2 px-4 w-full">
          <p className=" text-white/30 text-[12px] mt-1 font-medium">
            {formatDistance(new Date(updatedAt), new Date())} ago
          </p>
        </div> */}

        <div className="flex flex-col">
          <h3 className="px-4 py-1 text-white text-3xl leading-6 font-semibold">
            {
              name /* {title.length > 25 ? title.slice(0, 20) + "..." : title} */
            }
          </h3>

          <p className="px-4 py-1 text-white/30 text-sm">
            {description.length > 355
              ? description.slice(0, 355) + "..."
              : description}
          </p>
        </div>

        <div className="w-full flex flex-col justify-end absolute bottom-0 left-0 px-4 py-2">
          <div className="flex justify-end items-center space-x-2 mb-3">
            <div className="flex -space-x-3 *:ring *:ring-background">
              <Avatar>
                <AvatarImage src="/avatars/avatar-04.jpg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage src="/avatars/avatar-05.jpg" />,
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage src="/avatars/avatar-06.jpg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>

            <span className="text-sm text-white/30">+99 people</span>
          </div>

          <Button className="w-full bg-sky-600 text-white/80 hover:bg-sky-700">
            <PlusCircle size={24} color="white" />
            {visibility === "PUBLIC" ? "Join Group" : "Request to Join Group"}
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default GroupCard;
