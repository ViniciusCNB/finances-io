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
  PieChart,
  Pie,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Treemap,
} from "recharts";
import { useState } from "react";

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
  const [guiaAtiva, setGuiaAtiva] = useState<"mensal" | "trimestral" | "anual">("mensal");

  // Paleta de cores para os gráficos
  const CORES = [
    "#4caf50",
    "#2196f3",
    "#f44336",
    "#ff9800",
    "#9c27b0",
    "#3f51b5",
    "#009688",
    "#e91e63",
    "#673ab7",
    "#8bc34a",
  ];

  // Formatador para os valores em reais
  const formatPriceValue = (value: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
  };

  // Calcula total por mês para o gráfico de evolução
  const totalPorMes = receitas.reduce((acc, receita) => {
    const data = new Date(receita.data);
    // Ajustar o fuso horário
    const dataAjustada = new Date(data.getTime() + data.getTimezoneOffset() * 60000);
    const mesAno = `${dataAjustada.getMonth() + 1}/${dataAjustada.getFullYear()}`;
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

  // Dados para o gráfico de categorias
  const nomesMeses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  // Dados para o gráfico trimestral
  const dadosTrimestrais = receitas.reduce((acc, receita) => {
    const data = new Date(receita.data);
    const trimestre = Math.floor(data.getMonth() / 3) + 1;
    const ano = data.getFullYear();
    const chave = `T${trimestre}/${ano}`;

    if (!acc[chave]) {
      acc[chave] = { name: chave, value: 0 };
    }

    acc[chave].value += receita.valor;
    return acc;
  }, {} as Record<string, { name: string; value: number }>);

  const dadosTrimestraisArray = Object.values(dadosTrimestrais).sort((a, b) => {
    const [t1, ano1] = a.name.substring(1).split("/");
    const [t2, ano2] = b.name.substring(1).split("/");

    if (ano1 !== ano2) return parseInt(ano1) - parseInt(ano2);
    return parseInt(t1) - parseInt(t2);
  });

  // Dados para o gráfico anual
  const dadosAnuais = receitas.reduce((acc, receita) => {
    const data = new Date(receita.data);
    const ano = data.getFullYear().toString();

    if (!acc[ano]) {
      acc[ano] = { name: ano, value: 0 };
    }

    acc[ano].value += receita.valor;
    return acc;
  }, {} as Record<string, { name: string; value: number }>);

  const dadosAnuaisArray = Object.values(dadosAnuais).sort((a, b) => parseInt(a.name) - parseInt(b.name));

  // Agrupar receitas por nome para o gráfico de pizza
  const receitasAgrupadas = receitas.reduce((acc, receita) => {
    const descricao = receita.descricao.trim();
    if (!acc[descricao]) {
      acc[descricao] = 0;
    }
    acc[descricao] += receita.valor;
    return acc;
  }, {} as Record<string, number>);

  // Calcular as 5 maiores receitas agrupadas para o gráfico de pizza
  const topReceitas = Object.entries(receitasAgrupadas)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, value]) => ({
      name: name.length > 20 ? `${name.substring(0, 20)}...` : name,
      value,
    }));

  // Adicionar "Outras" se houver mais que 5 categorias de receitas
  if (Object.keys(receitasAgrupadas).length > 5) {
    const outrasValue = Object.entries(receitasAgrupadas)
      .sort((a, b) => b[1] - a[1])
      .slice(5)
      .reduce((sum, [_, value]) => sum + value, 0);

    topReceitas.push({ name: "Outras", value: outrasValue });
  }

  // Cálculo de estatísticas para radar
  const totalReceitas = receitas.reduce((sum, item) => sum + item.valor, 0);
  const mediaReceitas = receitas.length > 0 ? totalReceitas / receitas.length : 0;
  const maiorReceita = receitas.length > 0 ? Math.max(...receitas.map((r) => r.valor)) : 0;
  const menorReceita = receitas.length > 0 ? Math.min(...receitas.map((r) => r.valor)) : 0;

  // Agrupar por mês atual
  const mesAtual = new Date().getMonth();
  const receitasMesAtual = receitas.filter((r) => new Date(r.data).getMonth() === mesAtual);
  const totalMesAtual = receitasMesAtual.reduce((sum, item) => sum + item.valor, 0);

  // Dados para radar
  const dadosRadar = [
    { subject: "Total", A: totalReceitas / 1000, fullMark: (maiorReceita / 1000) * 1.5 },
    { subject: "Média", A: mediaReceitas / 1000, fullMark: (maiorReceita / 1000) * 1.5 },
    { subject: "Mês Atual", A: totalMesAtual / 1000, fullMark: (maiorReceita / 1000) * 1.5 },
    { subject: "Maior", A: maiorReceita / 1000, fullMark: (maiorReceita / 1000) * 1.5 },
    { subject: "Menor", A: menorReceita / 1000, fullMark: (maiorReceita / 1000) * 1.5 },
    { subject: "Qtde.", A: receitas.length, fullMark: receitas.length * 1.5 },
  ];

  // Treemap data com receitas agrupadas
  const treemapData = Object.entries(receitasAgrupadas).map(([name, value]) => ({
    name: name.length > 15 ? `${name.substring(0, 15)}...` : name,
    size: value,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-6 bg-white rounded-xl shadow-sm col-span-2">
          <div className="text-sm font-semibold text-gray-600 mb-5 flex justify-between items-center">
            {guiaAtiva === "mensal"
              ? "Evolução Mensal das Receitas"
              : guiaAtiva === "trimestral"
              ? "Evolução Trimestral das Receitas"
              : "Evolução Anual das Receitas"}

            <div className="inline-flex bg-gray-100 rounded-md">
              <button
                className={`px-4 py-2 rounded-md ${
                  guiaAtiva === "mensal" ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"
                } transition cursor-pointer`}
                onClick={() => setGuiaAtiva("mensal")}
              >
                Mensal
              </button>
              <button
                className={`px-4 py-2 rounded-md ${
                  guiaAtiva === "trimestral" ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"
                } transition cursor-pointer`}
                onClick={() => setGuiaAtiva("trimestral")}
              >
                Trimestral
              </button>
              <button
                className={`px-4 py-2 rounded-md ${
                  guiaAtiva === "anual" ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"
                } transition cursor-pointer`}
                onClick={() => setGuiaAtiva("anual")}
              >
                Anual
              </button>
            </div>
          </div>

          {guiaAtiva === "mensal" &&
            (dadosEvolucao.length > 0 ? (
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
            ))}

          {guiaAtiva === "trimestral" &&
            (dadosTrimestraisArray.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={dadosTrimestraisArray} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
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
                    <Bar dataKey="value" fill="#2196f3" radius={[4, 4, 0, 0]} barSize={40}>
                      {dadosTrimestraisArray.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CORES[index % CORES.length]} />
                      ))}
                    </Bar>
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center">
                <p className="text-gray-400">Sem dados para exibir</p>
              </div>
            ))}

          {guiaAtiva === "anual" &&
            (dadosAnuaisArray.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={dadosAnuaisArray} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
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
                    <Bar dataKey="value" fill="#ff9800" radius={[8, 8, 0, 0]} barSize={60}>
                      {dadosAnuaisArray.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CORES[index % CORES.length]} />
                      ))}
                    </Bar>
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center">
                <p className="text-gray-400">Sem dados para exibir</p>
              </div>
            ))}
        </div>

        {/* Gráfico de Pizza - Top Receitas */}
        <div className="p-6 bg-white rounded-xl shadow-sm h-full">
          <h3 className="text-sm font-semibold text-gray-600 mb-5">Principais Receitas</h3>
          {topReceitas.length > 0 ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topReceitas}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {topReceitas.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CORES[index % CORES.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string) => [formatPriceValue(value), name]}
                    labelStyle={{ fontWeight: "bold", color: "#333" }}
                    contentStyle={{
                      borderRadius: "8px",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                      border: "none",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-72 flex items-center justify-center">
              <p className="text-gray-400">Sem dados para exibir</p>
            </div>
          )}
        </div>

        {/* Gráfico de Radar - Métricas */}
        <div className="p-6 bg-white rounded-xl shadow-sm h-full">
          <h3 className="text-sm font-semibold text-gray-600 mb-5">Métricas de Receitas (em milhares)</h3>
          {dadosRadar.length > 0 && receitas.length > 0 ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={dadosRadar}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, "auto"]} />
                  <Radar name="Valor" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-72 flex items-center justify-center">
              <p className="text-gray-400">Sem dados para exibir</p>
            </div>
          )}
        </div>
      </div>

      {/* Segunda linha de gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Comparativo com média */}
        <div className="p-6 bg-white rounded-xl shadow-sm">
          <h3 className="text-sm font-semibold text-gray-600 mb-5">Comparativo com Média Mensal</h3>
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
                  <Legend />
                  <Bar dataKey="value" name="Valor Mensal" fill="#4caf50" radius={[4, 4, 0, 0]} barSize={30} />
                  <Line
                    type="monotone"
                    dataKey="media"
                    name="Média Mensal"
                    stroke="#ff6384"
                    strokeWidth={2}
                    strokeDasharray="5 5"
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

        {/* Mapa em Árvore (Treemap) */}
        <div className="p-6 bg-white rounded-xl shadow-sm">
          <h3 className="text-sm font-semibold text-gray-600 mb-5">Distribuição de Receitas (Mapa em Árvore)</h3>
          {treemapData.length > 0 ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <Treemap data={treemapData} dataKey="size" nameKey="name" stroke="#fff">
                  <Tooltip
                    formatter={(value: number, name: string) => [formatPriceValue(value), name]}
                    contentStyle={{
                      borderRadius: "8px",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                      border: "none",
                    }}
                  />
                </Treemap>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-72 flex items-center justify-center">
              <p className="text-gray-400">Sem dados para exibir</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
