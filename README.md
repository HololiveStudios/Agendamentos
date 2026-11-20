# Agendamentos - Plataforma de Agendamentos Online

## 1. Objetivo e Finalidade
Sistema web moderno para gestão e agendamento de atendimentos, eventos e compromissos com interface responsiva e interativa.

## 2. Tecnologias Utilizadas
- React 19, TypeScript, Vite, Tailwind CSS, Radix UI (@radix-ui/react-dialog, @radix-ui/react-switch), Lucide React, React Hook Form, Zod

## 3. Arquitetura e Estrutura de Diretórios
Frontend SPA desenvolvido em React com Vite. Arquitetura orientada a componentes com Tailwind CSS e shadcn/ui primitives. Código-fonte estruturado em `src/` (componentes, hooks, tipos e páginas).

## 4. Principais Arquivos e Responsabilidades
- `src/App.tsx`: Componente raiz com layout e controle de fluxos.
- `src/main.tsx`: Ponto de entrada da aplicação React.
- `vite.config.ts`: Configurações de build e plugins Vite.
- `package.json`: Definição de dependências e scripts do ecossistema Node.js.

## 5. Funcionalidades Identificadas
- Visualização e seleção de datas e horários disponíveis
- Cadastro e confirmação de agendamentos
- Formulários com validação via Zod e React Hook Form
- Interface modularizada com componentes acessíveis Radix UI

## 6. Como Compilar ou Executar
```bash
npm install
npm run dev
# Build de produção: npm run build
```

## 7. Estado Atual do Projeto
**Completo**

## 8. Pendências e Limitações Identificadas
Integração com backend de persistência e autenticação de usuários.
