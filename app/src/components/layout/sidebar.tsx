import { cn } from "@/lib/utils";
import { Earth, NotepadText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const AppSidebar: React.FC = () => {
  return (
    <aside
      className={cn(
        "w-[280px] fixed left-0 top-0 bg-foreground h-screen p-8 z-50 bg-[#1e2124]"
      )}
    >
      <div className="">
        <Image
          src="/assets/images/edunote-logo-light.png"
          alt="Edunote Logo"
          width={280}
          height={50}
        />

        <div className="w-full h-[1px] border border-[#36393E] my-6"></div>

        <ul className="">
          <p className="flex items-center text-sm font-semibold text-[#424549] mb-3">
            <NotepadText size={16} className="mr-2" />
            NOTES
          </p>
          <li className="flex items-center text-sm text-white border-l-2 border-[#424549] pl-6 py-1 after:absolute after:left-0 after:top-1/2 after:-translate-y-1/2 after:bg-[#424549] after:w-5 after:h-[2px] relative">
            <NotepadText size={16} className="mr-2" /> Test Note Page
          </li>
          <li className="flex items-center text-sm text-white border-l-2 border-[#424549] pl-6 py-1 after:absolute after:left-0 after:top-1/2 after:-translate-y-1/2 after:bg-[#424549] after:w-5 after:h-[2px] relative">
            <NotepadText size={16} className="mr-2" /> Test Note Page
          </li>
          <li className="flex items-center text-sm text-white border-l-2 border-[#424549] pl-6 py-1 after:absolute after:left-0 after:top-1/2 after:-translate-y-1/2 after:bg-[#424549] after:w-5 after:h-[2px] relative">
            <NotepadText size={16} className="mr-2" /> Test Note Page
          </li>
        </ul>

        <ul className="mt-8">
          <p className="text-sm font-semibold text-[#424549] mb-3 flex items-center">
            <Earth size={16} className="mr-2" />
            DISCOVER
          </p>
          
          <li className="flex items-center text-white border-2 rounded-xl group hover:bg-[#424549] transition-all duration-300 border-[#424549]">
            <Link
              href="#"
              className="flex space-x-2 items-center w-full pt-1 pb-[6px] px-4"
            >
              <span className="w-10 h-10">
                <Earth size={40} />
              </span>
              <p className="leading-none">
                <span className="text-white text-sm font-semibold leading-6">
                  Notes
                </span>
                <span className="text-[#424549] group-hover:text-white  font-semibold leading-none text-xs inline-block">
                  Discover any notes from world.
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
                <Earth size={40} />
              </span>
              <p className="leading-none">
                <span className="text-white text-sm font-semibold leading-6">
                  Notes
                </span>
                <span className="text-[#424549] group-hover:text-white  font-semibold leading-none text-xs inline-block">
                  Discover any notes from world.
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
                <Earth size={40} />
              </span>
              <p className="leading-none">
                <span className="text-white text-sm font-semibold leading-6">
                  Notes
                </span>
                <span className="text-[#424549] group-hover:text-white  font-semibold leading-none text-xs inline-block">
                  Discover any notes from world.
                </span>
              </p>
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default AppSidebar;
