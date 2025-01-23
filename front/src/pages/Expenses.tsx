import ExpenseDialog from "@/components/dialogs/ExpenseDialog";
import Header from "@/components/Header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

const Expenses = () => {
  return (
    <div className="bg-[#edf3fb] dark:bg-[#212c40] w-screen h-screen relative">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">Despesas</span>
          <ExpenseDialog />
        </div>

        <div>
          <Card className="bg-white w-3/4">
            <CardContent className="p-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead className="w-[300px]">Observação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>INV001</TableCell>
                    <TableCell>Paid</TableCell>
                    <TableCell>Credit Card</TableCell>
                    <TableCell>$250.00</TableCell>
                    <TableCell>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis, odit!</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Expenses;
