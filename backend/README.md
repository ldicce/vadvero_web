
# Meeting System API

## Instalação e Configuração

### 1. Instalar dependências
```bash
cd backend
npm install
```

### 2. Configurar banco de dados
Certifique-se de que seu banco PostgreSQL no Neon tem as seguintes tabelas:

```sql
-- Tabela de entidades
CREATE TABLE entities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    cnpj VARCHAR(20) UNIQUE NOT NULL,
    cep VARCHAR(10) NOT NULL,
    address TEXT NOT NULL,
    neighborhood VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de usuários
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('admin', 'entity', 'user')) NOT NULL,
    entity_id INTEGER REFERENCES entities(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de departamentos
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    entity_id INTEGER REFERENCES entities(id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de reuniões
CREATE TABLE meetings (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    location VARCHAR(255) NOT NULL,
    president_name VARCHAR(255) NOT NULL,
    secretary_name VARCHAR(255) NOT NULL,
    is_online BOOLEAN DEFAULT FALSE,
    is_presential BOOLEAN DEFAULT TRUE,
    manual_voting BOOLEAN DEFAULT FALSE,
    voting_start TIMESTAMP,
    voting_end TIMESTAMP,
    description TEXT,
    entity_id INTEGER REFERENCES entities(id) NOT NULL,
    created_by INTEGER REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir dados de teste
INSERT INTO entities (name, email, cnpj, cep, address, neighborhood, city, state) VALUES
('Empresa Teste Ltda', 'contato@empresateste.com', '12.345.678/0001-90', '01234-567', 'Rua das Flores, 123', 'Centro', 'São Paulo', 'SP');

INSERT INTO users (name, email, password, role, entity_id) VALUES
('Administrador', 'admin@sistema.com', '123456', 'admin', NULL),
('Empresa Teste', 'empresa@teste.com', '123456', 'entity', 1);
```

### 3. Executar o servidor
```bash
npm run dev
```

O servidor estará rodando em http://localhost:3000

## Endpoints disponíveis

- POST `/api/auth/login` - Login de usuário
- GET `/api/entities` - Listar entidades
- POST `/api/entities` - Criar entidade
- PUT `/api/entities/:id` - Atualizar entidade
- DELETE `/api/entities/:id` - Excluir entidade
- GET `/api/departments/entity/:entityId` - Listar departamentos de uma entidade
- POST `/api/departments` - Criar departamento
- PUT `/api/departments/:id` - Atualizar departamento
- DELETE `/api/departments/:id` - Excluir departamento
