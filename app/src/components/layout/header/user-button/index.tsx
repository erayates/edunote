"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser, UserButton } from "@clerk/nextjs";

const CustomUserButton: React.FC = () => {
  const { user } = useUser();
  if (user) {
    return (
      <div className="flex space-x-4 cursor-pointer">
        <div className="flex flex-col text-right">
          <p className="text-white text-xs">{user.fullName}</p>
          <p className="text-slate-400 text-xs font-medium">
            {user.emailAddresses[user.emailAddresses.length - 1].emailAddress}
          </p>
        </div>

        {/* <Avatar>
          <AvatarImage src={user.imageUrl} alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar> */}
        <UserButton />
      </div>
    );
  }
};

export default CustomUserButton;
