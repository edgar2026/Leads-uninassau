# Sistema CRM Educacional - Gestão de Leads

## 📋 Visão Geral

Sistema completo de CRM (Customer Relationship Management) desenvolvido para instituições de ensino superior. O sistema permite gerenciar o processo de captação de alunos desde a inscrição até a matrícula, com foco em acompanhamento de produtividade da equipe comercial e visualização de métricas em tempo real.

## ✨ Funcionalidades Implementadas

### 1. Autenticação
- Tela de login com credenciais
- Sistema de perfis (Administrador, Comercial, Supervisor)
- TODO: Integração com backend para autenticação real

### 2. Dashboard Gerencial
- **Métricas em Tempo Real:**
  - Total de leads cadastrados
  - Leads quentes com tendência
  - Taxa de conversão
  - Tempo médio até matrícula
  
- **Visualizações:**
  - Funil de conversão (Contato → Interesse → Prova → Matrícula)
  - Distribuição de temperatura (Quente 🔥, Morno 🟡, Frio 🧊)
  - Gráfico de conversões por período
  - Gráfico de leads por origem
  - Ranking de vendedores
  - Atividades recentes

### 3. Painel de Leads
- Lista de leads com cards visuais
- Filtros por:
  - Status (Quente, Morno, Frio, Perdido, Matriculado)
  - Curso
  - Busca inteligente (nome, telefone, email)
- Modal para adicionar/editar leads
- Visualização completa de detalhes do lead

### 4. Detalhes do Lead
- Informações completas do lead
- Histórico de interações com timeline
- Modal para adicionar novas interações
- Ações rápidas (ligar, email, WhatsApp, agendar retorno)
- Status e etapa do funil visual

### 5. Gerenciamento de Cursos
- Listagem de cursos disponíveis
- Total de leads por curso
- Ações para editar e visualizar leads do curso

### 6. Configurações
- Tema claro/escuro
- Perfil do usuário
- Critérios de temperatura automática
  - Configuração de dias para Quente, Morno e Frio

## 🎨 Design System

### Componentes Principais
- **StatusBadge**: Badge com emoji e cor para status do lead
- **StageBadge**: Badge para etapa do funil
- **DashboardStat**: Card de estatística com ícone e tendência
- **LeadCard**: Card completo do lead com ações
- **FunnelChart**: Visualização do funil de conversão
- **ConversionChart**: Gráfico de linha para conversões
- **TemperatureDistribution**: Gráfico de pizza com temperatura
- **LeadsByOriginChart**: Gráfico de barras por origem
- **RankingTable**: Tabela de ranking de vendedores
- **RecentActivity**: Timeline de atividades recentes

### Paleta de Cores
- **Primary**: Azul profissional (HSL 221 83% 53%)
- **Quente**: Vermelho (HSL 0 84% 60%) 🔥
- **Morno**: Amarelo (HSL 43 96% 56%) 🟡
- **Frio**: Ciano (HSL 199 89% 48%) 🧊
- **Success**: Verde para matrículas (HSL 142 76% 36%)

### Tema
- Suporte completo a modo claro e escuro
- Persistência da preferência do usuário
- Transições suaves

## 🛠️ Stack Tecnológica

### Frontend
- React 18 com TypeScript
- Vite para build
- TailwindCSS para estilização
- Shadcn UI para componentes base
- Recharts para gráficos
- Wouter para roteamento
- React Hook Form para formulários
- Framer Motion para animações (configurado)

### Backend (Planejado)
- Express.js
- Supabase para banco de dados e autenticação
- PostgreSQL

## 📁 Estrutura do Projeto

```
client/src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes Shadcn
│   ├── examples/       # Exemplos de componentes
│   ├── StatusBadge.tsx
│   ├── LeadCard.tsx
│   ├── FunnelChart.tsx
│   └── ...
├── pages/              # Páginas da aplicação
│   ├── Dashboard.tsx
│   ├── LeadsPanel.tsx
│   ├── LeadDetail.tsx
│   ├── Login.tsx
│   ├── Cursos.tsx
│   └── Configuracoes.tsx
├── lib/                # Utilitários
└── App.tsx            # Componente raiz
```

## 🔄 Próximos Passos (Backend)

1. **Integração Supabase**
   - Configurar autenticação
   - Criar tabelas do banco de dados
   - Implementar API routes

2. **Schemas do Banco**
   - `leads`: informações dos leads
   - `usuarios`: dados dos vendedores
   - `interacoes`: histórico de contatos
   - `cursos`: cursos disponíveis
   - `origens`: origens de lead

3. **Funcionalidades Avançadas**
   - Importação de leads via CSV
   - Exportação de relatórios (PDF/Excel)
   - Sistema de notificações
   - Alertas de leads sem contato
   - Atualização automática de temperatura

## 🎯 Notas de Desenvolvimento

### Mock Data
- Todos os dados são mockados com comentário `// TODO: remove mock functionality`
- Fácil identificação para remoção na integração com backend
- Console.logs para demonstrar interatividade

### Responsividade
- Grid adaptativo em todas as páginas
- Mobile-first design
- Sidebar colapsável em telas menores

### Acessibilidade
- Todos os elementos interativos com data-testid
- Labels apropriados em formulários
- Contraste adequado de cores

## 📱 Navegação

- `/` - Dashboard Gerencial
- `/leads` - Painel de Leads
- `/lead/:id` - Detalhes do Lead
- `/cursos` - Gerenciamento de Cursos
- `/configuracoes` - Configurações do Sistema
- `/login` - Tela de Login

## 🚀 Como Executar

```bash
npm install
npm run dev
```

O sistema estará disponível em `http://localhost:5000`
