# Gita Control-Ads - Sistema de Gestão de Meta Ads

## 📋 Visão Geral

O **Gita Control-Ads** é um sistema completo para gestão e controle de gastos de distribuição de conteúdos no Meta Ads, com foco em atrair seguidores para perfis do Instagram. O sistema oferece uma interface moderna e intuitiva para gerenciar múltiplos projetos, acompanhar métricas detalhadas e receber sugestões inteligentes de otimização.

## 🎯 Funcionalidades Principais

### 1. Dashboard Inteligente
- **Visão geral consolidada** de todas as métricas importantes
- **Gráfico de custo por seguidor** ao longo do tempo
- **Filtros de data** (janeiro 2025 a dezembro 2030)
- **Tabela de melhores criativos** com cores dinâmicas por etapa do funil
- **Cards de métricas** com indicadores de performance

### 2. Gestão de Projetos
- **CRUD completo** para projetos
- **Projeção de gastos mensais** por projeto
- **Acompanhamento de orçamento** e performance
- **Interface intuitiva** com cards informativos

### 3. Gestão de Conteúdos (C1-C4)
- **Classificação por etapas do funil:**
  - **C1**: Atrair seguidores (foco em custo por seguidor)
  - **C2-C4**: Nutrir audiência (foco em engajamento)

#### Métricas para C1:
- Alcance, Engajamento, Seguidores antes/depois
- Data início/fim do impulsionamento
- Valor gasto, CPM
- **Cálculo automático do custo por seguidor**

#### Métricas para C2-C4:
- Engajamento, Custo por engajamento
- Alcance, ThruPlay, Frequência
- Valor gasto, Reproduções (25%, 50%, 75%, 95%, 100%)

### 4. Gestão de Campanhas (C2-C4)
- **Campanhas específicas** para nutrição da audiência
- **Métricas detalhadas** de performance
- **Agrupamento por objetivos** (Consciência, Consideração, Conversão)
- **Relacionamento com conteúdos**

### 5. Analytics & Sugestões Inteligentes
- **Análise automática** de performance por projeto
- **Sugestões personalizadas** baseadas em métricas
- **Identificação de oportunidades** de otimização
- **Alertas de performance** (frequência alta, custos elevados)
- **Recomendações específicas** para cada tipo de problema

## 🏗️ Arquitetura Técnica

### Frontend (React)
- **Framework**: React 18 com Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Roteamento**: React Router
- **Gráficos**: Recharts
- **Ícones**: Lucide React

### Backend (Flask)
- **Framework**: Flask com Python
- **CORS**: Habilitado para comunicação frontend-backend
- **Estrutura modular**: Blueprints para organização
- **Validação**: Tratamento de erros e validação de dados

### Banco de Dados (Supabase)
- **PostgreSQL** hospedado no Supabase
- **Tabelas principais**:
  - `projetos`: Gestão de projetos
  - `conteudos`: Conteúdos C1-C4 com métricas
  - `campanhas`: Campanhas C2-C4
  - `campanha_conteudos`: Relacionamento N:N

## 📊 Modelo de Dados

### Projetos
```sql
CREATE TABLE projetos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    projecao_gasto_mensal DECIMAL(10,2),
    data_criacao TIMESTAMP DEFAULT NOW()
);
```

### Conteúdos
```sql
CREATE TABLE conteudos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    projeto_id UUID REFERENCES projetos(id),
    identificador VARCHAR(255) NOT NULL,
    tipo_conteudo VARCHAR(2) CHECK (tipo_conteudo IN ('C1', 'C2', 'C3', 'C4')),
    -- Métricas C1
    alcance INTEGER,
    engajamento INTEGER,
    seguidores_antes INTEGER,
    seguidores_depois INTEGER,
    custo_por_seguidor DECIMAL(10,2),
    -- Métricas C2-C4
    custo_por_engajamento DECIMAL(10,2),
    thruplay INTEGER,
    frequencia DECIMAL(5,2),
    reproducao_25_pct INTEGER,
    reproducao_50_pct INTEGER,
    reproducao_75_pct INTEGER,
    reproducao_95_pct INTEGER,
    reproducao_100_pct INTEGER,
    -- Comuns
    data_inicio DATE,
    data_fim DATE,
    valor_gasto DECIMAL(10,2),
    cpm DECIMAL(10,2)
);
```

### Campanhas
```sql
CREATE TABLE campanhas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    projeto_id UUID REFERENCES projetos(id),
    nome VARCHAR(255) NOT NULL,
    tipo_campanha VARCHAR(2) CHECK (tipo_campanha IN ('C2', 'C3', 'C4')),
    objetivo TEXT,
    engajamento_total INTEGER,
    custo_por_engajamento DECIMAL(10,2),
    alcance_total INTEGER,
    thruplay_total INTEGER,
    frequencia_media DECIMAL(5,2),
    valor_gasto_total DECIMAL(10,2),
    reproducao_25_pct_total INTEGER,
    reproducao_50_pct_total INTEGER,
    reproducao_75_pct_total INTEGER,
    reproducao_95_pct_total INTEGER,
    reproducao_100_pct_total INTEGER,
    data_inicio DATE,
    data_fim DATE
);
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 20+
- Python 3.11+
- Conta no Supabase

### Configuração do Backend
```bash
cd gita-control-ads-backend
source venv/bin/activate
pip install -r requirements.txt

