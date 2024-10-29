import { BadgeAlert } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-[75vh] w-full grid place-items-center">
      <div className="bg-foreground border-2 border-secondary rounded-lg flex flex-col h-auto p-4 w-fit items-center justify-center">
        <BadgeAlert className="text-white" size={120} />
        <h2 className="text-white text-2xl font-semibold">
          Something went wrong!
        </h2>
        <p className="text-white/30 textl font-medium">
          Could not find requested resource.
        </p>
        <Link
          href="/"
          className="hover:bg-secondary duration-500 transition-all text-sm w-full text-right font-semibold border border-secondary px-4 py-2 text-white rounded-lg mt-2"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
