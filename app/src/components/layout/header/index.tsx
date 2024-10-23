import { ModeToggle } from "../../theme-toggle";
import CustomUserButton from "./user-button";

const AppHeader: React.FC = () => {
  return (
    <header className="w-screen sticky top-0 left-0 h-[80px] bg-[#282b30] z-30">
      <div className="ml-[280px] flex space-x-4 justify-end items-center h-full">
        <ModeToggle />
        <CustomUserButton />
      </div>
    </header>
  );
};

export default AppHeader;
