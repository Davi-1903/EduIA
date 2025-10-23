<div align='center'>
    <img src='client/public/logo.svg' loading='lazy' width='400' style='margin-bottom: -3rem' alt='Logo EduIA'>
    <h3>Sistema Inteligente de Apoio a Educação</h3>
</div>

---

## 📚 O que é o EduIA

O **EduIA** é um sistema de geração de materiais de estudo com **IA** (Inteligência Artificial), desenvolvido por estudantes do ensino médio técnico integrado do **IFRN** - campus Caicó. O sistema visa reduzir o tempo gasto por alunos e professores, gerando questões e planos de aula.

<!-- Imagem ou GIF do sistema -->

### 📖 Materiais gerados

O sistema gera diversos materiais que são distribuídos entre professores e alunos. Abaixo está uma tabela com todos os materiais que são gerados.

| Materiais              | Como funcionam                                                                                             |
| ---------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Questões**           | Listas de exercícios com quantidade e nível especificados pelo usuário                                     |
| **Formulários**        | Formulários objetivos com quantidade e nível especificados pelo usuário                                    |
| **Quiz**               | Quizzes com pontuação e tempo estabelecidos pelo usuário                                                   |
| **Flashcards**         | Cartões com perguntas simples e suas respostas                                                             |
| **Resumos**            | Resumo de um determinado assunto ou matéria                                                                |
| **Explicações**        | Explicação de um assunto ou matéria para diferentes níveis, podendo usar analogias e demonstrar aplicações |
| **Exercícios guiados** | Questões já respondidas, com passo a passo e explicações detalhadas                                        |
| **Planos de aula**     | Base do que deve ser abordado na aula em questão                                                           |
| **Roteiros de estudo** | Contém o que deve ser estudado e em qual sequência                                                         |
| **Desafios**           | Desafios para cada assunto ou matéria                                                                      |

### ⚒️ Tecnologias

Devido à complexidade do sistema, foram necessárias mais de uma tecnologia para a elaboração. Abaixo está uma tabela com as tecnologias usadas.

> [!NOTE]
> Para mais detalhes, vá ao documento de [requisitos não funcionais](docs/requisitos_nao_funcionais.md).

| Tecnologia       | Funcionalidade                                                                                                                   |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `Flask`          | microframework `Python` usado na integração com o `front-end` e `back-end`                                                       |
| `ReactJS`        | Biblioteca `JavaScript` para a criação de interfaces                                                                             |
| `MySQL`          | Tipo de banco de dados relacional utilizado para armazenar informações                                                           |
| `LangChain`      | Framework para a orquestração da **LLM**                                                                                         |
| `GPT-5 nano`     | `API` para integração com o modelo de linguagem `OpenAI`                                                                         |

### 🧠 IA

A **IA** é o centro do projeto. Optamos por usar um modelo de linguagem pela sua capacidade de adaptação e generalização dos dados absorvidos durante o treinamento. Para que ela se adaptasse aos nossos dados, não a retreinamos; utilizamos **RAG** (Retrieval-Augmented Generation), ou geração aumentada de recuperação.

## 📄 Documentos

- [Requisitos Funcionais](docs/requisitos_funcionais.md)
- [Requisitos Não Funcionais](docs/requisitos_nao_funcionais.md)
- [Framework e LLM](docs/framework_e_llm.md)

## 😃 Contribuidores

- [Ana Cecilya](https://www.github.com/cecilya1)
- [Ana Clara](https://www.github.com/anaclaraa1)
- [Maria das Graças](https://www.github.com/mgdantas1)
- [Miguel Tavares](https://www.github.com/migueltvrs13)
