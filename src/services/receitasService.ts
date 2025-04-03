// Interface para representar o modelo de Receita
export interface Receita {
  id?: number;
  descricao: string;
  data: string | Date;
  valor: number;
  observacao?: string | null;
}

// Função para buscar todas as receitas
export async function buscarReceitas(): Promise<Receita[]> {
  try {
    const response = await fetch("/api/receitas", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erro ao buscar receitas");
    }

    return response.json();
  } catch (error) {
    console.error("Erro no serviço de receitas:", error);
    throw error;
  }
}

// Função para buscar uma receita específica
export async function buscarReceitaPorId(id: number): Promise<Receita> {
  try {
    const response = await fetch(`/api/receitas/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erro ao buscar receita");
    }

    return response.json();
  } catch (error) {
    console.error("Erro no serviço de receitas:", error);
    throw error;
  }
}

// Função para criar uma nova receita
export async function criarReceita(receita: Receita): Promise<Receita> {
  try {
    const response = await fetch("/api/receitas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(receita),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erro ao criar receita");
    }

    return response.json();
  } catch (error) {
    console.error("Erro no serviço de receitas:", error);
    throw error;
  }
}

// Função para atualizar uma receita existente
export async function atualizarReceita(receita: Receita): Promise<Receita> {
  if (!receita.id) {
    throw new Error("ID da receita é necessário para atualização");
  }

  try {
    const response = await fetch(`/api/receitas/${receita.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(receita),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erro ao atualizar receita");
    }

    return response.json();
  } catch (error) {
    console.error("Erro no serviço de receitas:", error);
    throw error;
  }
}

// Função para excluir uma receita
export async function excluirReceita(id: number): Promise<{ message: string }> {
  try {
    const response = await fetch(`/api/receitas/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erro ao excluir receita");
    }

    return response.json();
  } catch (error) {
    console.error("Erro no serviço de receitas:", error);
    throw error;
  }
}
