// Interface para representar o modelo de Investimento
export interface Investimento {
  id?: number;
  descricao: string;
  valor: number;
  quantidade: number;
  tipo: string;
  instituicao: string;
}

// Função para buscar todos os investimentos
export async function buscarInvestimentos(): Promise<Investimento[]> {
  try {
    const response = await fetch("/api/investimentos", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erro ao buscar investimentos");
    }

    return response.json();
  } catch (error) {
    console.error("Erro no serviço de investimentos:", error);
    throw error;
  }
}

// Função para buscar um investimento específico
export async function buscarInvestimentoPorId(id: number): Promise<Investimento> {
  try {
    const response = await fetch(`/api/investimentos/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erro ao buscar investimento");
    }

    return response.json();
  } catch (error) {
    console.error("Erro no serviço de investimentos:", error);
    throw error;
  }
}

// Função para criar um novo investimento
export async function criarInvestimento(investimento: Investimento): Promise<Investimento> {
  try {
    const response = await fetch("/api/investimentos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(investimento),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erro ao criar investimento");
    }

    return response.json();
  } catch (error) {
    console.error("Erro no serviço de investimentos:", error);
    throw error;
  }
}

// Função para atualizar um investimento existente
export async function atualizarInvestimento(investimento: Investimento): Promise<Investimento> {
  if (!investimento.id) {
    throw new Error("ID do investimento é necessário para atualização");
  }

  try {
    const response = await fetch(`/api/investimentos/${investimento.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(investimento),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erro ao atualizar investimento");
    }

    return response.json();
  } catch (error) {
    console.error("Erro no serviço de investimentos:", error);
    throw error;
  }
}

// Função para excluir um investimento
export async function excluirInvestimento(id: number): Promise<{ message: string }> {
  try {
    const response = await fetch(`/api/investimentos/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erro ao excluir investimento");
    }

    return response.json();
  } catch (error) {
    console.error("Erro no serviço de investimentos:", error);
    throw error;
  }
}