# Configurar variáveis de ambiente no arquivo src/config/supabase_config.py
SUPABASE_URL = "https://bepkixkvoxekafvuyxks.supabase.co"
SUPABASE_ANON_KEY = "sua_chave_anonima"

python src/main.py
```

### Configuração do Frontend
```bash
cd gita-control-ads-frontend
npm install
npm run dev
```

### Configuração do Banco de Dados
1. Execute o script `database_schema.sql` no seu projeto Supabase
2. Configure as credenciais no backend
3. Teste a conexão

## 📱 Interface do Usuário

### Design System
- **Cores principais**: Azul (#3B82F6), Verde (#10B981), Vermelho (#EF4444)
- **Tipografia**: Inter (sistema padrão)
- **Componentes**: shadcn/ui para consistência
- **Responsividade**: Mobile-first design

### Navegação
- **Sidebar responsiva** com ícones intuitivos
- **Breadcrumbs** para orientação
- **Estados de loading** e feedback visual
- **Modais** para ações importantes

## 🔧 APIs Disponíveis

### Projetos
- `GET /api/projetos` - Listar projetos
- `POST /api/projetos` - Criar projeto
- `PUT /api/projetos/{id}` - Atualizar projeto
- `DELETE /api/projetos/{id}` - Excluir projeto

### Conteúdos
- `GET /api/conteudos` - Listar conteúdos
- `POST /api/conteudos` - Criar conteúdo
- `PUT /api/conteudos/{id}` - Atualizar conteúdo
- `DELETE /api/conteudos/{id}` - Excluir conteúdo

### Campanhas
- `GET /api/campanhas` - Listar campanhas
- `POST /api/campanhas` - Criar campanha
- `PUT /api/campanhas/{id}` - Atualizar campanha
- `DELETE /api/campanhas/{id}` - Excluir campanha

### Analytics
- `POST /api/analytics/sugestoes` - Gerar sugestões
- `GET /api/analytics/metricas-projeto/{id}` - Métricas do projeto

## 🎨 Funcionalidades Especiais

### Cálculos Automáticos
- **Custo por seguidor**: `valor_gasto / (seguidores_depois - seguidores_antes)`
- **Custo por engajamento**: `valor_gasto / engajamento`
- **Taxa de retenção**: `(reproducao_100_pct / reproducao_25_pct) * 100`

### Sugestões Inteligentes
O sistema analisa automaticamente:
- Conteúdos C1 com custo por seguidor elevado
- Campanhas com frequência muito alta (>3.0)
- Baixa taxa de retenção em vídeos (<30%)
- Oportunidades de replicar melhores práticas

### Filtros e Ordenação
- **Por projeto**: Todos os módulos permitem filtrar por projeto
- **Por tipo**: C1, C2, C3, C4
- **Por data**: Período customizável
- **Por performance**: Melhores/piores resultados

## 🔒 Segurança

### Validação de Dados
- **Frontend**: Validação em tempo real
- **Backend**: Validação de tipos e ranges
- **Banco**: Constraints e checks

### Tratamento de Erros
- **Mensagens amigáveis** para o usuário
- **Logs detalhados** para debugging
- **Fallbacks** para casos de erro

## 📈 Métricas e KPIs

### Dashboard Principal
- **Total de Seguidores**: Soma de todos os seguidores ganhos
- **Custo por Seguidor Médio**: Média ponderada por projeto
- **Engajamento Total**: Soma de todos os engajamentos
- **Gasto Total**: Soma de todos os investimentos

### Por Projeto
- **ROI por projeto**: Retorno sobre investimento
- **Eficiência por tipo**: C1 vs C2-C4
- **Tendências temporais**: Performance ao longo do tempo

## 🚀 Próximos Passos

### Melhorias Futuras
1. **Integração direta** com Meta Ads API
2. **Relatórios em PDF** exportáveis
3. **Alertas automáticos** por email/WhatsApp
4. **Machine Learning** para previsões
5. **Comparação de concorrentes**
6. **Automação de campanhas**

### Otimizações
1. **Cache** de dados frequentes
2. **Paginação** para grandes volumes
3. **Compressão** de imagens
4. **PWA** para uso offline

## 📞 Suporte

Para dúvidas ou suporte técnico:
- **Documentação**: Este arquivo
- **Código fonte**: Comentários inline
- **Logs**: Console do navegador e servidor

## 📄 Licença

Sistema desenvolvido especificamente para gestão de Meta Ads com foco em crescimento de seguidores no Instagram.

---

**Versão**: 1.0.0  
**Data**: Janeiro 2025  
**Desenvolvido por**: Manus AI

