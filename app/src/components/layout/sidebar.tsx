import { cn } from "@/lib/utils";
import {
  Boxes,
  Earth,
  LogOut,
  MessagesSquare,
  Notebook,
  NotepadText,
  Settings2,
  ShieldQuestion,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { MoreNote } from "./more-note";
import { getAllUserNotes } from "@/actions/notes";
import { currentUser } from "@clerk/nextjs/server";
import { Note } from "@prisma/client";

const AppSidebar: React.FC = async () => {
  const user = await currentUser();

  const _notes: Note[] | false = await getAllUserNotes(user?.id as string);

  if (!_notes) {
    return;
  }

  return (
    <aside
      className={cn(
        "w-[280px] fixed left-0 flex flex-col justify-between top-0 bg-foreground h-screen p-8 z-50 "
      )}
    >
      <div className="">
        <Link href={"/"}>
          <Image
            src="/assets/images/edunote-logo-light.png"
            alt="Edunote Logo"
            width={280}
            height={50}
          />
        </Link>

        <div className="w-full h-[1px] border border-secondary my-6"></div>

        <ul>
          <p className="flex items-center text-white/30 text-sm font-semibold mb-3">
            <NotepadText size={16} className="mr-2" />
            NOTES
          </p>

          {_notes
            .slice(0, _notes.length > 3 ? 3 : _notes.length)
            .map((_note) => (
              <li
                key={String(_note.id)}
                className="flex items-center text-sm text-white/30 hover:text-white border-l-2 border-primary pl-6 py-1 after:absolute after:left-0 after:top-1/2 after:-translate-y-1/2 after:bg-[#424549] after:w-5 after:h-[2px] relative"
              >
                <Link
                  href={`/notes/${_note.slug}`}
                  className="flex items-center"
                >
                  <NotepadText size={16} className="mr-2" />{" "}
                  {_note.title.slice(
                    0,
                    _note.title.length > 16 ? 16 : _note.title.length
                  )}
                  ...
                </Link>
              </li>
            ))}

          {_notes.length > 3 && <MoreNote notes={_notes}/>}
        </ul>

        <ul className="mt-8">
          <p className="flex items-center text-sm font-semibold text-white/30 mb-3">
            <Earth size={16} className="mr-2" />
            EXPLORE
          </p>

          <li className="flex items-center text-white border-2 rounded-xl group hover:bg-[#424549] transition-all duration-300 border-[#424549]">
            <Link
              href="/notes"
              className="flex space-x-2 items-center w-full pt-1 pb-[6px] px-4"
            >
              <span className="w-10 h-10">
                <Notebook size={40} />
              </span>
              <p className="leading-none">
                <span className="text-white text-sm font-medium leading-6">
                  Notes
                </span>
                <span className="text-white/30 group-hover:text-white leading-none text-xs inline-block">
                  Explore any notes from world.
                </span>
              </p>
            </Link>
          </li>
          <li className="flex items-center text-white border-2 rounded-xl group hover:bg-[#424549] transition-all duration-300 border-[#424549] mt-3">
            <Link
              href="#"
              className="flex space-x-2 items-center w-full pt-1 pb-[6px] px-4"
            >
              <span className="w-10 h-10">
                <Boxes size={40} />
              </span>
              <p className="leading-none">
                <span className="text-white text-sm font-medium leading-6">
                  Groups
                </span>
                <span className="text-white/30 group-hover:text-white leading-none text-xs inline-block">
                  Explore any groups from world.
                </span>
              </p>
            </Link>
          </li>

          <li className="flex items-center text-white border-2 rounded-xl group hover:bg-[#424549] transition-all duration-300 border-[#424549] mt-3">
            <Link
              href="#"
              className="flex space-x-2 items-center w-full pt-1 pb-[6px] px-4"
            >
              <span className="w-10 h-10">
                <ShieldQuestion size={40} />
              </span>
              <p className="leading-none">
                <span className="text-white text-sm font-medium leading-6">
                  Quizes
                </span>
                <span className="text-white/30 group-hover:text-white leading-none text-xs inline-block">
                  Explore any quiz from world.
                </span>
              </p>
            </Link>
          </li>
        </ul>

        <ul className="mt-8 space-y-3">
          <p className="text-sm font-semibold text-white/30 mb-3 flex items-center">
            <Earth size={16} className="mr-2" />
            APP
          </p>

          <li className="">
            <Button
              asChild={true}
              className="text-white/30 w-full"
              variant="outline"
            >
              <Link href="#">
                <MessagesSquare /> Messages
              </Link>
            </Button>
          </li>

          <li className="">
            <Button
              asChild={true}
              className="text-white/30 w-full"
              variant="outline"
            >
              <Link href="#">
                <Settings2 /> Settings
              </Link>
            </Button>
          </li>
        </ul>
      </div>

      <Button variant="destructive">
        <LogOut /> Logout
      </Button>
    </aside>
  );
};

export default AppSidebar;
