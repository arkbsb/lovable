# 🚀 Como Executar o Gita Control-Ads no Replit

## 📋 Pré-requisitos

1. **Conta no Replit** (gratuita ou paga)
2. **Projeto Supabase** configurado
3. **Credenciais do Supabase** (URL e chave anônima)

## 🔧 Configuração Inicial

### 1. Importar o Projeto no Replit

1. Acesse [replit.com](https://replit.com)
2. Clique em **"Create Repl"**
3. Selecione **"Import from GitHub"** ou **"Upload folder"**
4. Faça upload dos arquivos do projeto

### 2. Estrutura de Pastas no Replit

```
gita-control-ads/
├── frontend/          # Aplicação React
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── backend/           # API Flask
│   ├── src/
│   ├── requirements.txt
│   └── main.py
└── README.md
```

### 3. Configurar o Backend (Flask)

#### 3.1. Instalar Dependências Python
```bash
cd backend
pip install -r requirements.txt
```

#### 3.2. Configurar Variáveis de Ambiente
No Replit, vá em **Secrets** (ícone de cadeado) e adicione:

```
SUPABASE_URL=https://bepkixkvoxekafvuyxks.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlcGtpeGt2b3hla2FmdnV5eGtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2NjQ3MzQsImV4cCI6MjA2MjI0MDczNH0.67es9w2SCE7yUBYGLaEiTc2tUiiPk9-G8M0UeCdaOcw
```

#### 3.3. Atualizar Configuração do Supabase
Edite o arquivo `backend/src/config/supabase_config.py`:

```python
import os
from supabase import create_client, Client

# Usar variáveis de ambiente do Replit
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_ANON_KEY = os.getenv('SUPABASE_ANON_KEY')

def get_supabase_client() -> Client:
    return create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
```

### 4. Configurar o Frontend (React)

#### 4.1. Instalar Dependências Node.js
```bash
cd frontend
npm install
```

#### 4.2. Configurar Variáveis de Ambiente
Crie o arquivo `frontend/.env`:

```
VITE_API_URL=https://seu-repl-name.seu-usuario.repl.co/api
```

#### 4.3. Atualizar Configuração da API
Edite `frontend/src/config/api.js` (se existir) ou crie:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default API_BASE_URL
```

## 🏃‍♂️ Executando o Sistema

### Opção 1: Executar Separadamente

#### Terminal 1 - Backend:
```bash
cd backend
python src/main.py
```

#### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

### Opção 2: Script de Inicialização Único

Crie o arquivo `start.sh` na raiz:

```bash
#!/bin/bash

# Iniciar backend em background
cd backend && python src/main.py &

# Aguardar backend inicializar
sleep 5

# Iniciar frontend
cd frontend && npm run dev
```

Torne executável:
```bash
chmod +x start.sh
./start.sh
```

### Opção 3: Usando o arquivo .replit

Crie o arquivo `.replit` na raiz:

```toml
run = "bash start.sh"

[nix]
channel = "stable-22_11"

[env]
PATH = "/home/runner/$REPL_SLUG/.config/npm/node_global/bin:/home/runner/$REPL_SLUG/node_modules/.bin"
npm_config_prefix = "/home/runner/$REPL_SLUG/.config/npm/node_global"

[gitHubImport]
requiredFiles = [".replit", "replit.nix"]

[languages]

[languages.javascript]
pattern = "**/{*.js,*.jsx,*.ts,*.tsx,*.json}"

[languages.javascript.languageServer]
start = "typescript-language-server --stdio"

[languages.python]
pattern = "**/*.py"

[languages.python.languageServer]
start = "pylsp"

[deployment]
run = ["sh", "-c", "bash start.sh"]
```

## 🗄️ Configuração do Banco de Dados

### 1. Executar Schema no Supabase

1. Acesse seu projeto no [Supabase](https://supabase.com)
2. Vá em **SQL Editor**
3. Execute o conteúdo do arquivo `database_schema.sql`

### 2. Verificar Conexão

Teste a conexão executando no terminal do backend:

```python
from src.config.supabase_config import get_supabase_client

client = get_supabase_client()
result = client.table('projetos').select('*').execute()
print("Conexão OK:", len(result.data), "projetos encontrados")
```

## 🌐 Acessando o Sistema

### URLs no Replit

- **Frontend**: `https://seu-repl-name.seu-usuario.repl.co`
- **Backend API**: `https://seu-repl-name.seu-usuario.repl.co/api`

### Portas Padrão

- **Frontend (Vite)**: 5173
- **Backend (Flask)**: 5000

## 🔧 Configurações Específicas do Replit

### 1. Arquivo replit.nix

```nix
{ pkgs }: {
  deps = [
    pkgs.nodejs-18_x
    pkgs.python310Full
    pkgs.python310Packages.pip
    pkgs.python310Packages.setuptools
  ];
}
```

### 2. Configurar CORS para Replit

No arquivo `backend/src/main.py`, certifique-se de que o CORS está configurado:

```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["*"])  # Para desenvolvimento
```

### 3. Configurar Host e Porta

```python
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
```

## 🚨 Troubleshooting

### Problema: "Module not found"
**Solução**: Reinstale as dependências
```bash
cd backend && pip install -r requirements.txt
cd frontend && npm install
```

### Problema: "CORS Error"
**Solução**: Verifique se o CORS está habilitado no Flask e se a URL da API está correta no frontend.

### Problema: "Supabase connection failed"
**Solução**: 
1. Verifique as variáveis de ambiente no Replit Secrets
2. Confirme se as credenciais estão corretas
3. Teste a conexão manualmente

### Problema: "Port already in use"
**Solução**: 
1. Pare todos os processos: `pkill -f python` e `pkill -f node`
2. Reinicie o Repl

## 📱 Testando Funcionalidades

### 1. Teste Básico
1. Acesse o frontend
2. Navegue entre as páginas (Dashboard, Projetos, Conteúdos, Campanhas, Analytics)
3. Crie um projeto de teste
4. Adicione um conteúdo
5. Verifique se os dados aparecem no dashboard

### 2. Teste de API
```bash
curl https://seu-repl-name.seu-usuario.repl.co/api/projetos
```

### 3. Teste de Banco
1. Vá em Analytics
2. Selecione um projeto
3. Clique em "Gerar Análise"
4. Verifique se as sugestões aparecem

## 🔄 Atualizações e Manutenção

### Backup dos Dados
```bash
# Exportar dados do Supabase
curl -X GET "https://bepkixkvoxekafvuyxks.supabase.co/rest/v1/projetos" \
  -H "apikey: SUA_CHAVE" > backup_projetos.json
```

### Logs de Debug
```bash
# Backend logs
tail -f backend/logs/app.log

# Frontend logs (no console do navegador)
# Pressione F12 > Console
```

## 🎯 Próximos Passos

1. **Personalizar** as cores e branding
2. **Adicionar** dados reais dos seus projetos
3. **Configurar** alertas e notificações
4. **Integrar** com Meta Ads API (futuro)
5. **Exportar** relatórios em PDF

---

**🎉 Parabéns!** Seu sistema Gita Control-Ads está rodando no Replit!

Para suporte adicional, consulte a documentação completa em `GITA_CONTROL_ADS_DOCUMENTACAO.md`.

