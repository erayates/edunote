import { BadgePlus, Share2, Telescope } from "lucide-react";
import { CreateActivity } from "./create-activity";

const AppContainer: React.FC = () => {
  return (
    <div className="h-full min-h-full w-full flex flex-col items-center justify-center pt-36 space-y-10">
      <p className="text-white uppercase text-5xl font-bold text-center">
        Your AI-assisted <br /> social note application platform
      </p>

      <ul className="grid grid-cols-3 text-white/30 my-6 space-x-6">
        <li className="flex flex-col items-center text-center">
          <p className="flex items-center justify-start">
            <BadgePlus className="text-white mr-2" size={16} />
            <span className="text-white font-medium ">Create your note</span>
          </p>
          <p className="text-xs">
            Effortlessly create, edit, and save your notes with Gemini AI. Enjoy
            seamless management and flexible editing tools that allow you to
            quickly customize, reorganize, and refine your notes to stay on top
            of your tasks and ideas.
          </p>
        </li>

        <li className="flex flex-col items-center text-center">
          <p className="flex items-center">
            <Share2 className="text-white mr-2" size={16} />
            <span className="text-white font-medium ">Share your notes</span>
          </p>
          <p className="text-xs">
            Set notes as public or private. This way you can prevent others from
            seeing them or make them public. You can also share the link to your
            note and send it to your friends.
          </p>
        </li>

        <li className="flex flex-col items-center text-center">
          <p className="flex items-center">
            <Telescope className="text-white mr-2" size={16} />
            <span className="text-white font-medium ">
              Explore the Note World
            </span>
          </p>
          <p className="text-xs">
            Now is the time for discovery. You can explore shared notes and
            community groups and interact with them. Knowledge multiplies as you
            share it!
          </p>
        </li>
      </ul>

      <CreateActivity />
    </div>
  );
};

export default AppContainer;
