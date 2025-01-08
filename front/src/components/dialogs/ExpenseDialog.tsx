import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const ExpenseDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="bg-white cursor-pointer hover:bg-gray-50 w-fit">
          <CardContent className="p-2">
            <div className="flex flex-row gap-2 items-center">
              <PlusCircle className="w-6 h-6 text-red-500" />
              <span className="text-sm text-gray-500">Nova Despesa</span>
            </div>
            <div className="text-xl font-bold text-gray-900"></div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-lg">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Despesa</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="">
              Valor
            </Label>
            <Input id="name" placeholder="Valor" className="col-span-3" type="text" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="">
              Data
            </Label>
            <Input id="name" placeholder="Valor" className="col-span-3" type="date" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="">
              Descrição
            </Label>
            <Input id="name" placeholder="Descrição" className="col-span-3" type="text" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="username" className="">
              Categoria
            </Label>
            <Select>
              <SelectTrigger className="">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectGroup className="cursor-pointer">
                  <SelectItem className="cursor-pointer" value="alimentacao">
                    Alimentação
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="assinatura">
                    Assinatura
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="supermercado">
                    Supermercado
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="saude">
                    Saúde
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="">
              Observação
            </Label>
            <Textarea className="max-h-24" placeholder="Observação (opcional)" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseDialog;
