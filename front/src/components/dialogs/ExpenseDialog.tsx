import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
// import axios from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const formSchema = z.object({
  valor: z.string(),
  data: z.string(),
  descricao: z.string().min(5, {
    message: "Descrição deve ter no minimo 5 caracteres.",
  }),
  categoria: z.string(),
  observacao: z.string().min(5, {
    message: "Descrição deve ter no minimo 5 caracteres.",
  }),
});

const ExpenseDialog = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      valor: "",
      data: "",
      descricao: "",
      categoria: "",
      observacao: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  // const onSubmit = async (data: unknown) => {
  //   try {
  //     await axios
  //       .post("http://127.0.0.1:8000/categoria/", data)
  //       .then((response) => response.data)
  //       .then((data) =>
  //         alert(`Despesa ${data.descricao} adicionada com sucesso.`)
  //       )
  //       .then(() => window.location.reload())
  //   } catch (error) {
  //     throw new Error(`Erro no back-end!\n${error}`)
  //   } finally {
  //     // reset()
  //   }
  // }

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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="valor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <Input placeholder="Valor" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data</FormLabel>
                  <FormControl>
                    <Input placeholder="Data" type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input placeholder="Descrição" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Categoria" />
                      </SelectTrigger>
                    </FormControl>
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="observacao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observação</FormLabel>
                  <FormControl>
                    <Textarea className="max-h-24" placeholder="Observação (opcional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit">Salvar</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseDialog;
