"use client";

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  Area,
  AreaChart,
  Cell,
} from "recharts";

interface GraficosReceitasProps {
  receitas: Array<{
    id: number;
    descricao: string;
    data: string;
    valor: number;
    observacao: string;
  }>;
}

export default function GraficosReceitas({ receitas }: GraficosReceitasProps) {
  // Calcula total por mês para o gráfico de evolução
  const totalPorMes = receitas.reduce((acc, receita) => {
    const data = new Date(receita.data);
    const mesAno = `${data.getMonth() + 1}/${data.getFullYear()}`;
    acc[mesAno] = (acc[mesAno] || 0) + receita.valor;
    return acc;
  }, {} as Record<string, number>);

  // Formatação dos dados para o Recharts
  const dadosEvolucao = Object.entries(totalPorMes)
    .sort((a, b) => {
      const [mes1, ano1] = a[0].split("/");
      const [mes2, ano2] = b[0].split("/");

      if (ano1 !== ano2) return parseInt(ano1) - parseInt(ano2);
      return parseInt(mes1) - parseInt(mes2);
    })
    .map(([name, value]) => ({ name, value }));

  // Calcular média por mês
  const mediaMensal =
    dadosEvolucao.length > 0 ? dadosEvolucao.reduce((sum, item) => sum + item.value, 0) / dadosEvolucao.length : 0;

  // Gerar dados para gráfico comparativo de meses
  const dadosComparativo = dadosEvolucao.map((item) => ({
    ...item,
    media: mediaMensal,
  }));

  // Formatador para os valores em reais
  const formatPriceValue = (value: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Gráfico de Evolução de Receitas */}
      <div className="p-6 bg-white rounded-xl shadow-sm col-span-2">
        <h3 className="text-sm font-semibold text-gray-600 mb-5">Evolução das Receitas</h3>
        {dadosEvolucao.length > 0 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dadosEvolucao} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} tickMargin={10} />
                <YAxis tickFormatter={formatPriceValue} tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number) => [formatPriceValue(value), "Valor"]}
                  labelStyle={{ fontWeight: "bold", color: "#333" }}
                  contentStyle={{
                    borderRadius: "8px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                    border: "none",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#4caf50"
                  strokeWidth={2}
                  fill="#4caf5080"
                  activeDot={{ r: 7, fill: "#4caf50", stroke: "white", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-80 flex items-center justify-center">
            <p className="text-gray-400">Sem dados para exibir</p>
          </div>
        )}
      </div>

      {/* Gráfico Comparativo dos últimos meses */}
      <div className="p-6 bg-white rounded-xl shadow-sm h-full">
        <h3 className="text-sm font-semibold text-gray-600 mb-5">Comparativo de Valores Mensais</h3>
        {dadosComparativo.length > 0 ? (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={dadosComparativo} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={formatPriceValue} tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number) => [formatPriceValue(value), "Valor"]}
                  labelStyle={{ fontWeight: "bold", color: "#333" }}
                  contentStyle={{
                    borderRadius: "8px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                    border: "none",
                  }}
                />
                <Bar dataKey="value" fill="#4caf50" radius={[4, 4, 0, 0]} barSize={30} />
                <Line
                  type="monotone"
                  dataKey="media"
                  stroke="#ff6384"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Média Mensal"
                  dot={false}
                />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-72 flex items-center justify-center">
            <p className="text-gray-400">Sem dados para exibir</p>
          </div>
        )}
      </div>

      {/* Análise de Crescimento */}
      <div className="p-6 bg-white rounded-xl shadow-sm h-full">
        <h3 className="text-sm font-semibold text-gray-600 mb-5">Análise de Crescimento</h3>
        {dadosEvolucao.length > 0 ? (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={dadosEvolucao} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={formatPriceValue} tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number) => [formatPriceValue(value), "Valor"]}
                  labelStyle={{ fontWeight: "bold", color: "#333" }}
                  contentStyle={{
                    borderRadius: "8px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                    border: "none",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#4caf50"
                  strokeWidth={2}
                  dot={{ r: 5, fill: "#4caf50" }}
                  activeDot={{ r: 7, fill: "#4caf50", stroke: "white", strokeWidth: 2 }}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-72 flex items-center justify-center">
            <p className="text-gray-400">Sem dados para exibir</p>
          </div>
        )}
      </div>
    </div>
  );
}
