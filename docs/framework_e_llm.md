# Framework e LLM

Este documento tem como objetivo explicar qual **framework** e **LLM** foram escolhidas para o projeto e o porquê.

## Framework

O framework é uma ferramenta utilizada para facilitar o trabalho dos desenvolvedores, evitando construir tudo do zero. O framework em questão é o **LangChain**, um framework de IA (Inteligência Artificial).

O **LangChain** foi um dos primeiros frameworks a surgirem após a grande popularização das IAs. Ele, por ser um dos mais famosos, oferece diversas ferramentas para lidar com os modelos de linguagem. Outro ponto importante e que deve ser levado em consideração é que, pela sua popularidade, não é difícil encontrar tutoriais e minicursos de como usá-lo.

No EduIA, o LangChain conecta as etapas de geração: um prompt recebe os dados fornecidos pelo usuário, o modelo produz a resposta e um parser organiza o resultado em JSON. A cadeia também configura novas tentativas caso ocorram falhas durante a chamada ao modelo.

## LLM

As **LLMs** (_Large Language Models_), ou modelos de linguagem de grande escala, são modelos treinados com grandes volumes de texto para compreender instruções e gerar conteúdo. O EduIA acessa um modelo hospedado no **Hugging Face**; seu identificador é configurado pela variável de ambiente `HF_MODEL`. A configuração de exemplo do projeto utiliza `Qwen/Qwen2.5-72B-Instruct`. Os limites de geração também podem ser ajustados pela variável `MAX_TOKENS`.

## RAG

**RAG** (_Retrieval-Augmented Generation_, ou geração aumentada por recuperação) é uma técnica que combina busca de informações com geração por uma LLM. Antes de formular a resposta, a aplicação recupera trechos relevantes de uma coleção de documentos e os fornece ao modelo como contexto. Isso pode tornar as respostas mais alinhadas a fontes específicas e atualizadas, sem precisar treinar novamente o modelo.

Em geral, um sistema RAG prepara e indexa os documentos, busca os trechos relacionados à pergunta e acrescenta esses trechos ao prompt enviado à LLM. O resultado depende da qualidade dos documentos e da busca, e o modelo ainda pode interpretar incorretamente o contexto.
