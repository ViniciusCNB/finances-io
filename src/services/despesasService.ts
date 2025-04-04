// Interface para representar o modelo de Despesa
export interface Despesa {
  id?: number;
  descricao: string;
  data: string | Date;
  valor: number;
  categoria: string;
  observacao?: string | null;
  forma_pagamento: string;
}

// Função para buscar todas as despesas
export async function buscarDespesas(): Promise<Despesa[]> {
  try {
    const response = await fetch("/api/despesas", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erro ao buscar despesas");
    }

    return response.json();
  } catch (error) {
    console.error("Erro no serviço de despesas:", error);
    throw error;
  }
}

// Função para buscar uma despesa específica
export async function buscarDespesaPorId(id: number): Promise<Despesa> {
  try {
    const response = await fetch(`/api/despesas/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erro ao buscar despesa");
    }

    return response.json();
  } catch (error) {
    console.error("Erro no serviço de despesas:", error);
    throw error;
  }
}

// Função para criar uma nova despesa
export async function criarDespesa(despesa: Despesa): Promise<Despesa> {
  try {
    const response = await fetch("/api/despesas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(despesa),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erro ao criar despesa");
    }

    return response.json();
  } catch (error) {
    console.error("Erro no serviço de despesas:", error);
    throw error;
  }
}

// Função para atualizar uma despesa existente
export async function atualizarDespesa(despesa: Despesa): Promise<Despesa> {
  if (!despesa.id) {
    throw new Error("ID da despesa é necessário para atualização");
  }

  try {
    const response = await fetch(`/api/despesas/${despesa.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(despesa),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erro ao atualizar despesa");
    }

    return response.json();
  } catch (error) {
    console.error("Erro no serviço de despesas:", error);
    throw error;
  }
}

// Função para excluir uma despesa
export async function excluirDespesa(id: number): Promise<{ message: string }> {
  try {
    const response = await fetch(`/api/despesas/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erro ao excluir despesa");
    }

    return response.json();
  } catch (error) {
    console.error("Erro no serviço de despesas:", error);
    throw error;
  }
}
