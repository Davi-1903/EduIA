# Requisitos Não Funcionais

## 1. Tecnologias

| Código   | Requisito                | Funcionalidade                                                                                                                   | Propriedade | Status                 |
| :------: | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------- | ----------- | ---------------------- |
| **NF01** | Usar `Python`            | Linguagem usada no `back-end`                                                                                                    | Essencial   | 🔧 Em desenvolvimento |
| **NF02** | Usar `Flask`             | MicroFrameWork `python` usado na integração com o `front-end` e `back-end`                                                       | Essencial   | 🔧 Em desenvolvimento |
| **NF03** | Usar `HTML`              | Linguagem de marcação de hiper-textos utilizada na construção do site                                                            | Essencial   | 🔧 Em desenvolvimento |
| **NF04** | Usar `CSS`               | Linguagem utilizada na estilização do site                                                                                       | Essencial   | 🔧 Em desenvolvimento |
| **NF05** | Usar `ReactJS`           | Biblioteca `JavaScript` para a criação de interfaces                                                                             | Essencial   | 🔧 Em desenvolvimento |
| **NF06** | Usar `MySQL`             | Tipo de banco de dados relacional utilizado para armazenar informações                                                           | Essencial   | 🔧 Em desenvolvimento |
| **NF07** | Usar `Git` e `GitHub`    | Ferramentas utilizadas para versionamento e compartilhamento do projeto para melhorar e otimizar o desenvolvimento da plataforma | Importante  | 🔧 Em desenvolvimento |
| **NF08** | Usar `Figma`             | Plataforma utilizada na criação do design das páginas antes na estilização com CSS                                               | Importante  | 🔧 Em desenvolvimento |
| **NF09** | Usar `LangChain`         | Framework para integrar a API da LLM                                                                                             | Essencial   | ⏳ Planejando         |
| **NF10** | Usar `GPT-5 nano`        | API para integração com o modelo de linguagem `OpenAI`                                                                           | Essencial   | ⏳ Planejando         |
<!-- | **RNT07** | Usar `Docker`         | Plataforma utilizada para containerização e gerenciamento de ambientes de desenvolvimento                                        | ⏳ Planejando         | -->

## 2. Performance

| Código   | Requisito                                             | Propriedade | Status                 |
| :------: | ----------------------------------------------------- | ----------- | -----------------------|
| **NF11** | Usar geração aumentada de recuperação (**RAG**)       | Essencial   | 🔧 Em desenvolvimento |
| **NF12** | Resposta em até 2 segundos para 95% das requisições   | Importante  | ⏳ Planejando         |
| **NF13** | Resposta em até 5 segundos para 99% das requisições   | Importante  | ⏳ Planejando         |
| **NF14** | Resposta em até 10 segundos para 100% das requisições | Importante  | ⏳ Planejando         |

## 3. Escalabilidade

| Código   | Requisito                                 | Propriedade | Status                 |
| :------: | ----------------------------------------- | ----------- | ---------------------- |
| **NF15** | Suporte mínimo de 50 usuários simultâneos | Importante  | 🔧 Em desenvolvimento |
| **NF16** | Suporte para 100 usuários simultâneos     | Desejável   | ⏳ Planejando         |
| **NF17** | Suporte para 500 usuários simultâneos     | Desejável   | ⏳ Planejando         |
| **NF18** | Suporte para 1000 usuários simultâneos    | Desejável   | ⏳ Planejando         |

## 4. Confiabilidade

| Código   | Requisito    | Propriedade | Status                 |
| :------: | ------------ | ----------- | ---------------------- |
| **NF19** | Logs de erro | Desejável   | 🔧 Em desenvolvimento |

## 5. Segurança

| Código   | Requisito                                                        | Propriedade | Status                 |
| :------: | ---------------------------------------------------------------- | ----------- | ---------------------- |
| **NF20** | Implementar criptografia SSL/TLS para todas as comunicações      | Importante  | ⏳ Planejando         |
| **NF21** | Armazenar senhas utilizando hashing seguro com `Argon2`          | Importante  | 🔧 Em desenvolvimento |
| **NF22** | Implementar autenticação multifator (MFA) para acessos sensíveis | Desejável   | ⏳ Planejando         |

## 6. Privacidade

| Código   | Requisito                                   | Propriedade | Status                 |
| :------: | ------------------------------------------- | ----------- | ---------------------- |
| **NF23** | Permitir que os usuários excluam seus dados | Essencial   | 🔧 Em desenvolvimento |

## 7. Usabilidade

| Código   | Requisito                                       | Propriedade | Status                 |
| :------: | ----------------------------------------------- | ----------- | ---------------------- |
| **NF24** | Interface intuitiva e fácil de navegar          | Importante  | 🔧 Em desenvolvimento |
| **NF25** | Compatível com dispositivos móveis (responsivo) | Importante  | 🔧 Em desenvolvimento |

## 8. Manutenibilidade

| Código   | Requisito                        | Propriedade | Status                 |
| :------: | -------------------------------- | ----------- | ---------------------- |
| **NF26** | Código documentado e comentado   | Importante  | 🔧 Em desenvolvimento |
| **NF27** | Estrutura modular e reutilizável | Importante  | 🔧 Em desenvolvimento |

## 9. Custo operacional

| Código   | Requisito                                                            | Propriedade | Status                 |
| :------: | -------------------------------------------------------------------- | ----------- | ---------------------- |
| **NF28** | Utilizar serviços em nuvem com custo-benefício (ex: AWS, GCP, Azure) | Desejável   | ⏳ Planejando         |
| **NF29** | Monitorar e otimizar o uso de recursos para minimizar custos         | Importante  | 🔧 Em desenvolvimento |

## 10. Páginas

| Código   | Página            | Funcionalidade                                                                                  | Propriedade | Status                  |
| :------: | ----------------- | ----------------------------------------------------------------------------------------------- | ----------- | ----------------------- |
| **NF30** | Home              | Página inicial do site (Landing Page), para mostrar as funcionalidades                          | Essencial   | 🔧 Em desenvolvimento  |
| **NF31** | Login             | Autenticação do usuário                                                                         | Essencial   | 🔧 Em desenvolvimento  |
| **NF32** | Cadastro          | Registro de novos usuários                                                                      | Essencial   | 🔧 Em desenvolvimento  |
| **NF33** | Dashboard         | Área principal: criação e visualização de materiais, grupos, entre outras funcionalidades       | Essencial   | 🔧 Em desenvolvimento  |
| **NF34** | Perfil            | Visualização e edição do perfil do usuário                                                      | Essencial   | 🔧 Em desenvolvimento  |
| **NF35** | Históricos        | Visualização dos históricos do usuário                                                          | Essencial   | 🔧 Em desenvolvimento  |
| **NF36** | Sobre             | Informações sobre a plataforma                                                                  | Essencial   | 🔧 Em desenvolvimento  |
| **NF37** | Configurações     | Configurações do usuário e preferências da IA                                                   | Essencial   | 🔧 Em desenvolvimento  |
