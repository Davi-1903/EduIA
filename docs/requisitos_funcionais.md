# Requisitos Funcionais

## 1. Cadastro e autenticação

| Código   | Requisito                                                                         | Propriedade | Status                 |
| :------: | --------------------------------------------------------------------------------- | ----------- | ---------------------- |
| **RF01** | Verificar ser discente ou docente do IF                                           | Importante  | 🔧 Em desenvolvimento |
| **RF02** | Fazer integração com API do SUAP                                                  | Importante  | 🔧 Em desenvolvimento |
| **RF03** | Possibilitar que o usuário opte entre uma conta de professor e uma conta de aluno | Essencial   | 🔧 Em desenvolvimento |
| **RF04** | O usuário poderá criar uma conta com nome, email e senha                          | Essencial   | 🔧 Em desenvolvimento |
| **RF05** | O usuário poderá fazer login com email e senha cadastrados                        | Essencial   | 🔧 Em desenvolvimento |
| **RF06** | O sistema permitirá a recuperação de senhas                                       | Importante  | 🔧 Em desenvolvimento |
| **RF07** | O usuário poderá fazer logout                                                     | Essencial   | 🔧 Em desenvolvimento |
<!-- O RF01 e RF02 nós vamos deixar de lado por enquanto. No finalinho do projeto nós os implementaríamos -->

## 2. Configuração dos perfis

| Código   | Requisito                                                                                               | Propriedade | Status                 |
| :-----:  | ------------------------------------------------------------------------------------------------------- | ----------- | ---------------------- |
| **RF08** | O usuário poderá editar seu próprio perfil                                                              | Essencial   | 🔧 Em desenvolvimento |
| **RF09** | O usuário poderá habilitar a memória da IA                                                              | ... | ⏳ Planejando         |
| **RF10** | O usuário poderá especificar como deseja o comportamento da IA (mais visual, mais leitura, mais testes) | ... | ⏳ Planejando         |
| **RF11** | O usuário poderá excluir a conta                                                                        | Essencial   | 🔧 Em desenvolvimento |
<!-- Não sei se RF11 é sobre configuração de perfis, mas ok -->

## 3. Geração de materiais com IA

| Código   | Requisito                              | Como funcionará                                                                                                 | Módulo    | Propriedade | Status                 |
| :------: | -------------------------------------- | --------------------------------------------------------------------------------------------------------------- | --------- | ----------- | ---------------------- |
| **RF12** | Gerar Questões                         | Listas de exercícios com quantidade e nível especificados pelo usuário                                          | Ambos     | Essencial   | 🔧 Em desenvolvimento |
| **RF13** | Gerar Formulários                      | Formulários objetivos com quantidade e nível especificados pelo usuário                                         | Professor | Essencial   | 🔧 Em desenvolvimento |
| **RF14** | Gerar Quiz                             | Quizzes com pontuação e tempo estabelecidos pelo usuário                                                        | Ambos     | Importante  | 🔧 Em desenvolvimento |
| **RF15** | Gerar Flashcards                       | Cartões com perguntas simples e suas respostas                                                                  | Aluno     | Essencial   | 🔧 Em desenvolvimento |
| **RF16** | Gerar Resumos                          | Resumo de um determinado assunto ou matéria                                                                     | Ambos     | Importante  | 🔧 Em desenvolvimento |
| **RF17** | Gerar Explicações                      | Explicação de um assunto ou matéria para diferentes níveis, podendo usar analogias e demonstrar aplicações      | Ambos     | Essencial   | 🔧 Em desenvolvimento |
| **RF18** | Gerar Exercícios guiados               | Questões já respondidas, com passo a passo e explicações detalhadas                                             | Ambos     | Essencial   | 🔧 Em desenvolvimento |
| **RF19** | Gerar Planos de aula                   | Base do que deve ser abordado na aula em questão                                                                | Professor | Essencial   | 🔧 Em desenvolvimento |
| **RF20** | Gerar Mapas mentais                    | Arquivos em PNG ou PDF                                                                                          | Aluno     | ... | ⏳ Planejando         |
| **RF21** | Gerar Mapas conceituais                | Arquivos em PNG ou PDF                                                                                          | Aluno     | ... | ⏳ Planejando         |
| **RF22** | Gerar Roteiros de estudo               | Contém o que deve ser estudado e em qual sequência                                                              | Aluno     | Essencial   | 🔧 Em desenvolvimento |
| **RF23** | Gerar Desafios                         | Desafios para cada assunto ou matéria                                                                           | Ambos     | Importante  | 🔧 Em desenvolvimento |

## 4. Gerenciamento de materiais

| Código   | Requisito                                                        | Propriedade | Status                 |
| :------: | ---------------------------------------------------------------- | ----------- | ---------------------- |
| **RF24** | Permitir salvar materiais criados                                | Essencial   | 🔧 Em desenvolvimento |
| **RF25** | Proporcionar a organização dos materiais por disciplinas         | ... | ⏳ Planejando         |
| **RF26** | Permitir a visualização dos materiais diretamente pelo navegador | Importante  | 🔧 Em desenvolvimento |
| **RF27** | Permitir o download dos materiais gerados (PDFs, imagens, etc.)  | Importante  | 🔧 Em desenvolvimento |
| **RF28** | Permitir buscar materiais por palavra-chave                      | ... | ⏳ Planejando         |

## 5. Criação de grupos (Sugestão futura)

| Código   | Requisito                                   | Propriedade | Status                 |
| :------: | ------------------------------------------- | ----------- | ---------------------- |
| **RF29** | Criar grupos entre professores              | ... | ⏳ Planejando         |
| **RF30** | Criar grupos entre professores e alunos     | ... | ⏳ Planejando         |
| **RF31** | Criar grupos entre alunos                   | ... | ⏳ Planejando         |
| **RF32** | Disponibilizar chats para comunicação       | ... | ⏳ Planejando         |
