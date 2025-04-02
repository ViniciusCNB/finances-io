"use client";

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

export default function GraficosDespesas({ despesas }: GraficosDespesasProps) {
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

  // Converte os dados para arrays ordenados
  const categoriasSorted = Object.entries(totalPorCategoria).sort((a, b) => b[1] - a[1]);

  const formasPagamentoSorted = Object.entries(totalPorFormaPagamento).sort((a, b) => b[1] - a[1]);

  const mesesSorted = Object.entries(totalPorMes).sort((a, b) => {
    const [mes1, ano1] = a[0].split("/");
    const [mes2, ano2] = b[0].split("/");

    if (ano1 !== ano2) return parseInt(ano1) - parseInt(ano2);
    return parseInt(mes1) - parseInt(mes2);
  });

  // Componente para representar o gráfico de barras
  const BarChart = ({
    data,
    title,
    colorClass = "bg-blue-500",
  }: {
    data: [string, number][];
    title: string;
    colorClass?: string;
  }) => {
    const max = Math.max(...data.map(([_, value]) => value));

    return (
      <div className="h-48">
        <h3 className="text-sm font-medium text-gray-500 mb-4">{title}</h3>
        <div className="flex flex-col h-36 gap-2">
          {data.map(([label, value], index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-24 text-xs text-right text-gray-600 truncate" title={label}>
                {label}
              </div>
              <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full ${colorClass} rounded-full`} style={{ width: `${(value / max) * 100}%` }} />
              </div>
              <div className="w-20 text-xs text-gray-600">R$ {value.toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Componente para representar o gráfico de linha
  const LineChart = ({ data }: { data: [string, number][] }) => {
    const max = Math.max(...data.map(([_, value]) => value));
    const min = Math.min(...data.map(([_, value]) => value));
    const range = max - min;

    return (
      <div className="h-48">
        <h3 className="text-sm font-medium text-gray-500 mb-4">Evolução de Despesas</h3>
        <div className="relative h-36 border-l border-b border-gray-300">
          {/* Eixo Y - Valores */}
          <div className="absolute top-0 left-0 h-full -translate-x-8 flex flex-col justify-between text-xs text-gray-500">
            <span>R$ {max.toFixed(0)}</span>
            <span>R$ {min.toFixed(0)}</span>
          </div>

          {/* Pontos do gráfico */}
          <div className="absolute inset-0 pt-2">
            <div className="relative h-full flex items-end">
              {data.map(([label, value], index) => {
                const heightPercent = range ? ((value - min) / range) * 100 : 0;

                return (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div
                      className="w-3 h-3 rounded-full bg-blue-500 z-10 mb-1"
                      style={{
                        marginBottom: `${heightPercent}%`,
                      }}
                    />
                    <div className="absolute bottom-0 w-full">
                      <div className="h-8 -mb-8 flex justify-center">
                        <span className="text-xs text-gray-500 whitespace-nowrap">{label}</span>
                      </div>
                    </div>

                    {/* Linha de conexão com o próximo ponto */}
                    {index < data.length - 1 && (
                      <div
                        className="absolute h-0.5 bg-blue-500 z-0"
                        style={{
                          bottom: `${heightPercent}%`,
                          left: `${(index + 0.5) * (100 / data.length)}%`,
                          width: `${100 / data.length}%`,
                          transform: "translateY(1.5px)",
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Gráfico de Evolução */}
      <div className="p-6 bg-white rounded-xl shadow-sm md:col-span-2">
        {mesesSorted.length > 0 ? (
          <LineChart data={mesesSorted} />
        ) : (
          <div className="h-48 flex items-center justify-center">
            <p className="text-gray-400">Sem dados para exibir</p>
          </div>
        )}
      </div>

      {/* Gráfico por Categoria */}
      <div className="p-6 bg-white rounded-xl shadow-sm">
        {categoriasSorted.length > 0 ? (
          <BarChart data={categoriasSorted.slice(0, 5)} title="Despesas por Categoria" colorClass="bg-blue-500" />
        ) : (
          <div className="h-48 flex items-center justify-center">
            <p className="text-gray-400">Sem dados para exibir</p>
          </div>
        )}
      </div>

      {/* Gráfico por Forma de Pagamento */}
      <div className="p-6 bg-white rounded-xl shadow-sm">
        {formasPagamentoSorted.length > 0 ? (
          <BarChart data={formasPagamentoSorted} title="Despesas por Forma de Pagamento" colorClass="bg-green-500" />
        ) : (
          <div className="h-48 flex items-center justify-center">
            <p className="text-gray-400">Sem dados para exibir</p>
          </div>
        )}
      </div>
    </>
  );
}
