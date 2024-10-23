import { Input } from "@/components/ui/input";
import Image from "next/image";
import { ModeToggle } from "../theme-toggle";
import { Bell, MessageCircle } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { Button } from "../ui/button";

const AppBottomBar: React.FC = () => {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 bottom-8 flex rounded-3xl space-x-4">
      <div className="p-2 w-[540px] rounded-3xl bg-foreground relative grid place-items-center pl-8">
        <div className="w-[72px] h-[72px] rounded-full absolute -left-10 -top-2 grid place-items-center bg-foreground border-4 border-background ">
          <Image
            src="/assets/images/magic-wand.png"
            width={28}
            height={28}
            sizes="100vw"
            alt=""
          />
        </div>
        <Input
          className="border-none text-sm placeholder:text-secondary placeholder:font-medium text-white bg-transparent focus-visible:ring-0"
          placeholder={`Press "TAB" to chat with Gemini AI about your note...`}
        />
      </div>
      <div className="py-2 px-4 rounded-3xl bg-foreground flex space-x-1 overflow-hidden">
        <ModeToggle />

        <Button
          variant="outline"
          className="w-10 h-10 text-xs text-secondary rounded-full bg-foreground border-none px-2 hover:text-white duration-300 transition-all "
        >
          <Bell size={24} />
        </Button>

        <Button
          variant="outline"
          className="w-10 h-10 text-xs text-secondary rounded-full bg-foreground border-none px-2 hover:text-white duration-300 transition-all "
        >
          <MessageCircle size={24} />
        </Button>

        <UserButton />
      </div>
    </div>
  );
};

export default AppBottomBar;
