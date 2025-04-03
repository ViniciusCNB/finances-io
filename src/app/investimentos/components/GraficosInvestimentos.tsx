"use client";

import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Treemap,
  Tooltip as TreemapTooltip,
} from "recharts";

interface Investimento {
  id: number;
  descricao: string;
  valor: number;
  quantidade: number;
  tipo: string;
  instituicao: string;
}

interface GraficosInvestimentosProps {
  investimentos: Investimento[];
  formatarPreco: (valor: number) => string;
}

const CORES = [
  "#8884d8",
  "#83a6ed",
  "#8dd1e1",
  "#82ca9d",
  "#a4de6c",
  "#d0ed57",
  "#ffc658",
  "#ff8042",
  "#ff6b6b",
  "#cc99ff",
];

export default function GraficosInvestimentos({ investimentos, formatarPreco }: GraficosInvestimentosProps) {
  const [visualizacao, setVisualizacao] = useState<"tipos" | "instituicoes">("tipos");

  // Calcula o valor total para cada tipo de investimento
  const dadosPorTipo = Object.entries(
    investimentos.reduce((acc, inv) => {
      const tipo = inv.tipo;
      if (!acc[tipo]) acc[tipo] = 0;
      acc[tipo] += inv.valor * inv.quantidade;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value], index) => ({
    name,
    value,
    color: CORES[index % CORES.length],
  }));

  // Calcula o valor total para cada instituição
  const dadosPorInstituicao = Object.entries(
    investimentos.reduce((acc, inv) => {
      const instituicao = inv.instituicao;
      if (!acc[instituicao]) acc[instituicao] = 0;
      acc[instituicao] += inv.valor * inv.quantidade;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value], index) => ({
    name,
    value,
    color: CORES[index % CORES.length],
  }));

  // Prepara dados para o treemap (investimentos individuais)
  const dadosTreemap = investimentos.map((inv, index) => ({
    name: inv.descricao,
    size: inv.valor * inv.quantidade,
    tipo: inv.tipo,
    instituicao: inv.instituicao,
    color: CORES[index % CORES.length],
  }));

  // Função para renderizar rótulos personalizados no gráfico de pizza
  const renderizarRotuloPizza = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
    const raio = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + raio * Math.cos((-midAngle * Math.PI) / 180);
    const y = cy + raio * Math.sin((-midAngle * Math.PI) / 180);

    if (percent < 0.05) return null;

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const dadosAtivos = visualizacao === "tipos" ? dadosPorTipo : dadosPorInstituicao;

  return (
    <div className="bg-white rounded-xl p-4 shadow">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Distribuição de Investimentos</h3>

        <div className="inline-flex rounded-md shadow-sm">
          <button
            type="button"
            className={`px-3 py-1.5 text-sm font-medium ${
              visualizacao === "tipos" ? "bg-purple-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
            } border border-gray-300 rounded-l-lg cursor-pointer`}
            onClick={() => setVisualizacao("tipos")}
          >
            Por Tipo
          </button>
          <button
            type="button"
            className={`px-3 py-1.5 text-sm font-medium ${
              visualizacao === "instituicoes" ? "bg-purple-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
            } border border-l-0 border-gray-300 rounded-r-lg cursor-pointer`}
            onClick={() => setVisualizacao("instituicoes")}
          >
            Por Instituição
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Pizza */}
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dadosAtivos}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderizarRotuloPizza}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {dadosAtivos.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatarPreco(value)} separator=": " />
              <Legend
                align="center"
                verticalAlign="bottom"
                layout="horizontal"
                formatter={(value, entry, index) => `${value} (${formatarPreco(dadosAtivos[index].value)})`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Barras */}
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dadosAtivos}
              margin={{
                top: 10,
                right: 30,
                left: 20,
                bottom: 40,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} interval={0} />
              <YAxis tickFormatter={(value) => formatarPreco(value).replace("R$", "")} />
              <Tooltip formatter={(value: number) => formatarPreco(value)} />
              <Bar dataKey="value" name="Valor">
                {dadosAtivos.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Treemap de Investimentos */}
        <div className="h-[300px] lg:col-span-2">
          <h3 className="text-md font-semibold text-gray-700 mb-2">Todos os Investimentos</h3>
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={dadosTreemap}
              dataKey="size"
              ratio={4 / 3}
              stroke="#fff"
              fill="#8884d8"
              content={({ depth, x, y, width, height, index, name }: any) => {
                const item = dadosTreemap[index];
                return (
                  <g>
                    <rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      style={{
                        fill: item.color,
                        stroke: "#fff",
                        strokeWidth: 2 / (depth + 1e-10),
                        strokeOpacity: 1 / (depth + 1e-10),
                      }}
                    />
                    {width > 30 && height > 30 && (
                      <text
                        x={x + width / 2}
                        y={y + height / 2}
                        textAnchor="middle"
                        fill="#fff"
                        fontSize={12}
                        fontWeight="bold"
                      >
                        {name}
                      </text>
                    )}
                  </g>
                );
              }}
            >
              <TreemapTooltip
                content={(props) => {
                  if (!props.payload || !props.payload[0]) return null;
                  const item = props.payload[0].payload;
                  return (
                    <div className="bg-white p-2 border border-gray-200 rounded shadow-md">
                      <p className="font-bold">{item.name}</p>
                      <p>Valor: {formatarPreco(item.size)}</p>
                      <p>Tipo: {item.tipo}</p>
                      <p>Instituição: {item.instituicao}</p>
                    </div>
                  );
                }}
              />
            </Treemap>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
