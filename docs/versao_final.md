# **CSI606-2024-02 - Remoto - Trabalho Final - Resultados**

## *Discente: Vinícius Correa Nobre Borges*


### Resumo
O Finances.io é uma aplicação web de gerenciamento financeiro pessoal desenvolvida com Next.js, React e Prisma. O sistema permite aos usuários gerenciar suas receitas, despesas e investimentos através de uma interface intuitiva e responsiva. A aplicação oferece visualização detalhada através de diversos gráficos e relatórios, possibilitando uma análise completa da saúde financeira do usuário.

### 1. Funcionalidades implementadas
- Dashboard Financeiro: Visão geral das finanças com cards de resumo e gráficos comparativos.
- Gerenciamento de Receitas: Cadastro, edição e exclusão de receitas com visualização em tabelas e múltiplos gráficos.
- Gerenciamento de Despesas: Controle completo de despesas com categorização, filtros e análises visuais.
- Gerenciamento de Investimentos: Acompanhamento de investimentos por tipo, instituição e período.
- Sistema de Filtros: Filtragem avançada por data, valor, categoria e outros atributos em todas as seções.
- Visualização Gráfica: Diversos tipos de gráficos (barras, linhas, pizza, radar, mapa em árvore) para análise dos dados.
  
### 2. Funcionalidades previstas e não implementadas
- Autenticação de Usuários: A funcionalidade de autenticação não foi integrada ao sistema.
- Exportação de Relatórios: Funcionalidade para exportar dados em formatos como PDF e Excel não foi implementada.

### 3. Outras funcionalidades implementadas
- Sistema de Esqueletos de Carregamento: Adição de componentes de esqueleto (skeleton) para melhorar a experiência durante o carregamento de dados, mantendo a consistência do layout.
- Visualização Multi-período: Implementação de guias para alternar entre visualizações mensais, trimestrais e anuais nos gráficos de evolução financeira.
- Tooltip Formatados nos Gráficos: Tooltips personalizados com formatação monetária e informações detalhadas nas visualizações gráficas.
- Mapa em Árvore para Distribuição: Visualização avançada da distribuição de receitas e despesas usando gráficos treemap.

### 4. Principais desafios e dificuldades
- Manipulação de Datas: O tratamento de datas e fusos horários nas visualizações gráficas exigiu ajustes específicos para garantir a precisão dos dados apresentados.
- Performance em Gráficos com Muitos Dados: Otimização dos componentes gráficos para manter a performance mesmo com grande volume de transações.
- Layout Consistente Durante Carregamento: Foi necessário desenvolver um sistema de esqueletos de carregamento para evitar saltos no layout e proporcionar uma experiência fluida.
- Agrupamento de Dados para Visualizações: Implementar a lógica de agrupamento e transformação de dados para diferentes tipos de visualizações gráficas exigiu uma atenção especial.

### 5. Instruções para instalação e execução
1. Pré-requisitos:
- Node.js (versão 14 ou superior)
- NPM ou Yarn
- SQLite ou outro banco de dados compatível com Prisma

2. Clonando o repositório:
```bash
git clone https://github.com/ViniciusCNB/finances-io.git
cd finances-io
```

3. Instalando dependências:
```bash
npm install
# ou
yarn install
```

4. Configurando o banco de dados:
- Crie um arquivo `.env` na raiz do projeto com as variáveis:
```text
DATABASE_URL="file:./dev.db"
```

- Execute as migrações do Prisma:
```bash
npx prisma migrate dev
# ou
yarn prisma migrate dev
```

5. Gerando o Prisma Client:
```bash
npx prisma generate
# ou
yarn prisma generate
```

6. Iniciando a aplicação em modo desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

7. Acesse a aplicação:
- Abra seu navegador e acesse `http://localhost:3000`

### 6. Referências
- NEXT.JS. Documentation. Disponível em: <https://nextjs.org/docs>.
- REACT. Getting Started. Disponível em: <https://reactjs.org/docs/getting-started.html>.
- PRISMA. Prisma Documentation. Disponível em: <https://www.prisma.io/docs/>.
- TAILWIND CSS. Documentation. Disponível em: <https://tailwindcss.com/docs>.
- RECHARTS. API Reference. Disponível em: <https://recharts.org/en-US/api>.