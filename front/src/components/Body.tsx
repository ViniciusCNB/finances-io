import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpCircle, ArrowDownCircle, Wallet, PiggyBank, Target, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";

const Body = () => {
  const navigate = useNavigate();
  const data = {
    saldo: 4500.0,
    receitas: 6000.0,
    despesas: 3500.0,
    investimentos: 2000.0,
    proximasContas: [
      { nome: "Netflix", valor: 39.9, vencimento: "05/01" },
      { nome: "Academia", valor: 89.9, vencimento: "10/01" },
      { nome: "Internet", valor: 99.9, vencimento: "15/01" },
    ],
    metas: {
      atual: 2500,
      objetivo: 10000,
      nome: "Reserva de emergência",
    },
  };
  return (
    <>
      <main className="max-w-7xl mx-auto px-4 py-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Olá, Vinícius! 👋</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Saldo */}
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-blue-500 text-white">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <Wallet className="w-8 h-8" />
                <span className="text-sm opacity-80">Saldo disponível</span>
              </div>
              <div className="text-2xl font-bold">
                R$ {data.saldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>

          {/* Receitas */}
          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex gap-4 items-center mb-4">
                <ArrowUpCircle className="w-6 h-6 text-green-500" />
                <span className="text-sm text-gray-500">Receitas</span>
              </div>
              <div className="text-xl font-bold text-gray-900">
                R$ {data.receitas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>

          {/* Despesas */}
          <Card className="bg-white cursor-pointer" onClick={() => navigate("/despesas")}>
            <CardContent className="p-6">
              <div className="flex gap-4 items-center mb-4">
                <ArrowDownCircle className="w-6 h-6 text-red-500" />
                <span className="text-sm text-gray-500">Despesas</span>
              </div>
              <div className="text-xl font-bold text-gray-900">
                R$ {data.despesas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>

          {/* Investimentos */}
          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex gap-4 items-center mb-4">
                <PiggyBank className="w-6 h-6 text-purple-500" />
                <span className="text-sm text-gray-500">Investimentos</span>
              </div>
              <div className="text-xl font-bold text-gray-900">
                R$ {data.investimentos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Seção Inferior */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Próximas Contas */}
          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Próximas Contas</h3>
                <Button variant="outline" size="sm">
                  Ver todas
                </Button>
              </div>
              <div className="space-y-4">
                {data.proximasContas.map((conta, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{conta.nome}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500">{conta.vencimento}</span>
                      <span className="font-medium">R$ {conta.valor.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Meta Financeira */}
          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Meta Atual</h3>
                <Target className="w-5 h-5 text-blue-500" />
              </div>
              <h4 className="text-gray-600 mb-2">{data.metas.nome}</h4>
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progresso</span>
                  <span>{Math.round((data.metas.atual / data.metas.objetivo) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(data.metas.atual / data.metas.objetivo) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Atual: R$ {data.metas.atual.toLocaleString()}</span>
                <span className="text-gray-500">Meta: R$ {data.metas.objetivo.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
};

export default Body;
