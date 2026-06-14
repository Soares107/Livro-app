# 📱 App Livros — React Native com Expo

Aplicativo mobile para gerenciamento de livros desenvolvido com **React Native + Expo**.

## 🚀 Instalação e Execução

### Pré-requisitos
- Node.js >= 18
- App **Expo Go** instalado no celular

### Passos

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd livro-app

# Instale as dependências
npm install

# Inicie o projeto
npx expo start
```

Escaneie o QR code com o **Expo Go** (Android) ou câmera (iOS).

> ⚠️ **Importante:** O celular e o computador devem estar na mesma rede Wi-Fi.
> Altere o IP em `services/api.ts`:
> ```ts
> const BASE_URL = 'http://SEU_IP_LOCAL:3000';
> ```
> Para ver seu IP rode `ipconfig` no terminal.

---

## ✨ Funcionalidades

- 📋 Listagem de todos os livros
- ➕ Cadastro de novo livro
- ✏️ Edição de livro existente
- 🗑️ Remoção com confirmação
- ✅ Marcação de lido/não lido
- 🔄 Pull-to-refresh

---

## 🗂️ Estrutura do Projeto

```
livro-app/
├── app/
│   ├── (tabs)/
│   │   └── index.tsx    ← lista de livros
│   └── modal.tsx        ← cadastro e edição
├── services/
│   └── api.ts           ← comunicação com o backend
├── package.json
└── README.md
```