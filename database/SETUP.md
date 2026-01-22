# 🗄️ Database Setup Guide
## PostgreSQL

Este guia vai te ajudar a configurar o PostgreSQL para desenvolvimento.

---

## 📋 Opções de Instalação

Você tem 3 opções para rodar o PostgreSQL:

| Opção | Prós | Contras |
|-------|------|---------|
| **Docker** (Recomendado) | Fácil, isolado, reproduzível | Precisa do Docker |
| **Instalação local** | Performance nativa | Polui o sistema |
| **Serviço cloud** | Zero manutenção | Custo, latência |

---

## 🐳 Opção 1: PostgreSQL com Docker (Recomendado)

### 1. Criar docker-compose.yml

```bash
cd /root/projects/meu-site-pessoal/database
```

Crie o arquivo `docker-compose.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: meu-site-pessoal-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres123
      POSTGRES_DB: meusitepessoal
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init:/docker-entrypoint-initdb.d  # Scripts de inicialização
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Interface gráfica para gerenciar o banco (opcional)
  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: meu-site-pessoal-pgadmin
    restart: unless-stopped
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@admin.com
      PGADMIN_DEFAULT_PASSWORD: admin123
    ports:
      - "5050:80"
    depends_on:
      - postgres

volumes:
  postgres_data:
```

### 2. Subir os containers

```bash
# Subir em background
docker compose up -d

# Ver logs
docker compose logs -f postgres

# Verificar se está rodando
docker ps
```

### 3. Acessar o banco

```bash
# Via terminal (psql)
docker exec -it meu-site-pessoal-db psql -U postgres -d meusitepessoal

# Via pgAdmin (navegador)
# Acesse: http://localhost:5050
# Login: admin@admin.com / admin123
# Adicione servidor: host=postgres, port=5432, user=postgres, password=postgres123
```

### 4. Comandos úteis Docker

```bash
# Parar containers
docker compose down

# Parar e remover volumes (APAGA DADOS!)
docker compose down -v

# Reiniciar
docker compose restart

# Ver logs em tempo real
docker compose logs -f
```

---

## 💻 Opção 2: Instalação Local

### 1. Instalar PostgreSQL

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib -y

# Verificar instalação
psql --version
```

### 2. Iniciar o serviço

```bash
# Iniciar
sudo systemctl start postgresql

# Habilitar início automático
sudo systemctl enable postgresql

# Verificar status
sudo systemctl status postgresql
```

### 3. Configurar usuário e banco

```bash
# Acessar como usuário postgres
sudo -u postgres psql

# Dentro do psql, execute:
```

```sql
-- Criar banco de dados
CREATE DATABASE meusitepessoal;

-- Criar usuário (opcional, pode usar o postgres)
CREATE USER meusite WITH ENCRYPTED PASSWORD 'sua_senha_aqui';

-- Dar permissões
GRANT ALL PRIVILEGES ON DATABASE meusitepessoal TO meusite;

-- Sair
\q
```

### 4. Testar conexão

```bash
psql -h localhost -U postgres -d meusitepessoal
```

---

## 📊 Estrutura Inicial do Banco

### 5. Criar script de inicialização

Crie a pasta e arquivo:

```bash
mkdir -p /root/projects/meu-site-pessoal/database/init
```

Crie `init/01-schema.sql`:

```sql
-- ===========================================
-- Schema inicial do banco de dados
-- Meu Site Pessoal
-- ===========================================

