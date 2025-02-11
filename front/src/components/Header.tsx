import { ModeToggle } from "./mode-toggle";
import { useNavigate } from "react-router";

const Header = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="w-full bg-slate-700 dark:bg-slate-900 text-white text-3xl py-4 px-8 font-bold flex justify-between items-center shadow-md">
        <span className="cursor-pointer" onClick={() => navigate("/")}>
          Finances.io
        </span>

        {/* <div className="flex gap-4 text-base font-semibold w-1/3 justify-between">
          <span>Visão geral</span>
          <span>Relatório</span>
          <span>Lançamentos</span>
          <span>Metas</span>
        </div> */}

        <div className="flex items-center gap-4">
          {/* <Button size="icon" variant="ghost">
            <Bell />
          </Button>
          <Button size="icon" variant="ghost">
            <Settings />
          </Button> */}
          <ModeToggle />
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">V</div>
        </div>
      </div>
    </>
  );
};

export default Header;
