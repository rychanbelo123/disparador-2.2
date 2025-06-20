# Instruções para Rodar Localmente

## Backend

1. Entre na pasta do backend:

```bash
cd backend
```

2. Instale as dependências:

```bash
npm install
```

3. Crie um arquivo `.env` na pasta `backend` com a variável:

```
STRIPE_SECRET_KEY=sk_test_your_stripe_key_here
ASAAS_API_KEY=your_asaas_api_key_here
PORT=3000
```

4. Rode o backend com hot reload:

```bash
npm run dev
```

O backend estará rodando em `http://localhost:3000`.

---

## Frontend

1. Na raiz do projeto frontend, crie um arquivo `.env` com:

```
VITE_BACKEND_URL=http://localhost:3000
```

2. Instale as dependências:

```bash
npm install
```

3. Rode o frontend:

```bash
npm run dev
```

O frontend estará disponível em `http://localhost:8080` (ou outra porta configurada).

---

## Observações

- Certifique-se de substituir as chaves `STRIPE_SECRET_KEY` e `ASAAS_API_KEY` pelas suas chaves reais.
- O frontend usa a variável `VITE_BACKEND_URL` para se comunicar com o backend.
- O backend expõe as rotas para verificar assinaturas via Stripe e Asaas.
- O dashboard só estará acessível para usuários com assinatura ativa.

Se precisar de ajuda, estou à disposição!