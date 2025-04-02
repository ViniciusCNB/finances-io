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
  PieChart,
  Pie,
  Cell,
  Sector,
} from "recharts";
import { useState } from "react";

interface GraficosDespesasProps {
  despesas: Array<{
    id: number;
    descricao: string;
    data: string;
    valor: number;
    categoria_despesa: string;
    observacao: string;
    forma_pagamento: string;
  }>;
}

// Cores para os gráficos
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A28BFF",
  "#FF6F91",
  "#4CAF50",
  "#03A9F4",
  "#FF5722",
  "#9C27B0",
];

export default function GraficosDespesas({ despesas }: GraficosDespesasProps) {
  // Estado para controlar o setor ativo no gráfico de pizza
  const [activeIndex, setActiveIndex] = useState(0);

  // Calcula total por categoria
  const totalPorCategoria = despesas.reduce((acc, despesa) => {
    const categoria = despesa.categoria_despesa;
    acc[categoria] = (acc[categoria] || 0) + despesa.valor;
    return acc;
  }, {} as Record<string, number>);

  // Calcula total por forma de pagamento
  const totalPorFormaPagamento = despesas.reduce((acc, despesa) => {
    const forma = despesa.forma_pagamento;
    acc[forma] = (acc[forma] || 0) + despesa.valor;
    return acc;
  }, {} as Record<string, number>);

  // Calcula total por mês para o gráfico de evolução
  const totalPorMes = despesas.reduce((acc, despesa) => {
    const data = new Date(despesa.data);
    const mesAno = `${data.getMonth() + 1}/${data.getFullYear()}`;
    acc[mesAno] = (acc[mesAno] || 0) + despesa.valor;
    return acc;
  }, {} as Record<string, number>);

  // Formatação dos dados para o Recharts
  const dadosCategoria = Object.entries(totalPorCategoria)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }));

  const dadosFormaPagamento = Object.entries(totalPorFormaPagamento).map(([name, value]) => ({ name, value }));

  const dadosEvolucao = Object.entries(totalPorMes)
    .sort((a, b) => {
      const [mes1, ano1] = a[0].split("/");
      const [mes2, ano2] = b[0].split("/");

      if (ano1 !== ano2) return parseInt(ano1) - parseInt(ano2);
      return parseInt(mes1) - parseInt(mes2);
    })
    .map(([name, value]) => ({ name, value }));

  const formatPriceValue = (value: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
  };

  // Handler para o gráfico de pizza ativo
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  // Componente para renderizar o setor ativo do gráfico de pizza
  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;

    return (
      <g>
        <text x={cx} y={cy} dy={-20} textAnchor="middle" fill="#333" fontSize={12}>
          {payload.name}
        </text>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill="#333" fontSize={16} fontWeight={500}>
          {formatPriceValue(value)}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 5}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Gráfico de Evolução */}
      <div className="p-6 bg-white rounded-xl shadow-sm col-span-2">
        <h3 className="text-sm font-semibold text-gray-600 mb-5">Evolução dos Gastos</h3>
        {dadosEvolucao.length > 0 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={dadosEvolucao} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
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
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#0088FE"
                  strokeWidth={2}
                  dot={{ r: 5, fill: "#0088FE" }}
                  activeDot={{ r: 7, fill: "#0088FE", stroke: "white", strokeWidth: 2 }}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-80 flex items-center justify-center">
            <p className="text-gray-400">Sem dados para exibir</p>
          </div>
        )}
      </div>

      {/* Gráfico por Categoria */}
      <div className="p-6 bg-white rounded-xl shadow-sm h-full">
        <h3 className="text-sm font-semibold text-gray-600 mb-5">Despesas por Categoria</h3>
        {dadosCategoria.length > 0 ? (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={dadosCategoria}
                  cx="50%"
                  cy="50%"
                  innerRadius={90}
                  outerRadius={120}
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                >
                  {dadosCategoria.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [formatPriceValue(value), "Valor"]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-72 flex items-center justify-center">
            <p className="text-gray-400">Sem dados para exibir</p>
          </div>
        )}
      </div>

      {/* Gráfico por Forma de Pagamento */}
      <div className="p-6 bg-white rounded-xl shadow-sm h-full">
        <h3 className="text-sm font-semibold text-gray-600 mb-5">Despesas por Forma de Pagamento</h3>
        {dadosFormaPagamento.length > 0 ? (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart
                data={dadosFormaPagamento}
                layout="vertical"
                margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} opacity={0.3} />
                <XAxis type="number" tickFormatter={formatPriceValue} tick={{ fontSize: 12 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={90} />
                <Tooltip
                  formatter={(value: number) => [formatPriceValue(value), "Valor"]}
                  labelStyle={{ fontWeight: "bold", color: "#333" }}
                  contentStyle={{
                    borderRadius: "8px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                    border: "none",
                  }}
                />
                <Bar dataKey="value" fill="#00C49F" radius={[0, 4, 4, 0]} barSize={34} />
              </RechartsBarChart>
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
