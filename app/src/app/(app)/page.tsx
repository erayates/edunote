import TailwindAdvancedEditor from "@/components/editor/editor";
import AppContainer from "@/containers/app-container";
import { Suspense } from "react";

export default function Home() {
  return <AppContainer />;
}

{
  /* <Suspense fallback={<p>Loading....</p>}>
        <TailwindAdvancedEditor />
      </Suspense> */
}
