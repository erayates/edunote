import TailwindAdvancedEditor from "@/components/editor/editor";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="ml-[280px]">
      <Suspense fallback={<p>Loading....</p>}>
        <TailwindAdvancedEditor />
      </Suspense>
    </div>
  );
}
