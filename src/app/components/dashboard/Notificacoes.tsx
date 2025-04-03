"use client";

import { useState } from "react";
import { FiAlertCircle, FiCalendar, FiCheckCircle, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { Despesa } from "@/services/despesasService";
import { Receita } from "@/services/receitasService";

interface NotificacoesProps {
  despesas: Despesa[];
  receitas: Receita[];
  formatarValor: (valor: number) => string;
}

export default function Notificacoes({ despesas, receitas, formatarValor }: NotificacoesProps) {
  const [expandido, setExpandido] = useState(false);

  // Função para calcular datas de vencimento próximas
  const calcularNotificacoes = () => {
    const hoje = new Date();
    const proximos7dias = new Date();
    proximos7dias.setDate(hoje.getDate() + 7);

    const notificacoes = [];

    // Verificar saldo negativo no mês atual
    const primeiroDiaDoMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const ultimoDiaDoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

    const despesasDoMes = despesas.filter((despesa) => {
      const dataDespesa = new Date(despesa.data);
      return dataDespesa >= primeiroDiaDoMes && dataDespesa <= ultimoDiaDoMes;
    });

    const receitasDoMes = receitas.filter((receita) => {
      const dataReceita = new Date(receita.data);
      return dataReceita >= primeiroDiaDoMes && dataReceita <= ultimoDiaDoMes;
    });

    const totalDespesasDoMes = despesasDoMes.reduce((acc, d) => acc + d.valor, 0);
    const totalReceitasDoMes = receitasDoMes.reduce((acc, r) => acc + r.valor, 0);

    // Notificação de saldo negativo
    if (totalReceitasDoMes < totalDespesasDoMes) {
      notificacoes.push({
        tipo: "alerta",
        mensagem: "Saldo negativo neste mês",
        descricao: `Suas despesas ${formatarValor(totalDespesasDoMes)} estão maiores que suas receitas ${formatarValor(
          totalReceitasDoMes
        )}`,
        data: hoje.toISOString(),
      });
    }

    // Analisar próximas despesas
    despesas.forEach((despesa) => {
      const dataDespesa = new Date(despesa.data);

      // Despesas que vencem nos próximos 7 dias
      if (dataDespesa > hoje && dataDespesa <= proximos7dias) {
        notificacoes.push({
          tipo: "pendente",
          mensagem: `Despesa próxima: ${despesa.descricao}`,
          descricao: `Valor: ${formatarValor(despesa.valor)} • Categoria: ${despesa.categoria}`,
          data: despesa.data,
        });
      }
    });

    // Receitas próximas
    receitas.forEach((receita) => {
      const dataReceita = new Date(receita.data);

      // Receitas que serão recebidas nos próximos 7 dias
      if (dataReceita > hoje && dataReceita <= proximos7dias) {
        notificacoes.push({
          tipo: "positivo",
          mensagem: `Receita próxima: ${receita.descricao}`,
          descricao: `Valor: ${formatarValor(receita.valor)}`,
          data: receita.data,
        });
      }
    });

    // Ordenar notificações por data
    return notificacoes.sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
  };

  const notificacoes = calcularNotificacoes();

  // Formato de data para exibição
  const formatarData = (dataStr: string): string => {
    const data = new Date(dataStr);
    return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" });
  };

  // Notificações mostradas quando não expandido
  const notificacoesLimitadas = notificacoes.slice(0, 3);

  // Notificações para exibir
  const notificacoesParaExibir = expandido ? notificacoes : notificacoesLimitadas;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Notificações</h2>
        {notificacoes.length > 3 && (
          <button
            onClick={() => setExpandido(!expandido)}
            className="text-sm text-purple-600 hover:text-purple-800 flex items-center"
          >
            {expandido ? "Mostrar menos" : "Ver todas"}
            {expandido ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />}
          </button>
        )}
      </div>

      {notificacoes.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <FiCheckCircle className="mx-auto mb-2 text-green-500" size={24} />
          <p>Não há notificações no momento</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notificacoesParaExibir.map((notificacao, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg flex items-start ${
                notificacao.tipo === "alerta"
                  ? "bg-red-50"
                  : notificacao.tipo === "positivo"
                  ? "bg-green-50"
                  : "bg-yellow-50"
              }`}
            >
              <div className="mr-3 mt-0.5">
                {notificacao.tipo === "alerta" ? (
                  <FiAlertCircle className="text-red-500" size={18} />
                ) : notificacao.tipo === "positivo" ? (
                  <FiCheckCircle className="text-green-500" size={18} />
                ) : (
                  <FiCalendar className="text-yellow-500" size={18} />
                )}
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${
                    notificacao.tipo === "alerta"
                      ? "text-red-800"
                      : notificacao.tipo === "positivo"
                      ? "text-green-800"
                      : "text-yellow-800"
                  }`}
                >
                  {notificacao.mensagem}
                </p>
                <p className="text-xs text-gray-600 mt-0.5">{notificacao.descricao}</p>
                <p className="text-xs text-gray-500 mt-1">{formatarData(notificacao.data)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
