"use client";

import { useState, useEffect } from "react";
import { FiArrowDown, FiArrowUp, FiDollarSign, FiLayout } from "react-icons/fi";
import { Despesa, buscarDespesas } from "@/services/despesasService";
import { Receita, buscarReceitas } from "@/services/receitasService";
import { Investimento, buscarInvestimentos } from "@/services/investimentosService";
import Link from "next/link";
import ResumoFinanceiro from "./components/dashboard/ResumoFinanceiro";
import FluxoCaixaMensal from "./components/dashboard/FluxoCaixaMensal";
import DistribuicaoInvestimentos from "./components/dashboard/DistribuicaoInvestimentos";
import TopGastos from "./components/dashboard/TopGastos";
import Notificacoes from "./components/dashboard/Notificacoes";

export default function Home() {
  const [resumo, setResumo] = useState({
    totalDespesas: 0,
    totalReceitas: 0,
    totalInvestimentos: 0,
    saldo: 0,
    loading: true,
    erro: null as string | null,
  });

  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [investimentos, setInvestimentos] = useState<Investimento[]>([]);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        // Buscar dados das APIs
        const [despesasData, receitasData, investimentosData] = await Promise.all([
          buscarDespesas(),
          buscarReceitas(),
          buscarInvestimentos(),
        ]);

        // Armazenar dados para uso em gráficos
        setDespesas(despesasData);
        setReceitas(receitasData);
        setInvestimentos(investimentosData);

        // Calcular totais
        const totalDespesas = despesasData.reduce((acc, d) => acc + d.valor, 0);
        const totalReceitas = receitasData.reduce((acc, r) => acc + r.valor, 0);
        const totalInvestimentos = investimentosData.reduce((acc, i) => acc + i.valor * i.quantidade, 0);
        const saldo = totalReceitas - totalDespesas;

        // Atualizar estado
        setResumo({
          totalDespesas,
          totalReceitas,
          totalInvestimentos,
          saldo,
          loading: false,
          erro: null,
        });
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
        setResumo((prev) => ({
          ...prev,
          loading: false,
          erro: "Não foi possível carregar os dados do dashboard.",
        }));
      }
    };

    carregarDados();
  }, []);

  const formatarValor = (valor: number) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard Financeiro</h1>

      {resumo.erro && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{resumo.erro}</div>
      )}

      {resumo.loading ? (
        <div className="text-center py-6">
          <p className="text-gray-600">Carregando dados...</p>
        </div>
      ) : (
        <>
          {/* Cards de resumo */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Receitas */}
            <Link href="/receitas" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-500">Receitas</h3>
                <div className="bg-green-100 p-2 rounded-lg">
                  <FiArrowUp className="text-green-500" size={20} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatarValor(resumo.totalReceitas)}</p>
            </Link>

            {/* Despesas */}
            <Link href="/despesas" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-500">Despesas</h3>
                <div className="bg-red-100 p-2 rounded-lg">
                  <FiArrowDown className="text-red-500" size={20} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatarValor(resumo.totalDespesas)}</p>
            </Link>

            {/* Saldo */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-500">Saldo</h3>
                <div className={`p-2 rounded-lg ${resumo.saldo >= 0 ? "bg-green-100" : "bg-red-100"}`}>
                  <FiDollarSign className={resumo.saldo >= 0 ? "text-green-500" : "text-red-500"} size={20} />
                </div>
              </div>
              <p className={`text-2xl font-bold ${resumo.saldo >= 0 ? "text-green-600" : "text-red-600"}`}>
                {formatarValor(resumo.saldo)}
              </p>
            </div>

            {/* Investimentos */}
            <Link href="/investimentos" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-500">Investimentos</h3>
                <div className="bg-purple-100 p-2 rounded-lg">
                  <FiLayout className="text-purple-500" size={20} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatarValor(resumo.totalInvestimentos)}</p>
            </Link>
          </div>

          {/* Notificações */}
          {!resumo.loading && (despesas.length > 0 || receitas.length > 0) && (
            <Notificacoes despesas={despesas} receitas={receitas} formatarValor={formatarValor} />
          )}

          {/* Resumo Financeiro com gráficos */}
          {!resumo.loading && (
            <>
              {despesas.length > 0 && receitas.length > 0 && (
                <>
                  <ResumoFinanceiro despesas={despesas} receitas={receitas} formatarValor={formatarValor} />
                  <FluxoCaixaMensal despesas={despesas} receitas={receitas} formatarValor={formatarValor} />
                </>
              )}

              {despesas.length > 0 && <TopGastos despesas={despesas} formatarValor={formatarValor} />}

              {investimentos.length > 0 && (
                <DistribuicaoInvestimentos investimentos={investimentos} formatarPreco={formatarValor} />
              )}
            </>
          )}

          {/* Seção de dicas */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Recomendações</h2>

            <div className="space-y-4">
              {resumo.saldo < 0 && (
                <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                  <h3 className="font-medium text-red-800">Atenção!</h3>
                  <p className="text-red-700 mt-1">Seu saldo está negativo. Considere reduzir algumas despesas.</p>
                </div>
              )}

              {resumo.totalInvestimentos === 0 && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h3 className="font-medium text-blue-800">Investimentos</h3>
                  <p className="text-blue-700 mt-1">
                    Você ainda não possui investimentos registrados. Que tal começar a investir?
                  </p>
                </div>
              )}

              {resumo.saldo > 0 && resumo.totalInvestimentos === 0 && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <h3 className="font-medium text-green-800">Oportunidade</h3>
                  <p className="text-green-700 mt-1">
                    Você possui saldo positivo. Considere investir parte desse valor!
                  </p>
                </div>
              )}

              {resumo.saldo >= 0 && resumo.totalDespesas > 0 && (
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <h3 className="font-medium text-purple-800">Dica</h3>
                  <p className="text-purple-700 mt-1">
                    Analise suas maiores despesas e veja se é possível reduzi-las para aumentar sua capacidade de
                    investimento.
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
