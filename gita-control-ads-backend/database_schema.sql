-- Schema para o sistema Gita Control-Ads
-- Este arquivo contém as definições das tabelas para o Supabase

-- Tabela de Projetos
CREATE TABLE IF NOT EXISTS projetos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    projecao_gasto_mensal DECIMAL(10,2),
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ativo BOOLEAN DEFAULT TRUE
);

-- Tabela de Conteúdos (C1, C2, C3, C4)
CREATE TABLE IF NOT EXISTS conteudos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    projeto_id UUID REFERENCES projetos(id) ON DELETE CASCADE,
    identificador VARCHAR(255) NOT NULL,
    tipo_conteudo VARCHAR(2) NOT NULL CHECK (tipo_conteudo IN ('C1', 'C2', 'C3', 'C4')),
    
    -- Métricas gerais
    alcance INTEGER,
    engajamento INTEGER,
    valor_gasto DECIMAL(10,2),
    cpm DECIMAL(10,2),
    
    -- Métricas específicas para C1 (foco em seguidores)
    seguidores_antes INTEGER,
    seguidores_depois INTEGER,
    custo_por_seguidor DECIMAL(10,2),
    
    -- Métricas específicas para C2-C4 (foco em engajamento e reprodução)
    custo_por_engajamento DECIMAL(10,2),
    thruplay INTEGER,
    frequencia DECIMAL(5,2),
    reproducao_25_pct INTEGER,
    reproducao_50_pct INTEGER,
    reproducao_75_pct INTEGER,
    reproducao_95_pct INTEGER,
    reproducao_100_pct INTEGER,
    
    -- Datas
    data_inicio_impulsionamento DATE,
    data_fim_impulsionamento DATE,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    ativo BOOLEAN DEFAULT TRUE
);

-- Tabela de Campanhas (para C2-C4)
CREATE TABLE IF NOT EXISTS campanhas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    projeto_id UUID REFERENCES projetos(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    tipo_campanha VARCHAR(2) NOT NULL CHECK (tipo_campanha IN ('C2', 'C3', 'C4')),
    objetivo TEXT,
    
    -- Métricas da campanha
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
    data_fim DATE,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    ativo BOOLEAN DEFAULT TRUE
);

-- Tabela de relacionamento entre campanhas e conteúdos
CREATE TABLE IF NOT EXISTS campanha_conteudos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campanha_id UUID REFERENCES campanhas(id) ON DELETE CASCADE,
    conteudo_id UUID REFERENCES conteudos(id) ON DELETE CASCADE,
    data_associacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(campanha_id, conteudo_id)
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_conteudos_projeto_id ON conteudos(projeto_id);
CREATE INDEX IF NOT EXISTS idx_conteudos_tipo ON conteudos(tipo_conteudo);
CREATE INDEX IF NOT EXISTS idx_conteudos_data_inicio ON conteudos(data_inicio_impulsionamento);
CREATE INDEX IF NOT EXISTS idx_campanhas_projeto_id ON campanhas(projeto_id);
CREATE INDEX IF NOT EXISTS idx_campanhas_tipo ON campanhas(tipo_campanha);
CREATE INDEX IF NOT EXISTS idx_campanhas_data_inicio ON campanhas(data_inicio);

-- Triggers para atualizar data_atualizacao automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.data_atualizacao = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projetos_updated_at BEFORE UPDATE ON projetos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conteudos_updated_at BEFORE UPDATE ON conteudos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campanhas_updated_at BEFORE UPDATE ON campanhas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para calcular custo por seguidor automaticamente
CREATE OR REPLACE FUNCTION calculate_custo_por_seguidor()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.seguidores_antes IS NOT NULL AND NEW.seguidores_depois IS NOT NULL AND NEW.valor_gasto IS NOT NULL THEN
        IF (NEW.seguidores_depois - NEW.seguidores_antes) > 0 THEN
            NEW.custo_por_seguidor = NEW.valor_gasto / (NEW.seguidores_depois - NEW.seguidores_antes);
        ELSE
            NEW.custo_por_seguidor = NULL;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER calculate_custo_por_seguidor_trigger BEFORE INSERT OR UPDATE ON conteudos
    FOR EACH ROW EXECUTE FUNCTION calculate_custo_por_seguidor();

-- Função para calcular custo por engajamento automaticamente
CREATE OR REPLACE FUNCTION calculate_custo_por_engajamento()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.engajamento IS NOT NULL AND NEW.valor_gasto IS NOT NULL AND NEW.engajamento > 0 THEN
        NEW.custo_por_engajamento = NEW.valor_gasto / NEW.engajamento;
    ELSE
        NEW.custo_por_engajamento = NULL;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER calculate_custo_por_engajamento_trigger BEFORE INSERT OR UPDATE ON conteudos
    FOR EACH ROW EXECUTE FUNCTION calculate_custo_por_engajamento();

