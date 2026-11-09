# Autenticação SUAP no EduIA

Este documento descreve a configuração e o fluxo de login OAuth 2.0 do SUAP
implementado no EduIA. O login local por e-mail e senha permanece disponível.
Depois do OAuth, o EduIA autentica o usuário com a sessão de cookie do
Flask-Login; o token SUAP é usado somente pelo backend para consultar a
identidade.

## 1. Registrar a aplicação OAuth no SUAP

Cadastre uma aplicação OAuth no SUAP e configure a URL de callback exatamente
igual ao valor de `SUAP_REDIRECT_URI`. Para a execução padrão com Docker Compose
local, use:

```text
http://localhost:3000/api/auth/suap/callback
```

Em produção, use a URL HTTPS pública equivalente. O valor precisa coincidir
completo — protocolo, domínio, porta e caminho — no SUAP e na configuração do
EduIA. O servidor Vite também usa a porta `3000` por padrão; ao usar o preview
Vite em `4173`, ajuste o callback para
`http://localhost:4173/api/auth/suap/callback`.

## 2. Configurar as variáveis de ambiente

Copie `.env.example` para `.env` e preencha as credenciais emitidas pelo SUAP:

| Variável                    | Uso                                                             |
| --------------------------- | --------------------------------------------------------------- |
| `SUAP_CLIENT_ID`            | Identificador da aplicação OAuth                                |
| `SUAP_CLIENT_SECRET`        | Segredo da aplicação OAuth; mantenha-o apenas no backend        |
| `SUAP_REDIRECT_URI`         | Callback cadastrado no SUAP                                     |
| `SUAP_AUTHORIZATION_URL`    | Endpoint de autorização; por padrão, o endpoint IFRN            |
| `SUAP_TOKEN_URL`            | Endpoint de troca do código por token                           |
| `SUAP_PROFILE_URL`          | Endpoint de identidade principal consultado pelo backend        |
| `SUAP_PROFILE_FALLBACK_URL` | Endpoint alternativo de identidade                              |
| `SESSION_COOKIE_SECURE`     | Use `1` em produção com HTTPS; em desenvolvimento local use `0` |

Os três endpoints têm defaults voltados ao SUAP do IFRN, que também é a
referência usada pelo fluxo original. Se a instituição usar outros endpoints,
informe os valores correspondentes no ambiente. Não coloque `CLIENT_SECRET`
no frontend nem em arquivos versionados.

O callback é servido pelo mesmo host público da SPA através do proxy `/api/`.
Por isso, ele redireciona para `/dash` no sucesso e para `/login` em caso de
erro.

## 3. Aplicar a migração do banco

O modelo agora guarda a matrícula SUAP em `usuarios.suap_matricula`, com
restrição de unicidade. Como `Base.metadata.create_all()` não altera tabelas
existentes, faça backup e aplique uma única vez a migração antes de iniciar a
versão nova:

```bash
mysql -u <usuario> -p <banco> < server/migrations/20261104_add_suap_matricula.sql
```

No modo Docker, suba primeiro somente o banco (`docker compose up -d database`)
e execute a migração a partir de um cliente MySQL que alcance esse banco.

Para contas locais que devam ser usadas também com SUAP, um administrador pode
vincular a matrícula após verificar a identidade do titular:

```sql
UPDATE usuarios
SET suap_matricula = '<matricula-confirmada>'
WHERE id = <id-da-conta>;
```

Não associe contas automaticamente pelo e-mail: isso permitiria que a posse de
um e-mail informado no perfil conectasse uma identidade SUAP a uma conta local
sem confirmação adicional. Se o e-mail SUAP já estiver em uso e a matrícula
ainda não estiver vinculada, o login é recusado até que o administrador
confirme e faça a associação.

## 4. Iniciar e testar

Com as variáveis e a migração configuradas:

```bash
docker compose up --build
```

Abra `http://localhost:3000/login` e selecione **Entrar com SUAP**. Depois da
autorização, o usuário deve retornar à aplicação autenticado. O endpoint
`GET /api/user` pode ser usado para confirmar a sessão ativa.

Os caminhos locais do backend são:

- `GET /api/auth/suap/login`: cria `state` na sessão e redireciona ao SUAP.
- `GET /api/auth/suap/callback`: valida `state`, troca o código, consulta o
  perfil, cria ou recupera a conta e inicia a sessão Flask-Login.
- `GET /api/auth/csrf`: continua emitindo o token CSRF para operações da SPA.

## 5. Como o usuário é identificado

O backend usa a matrícula retornada no perfil SUAP como identificador estável.
Contas novas recebem um hash de senha aleatória, sem senha SUAP local. O tipo
de vínculo `Aluno` cria um usuário aluno; `Professor`, `Docente` e `Servidor`
criam um usuário professor, conforme os tipos suportados atualmente pelos
modelos do EduIA. Outros tipos de vínculo são recusados.

O e-mail institucional do perfil é armazenado como e-mail da conta. Se o perfil
não fornecer um e-mail válido, é usado o endereço não roteável
`<matricula>@suap.local`; ele não deve ser tratado como endereço de contato.
Para uma matrícula já vinculada, o backend mantém os dados da conta existente.

O token SUAP não é enviado à SPA nem persistido pelo fluxo de login. Se futuras
rotas precisarem consultar serviços SUAP depois do callback, implemente
armazenamento de tokens no backend com expiração e política explícita de
renovação; não use a sessão Flask do usuário como repositório de tokens
terceiros.

## 6. Sessão, CSRF e produção

- Flask-Login mantém a sessão EduIA em cookie `HttpOnly`.
- `SameSite=Lax` permite que o cookie acompanhe o retorno OAuth de navegação
  superior via `GET`.
- O callback valida o `state` aleatório, de uso único, antes de aceitar o
  código. Essa validação protege o fluxo OAuth.
- Flask-WTF continua protegendo as requisições que alteram estado
  (`POST`/`PATCH`/`DELETE`) com `X-CSRFToken`; o callback `GET` usa `state` e
  não deve desativar a proteção CSRF global.
- Em produção, use HTTPS, `SESSION_COOKIE_SECURE=1`, `SECRET_KEY` forte e
  mantenha o segredo OAuth fora do repositório. Configure `CORS_ORIGINS` com
  origens explícitas caso frontend e API sejam servidos por origens diferentes.

## 7. Diagnóstico

| Sintoma                              | Verificação                                                                                                       |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| Retorno para login com `unavailable` | Confira `SUAP_CLIENT_ID`, `SUAP_CLIENT_SECRET`, a conectividade e os endpoints configurados                       |
| `invalid_state`                      | Confirme que o navegador preserva cookies entre o início e o callback e que o callback é acessado pelo mesmo host |
| Erro de redirect no SUAP             | Compare o `SUAP_REDIRECT_URI` com a URL cadastrada, sem diferenças de barra, porta ou protocolo                   |
| `account_conflict`                   | Confirme a matrícula e, se apropriado, vincule-a manualmente a uma conta existente                                |
| `unsupported_user`                   | O tipo de vínculo retornado não corresponde a aluno ou servidor/docente suportado                                 |
| Erro SQL citando `suap_matricula`    | Aplique a migração do banco descrita acima                                                                        |
