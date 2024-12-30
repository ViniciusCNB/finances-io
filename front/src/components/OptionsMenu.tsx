import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const OptionsMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <Menu />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-slate-700 dark:bg-slate-900 text-white rounded-[4px]">
        <DropdownMenuItem className="cursor-pointer" onClick={() => {}}>
          + despesa
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => {}}>
          + receita
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => {}}>
          + investimento
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default OptionsMenu;
