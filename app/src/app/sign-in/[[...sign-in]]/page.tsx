import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function SignInPage() {
  return (
    <div className="grid grid-cols-5 h-screen bg-slate-100">
      <div className="bg-authBg bg-center bg-cover backdrop-blur-2xl col-span-3 relative h-full flex flex-col items-center justify-center custom-clip-path overflow-hidden">
        <div className="absolute shadow-2xl bg-authBgLinear w-full flex flex-col items-center justify-center h-full inset-0 top-0 left-0">
          <div className="max-w-[500px] max-h-[100px] relative">
            <Image
              src="/assets/images/edunote-logo-light.png"
              alt="Edunote Logo"
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-auto"
            />
          </div>
          <p className="font-extrabold uppercase text-[96px] w-screen leading-[0.75] absolute left-0  bottom-0 text-white">
            Social Education <br /> & Note Platform
          </p>
        </div>
      </div>
      <div className="flex col-span-2 items-center justify-center h-full">
        <SignIn />
      </div>
    </div>
  );
}