-- Extensões úteis
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela: Projetos do portfólio
CREATE TABLE IF NOT EXISTS projetos (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    tecnologias VARCHAR(500),
    url_github VARCHAR(500),
    url_demo VARCHAR(500),
    imagem_url VARCHAR(500),
    destaque BOOLEAN DEFAULT false,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: Habilidades/Skills
CREATE TABLE IF NOT EXISTS habilidades (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    categoria VARCHAR(50), -- 'frontend', 'backend', 'database', 'devops', etc
    nivel INTEGER CHECK (nivel >= 1 AND nivel <= 5), -- 1-5
    icone VARCHAR(100),
    ordem INTEGER DEFAULT 0
);

-- Tabela: Experiências profissionais
CREATE TABLE IF NOT EXISTS experiencias (
    id SERIAL PRIMARY KEY,
    empresa VARCHAR(255) NOT NULL,
    cargo VARCHAR(255) NOT NULL,
    descricao TEXT,
    data_inicio DATE NOT NULL,
    data_fim DATE, -- NULL = emprego atual
    tecnologias VARCHAR(500),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: Formação acadêmica
CREATE TABLE IF NOT EXISTS formacoes (
    id SERIAL PRIMARY KEY,
    instituicao VARCHAR(255) NOT NULL,
    curso VARCHAR(255) NOT NULL,
    tipo VARCHAR(50), -- 'graduacao', 'pos', 'curso', 'certificacao'
    data_inicio DATE,
    data_fim DATE,
    descricao TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: Mensagens de contato
CREATE TABLE IF NOT EXISTS contatos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    assunto VARCHAR(255),
    mensagem TEXT NOT NULL,
    lido BOOLEAN DEFAULT false,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_projetos_destaque ON projetos(destaque);
CREATE INDEX IF NOT EXISTS idx_habilidades_categoria ON habilidades(categoria);
CREATE INDEX IF NOT EXISTS idx_contatos_lido ON contatos(lido);

-- Trigger para atualizar 'atualizado_em' automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projetos_updated_at 
    BEFORE UPDATE ON projetos 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

Crie `init/02-seed.sql` (dados de exemplo):

```sql
-- ===========================================
-- Dados de exemplo para desenvolvimento
-- ===========================================

-- Projetos de exemplo
INSERT INTO projetos (titulo, descricao, tecnologias, destaque) VALUES
('Meu Site Pessoal', 'Portfólio pessoal desenvolvido com Next.js e Spring Boot', 'Next.js, React, TypeScript, Kotlin, Spring Boot, PostgreSQL', true),
('API REST', 'API completa com autenticação JWT', 'Kotlin, Spring Boot, PostgreSQL', false),
('Dashboard Admin', 'Painel administrativo com gráficos', 'React, TypeScript, Tailwind CSS', false);

-- Habilidades de exemplo
INSERT INTO habilidades (nome, categoria, nivel, ordem) VALUES
('React', 'frontend', 4, 1),
('TypeScript', 'frontend', 4, 2),
('Next.js', 'frontend', 3, 3),
('Tailwind CSS', 'frontend', 4, 4),
('Kotlin', 'backend', 3, 5),
('Spring Boot', 'backend', 3, 6),
('PostgreSQL', 'database', 3, 7),
('Docker', 'devops', 3, 8),
('Git', 'devops', 4, 9);

-- Mensagem de contato de exemplo
INSERT INTO contatos (nome, email, assunto, mensagem) VALUES
('Visitante Teste', 'teste@exemplo.com', 'Olá!', 'Esta é uma mensagem de teste do sistema.');
```

---

## 🔧 Comandos SQL Úteis

### Conectar ao banco

```bash
# Docker
docker exec -it meu-site-pessoal-db psql -U postgres -d meusitepessoal

# Local
psql -h localhost -U postgres -d meusitepessoal
```

### Comandos psql

```sql
-- Listar bancos
\l

-- Conectar a um banco
\c meusitepessoal

-- Listar tabelas
\dt

-- Descrever tabela
\d projetos

-- Listar usuários
\du

-- Sair
\q
```

### Queries úteis

```sql
-- Ver todos os projetos
SELECT * FROM projetos;

-- Ver projetos em destaque
SELECT * FROM projetos WHERE destaque = true;

-- Contar registros
SELECT COUNT(*) FROM contatos WHERE lido = false;

-- Backup (no terminal, fora do psql)
-- pg_dump -U postgres meusitepessoal > backup.sql

-- Restore
-- psql -U postgres meusitepessoal < backup.sql
```

---

## 🔐 Informações de Conexão

### Para o Backend (application.yml)

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/meusitepessoal
    username: postgres
    password: postgres123  # Mude em produção!
```

### String de conexão

```
postgresql://postgres:postgres123@localhost:5432/meusitepessoal
```

---

## 🐳 Preparando para Docker de Produção

O banco de dados em produção deve:
1. Usar senhas fortes
2. Ter backups automáticos
3. Estar em rede isolada

Exemplo `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - backend-network
    # NÃO expor porta em produção!
    # O backend acessa via rede interna Docker

volumes:
  postgres_data:

networks:
  backend-network:
    external: true
```

---

## ✅ Checklist de Setup

- [ ] PostgreSQL rodando (Docker ou local)
- [ ] Banco `meusitepessoal` criado
- [ ] Consegue conectar via psql ou pgAdmin
- [ ] Scripts de inicialização criados
- [ ] Tabelas criadas
- [ ] Dados de exemplo inseridos
- [ ] Backend conectando no banco

---

## 📚 Recursos para Estudar

- [Documentação PostgreSQL](https://www.postgresql.org/docs/)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)
- [SQL Basics](https://www.w3schools.com/sql/)
- [Docker + PostgreSQL](https://hub.docker.com/_/postgres)
- [pgAdmin Docs](https://www.pgadmin.org/docs/)

---

## 🔄 Ordem de Inicialização

Quando for rodar o projeto completo:

1. **Primeiro:** Subir o banco de dados
   ```bash
   cd /root/projects/meu-site-pessoal/database
   docker compose up -d
   ```

2. **Segundo:** Rodar o backend
   ```bash
   cd /root/projects/meu-site-pessoal/backend
   ./gradlew bootRun
   ```

3. **Terceiro:** Rodar o frontend
   ```bash
   cd /root/projects/meu-site-pessoal/frontend
   npm run dev
   ```

---

**Parabéns!** Após configurar as 3 partes, você terá um ambiente fullstack completo! 🎉
