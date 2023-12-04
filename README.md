# Labook - Documentação do Projeto

## Descrição

O Labook é uma rede social desenvolvida utilizando NodeJS, Typescript, Express, SQL, SQLite, Knex, seguindo boas práticas de programação, arquitetura em camadas e princípios de Programação Orientada a Objetos (POO).

## Conteúdos Abordados

- NodeJS
- Typescript
- Express
- SQL e SQLite
- Knex
- POO
- Arquitetura em camadas
- Geração de UUID
- Geração de hashes
- Autenticação e autorização
- Roteamento
- Postman

## Requisitos

### Documentação Postman

Consulte o arquivo [ `Labook.postman_collection.json`](https://documenter.getpostman.com/view/28316317/2s9YeLXURv) para obter detalhes sobre os endpoints disponíveis e exemplos de requisições.

### Endpoints

## Exemplo no Postman

### 0. Obter Todos os Usuários (Apenas para Admins)

- **Requisição:**
    - `GET` para `/api/users`
    - Cabeçalho: `Authorization: seu_token_jwt`
- **Resposta Esperada (200 OK):**
    ```json
    [
        {
            "id": "uma_uuid_v4",
            "name": "Fulano",
            "email": "fulano@email.com",
            "createdAt": "2023-01-01T08:00:00.000Z",
            "updatedAt": "2023-01-20T14:30:00.000Z"
        },
        {
            "id": "outra_uuid_v4",
            "name": "Ciclano",
            "email": "ciclano@email.com",
            "createdAt": "2023-02-01T10:00:00.000Z",
            "updatedAt": "2023-02-20T16:45:00.000Z"
        }
        // Outros usuários...
    ]
    ```

1. **signup**
   - Rota: `/api/users/signup`
   - Método: `POST`
   - Descrição: Endpoint utilizado para cadastrar um novo usuário.
   - Corpo da Requisição:
     ```json
     {
         "name": "Nome do Usuário",
         "email": "email@example.com",
         "password": "senha123"
     }
     ```
   - Resposta:
     ```json
     {
         "token": "um_token_jwt"
     }
     ```

2. **login**
   - Rota: `/api/users/login`
   - Método: `POST`
   - Descrição: Endpoint utilizado para autenticar um usuário existente.
   - Corpo da Requisição:
     ```json
     {
         "email": "email@example.com",
         "password": "senha123"
     }
     ```
   - Resposta:
     ```json
     {
         "token": "um_token_jwt"
     }
     ```

3. **create post**
   - Rota: `/api/posts`
   - Método: `POST`
   - Descrição: Endpoint utilizado para criar uma nova publicação.
   - Cabeçalho:
     ```
     Authorization:um_token_jwt
     ```
   - Corpo da Requisição:
     ```json
     {
         "content": "Conteúdo da Publicação"
     }
     ```
   - Resposta:
     ```
     Status 201 CREATED
     ```

4. **get posts**
   - Rota: `/api/posts`
   - Método: `GET`
   - Descrição: Endpoint utilizado para obter todas as publicações.
   - Cabeçalho:
     ```
     Authorization:um_token_jwt
     ```
   - Resposta:
     ```json
     [
         {
             "id": "uma_uuid_v4",
             "content": "Conteúdo da Publicação",
             "likes": 2,
             "dislikes": 1,
             "createdAt": "2023-01-20T12:11:47.000Z",
             "updatedAt": "2023-01-20T12:11:47.000Z",
             "creator": {
                 "id": "uma_uuid_v4",
                 "name": "Nome do Criador"
             }
         },
         // Outras publicações...
     ]
     ```

5. **edit post**
   - Rota: `/api/posts/{id}`
   - Método: `PUT`
   - Descrição: Endpoint utilizado para editar uma publicação existente.
   - Cabeçalho:
     ```
     Authorization:um_token_jwt
     ```
   - Corpo da Requisição:
     ```json
     {
         "content": "Novo Conteúdo da Publicação"
     }
     ```
   - Resposta:
     ```
     Status 200 OK
     ```

6. **delete post**
   - Rota: `/api/posts/{id}`
   - Método: `DELETE`
   - Descrição: Endpoint utilizado para excluir uma publicação existente.
   - Cabeçalho:
     ```
     Authorization:um_token_jwt
     ```
   - Resposta:
     ```
     Status 200 OK
     ```

7. **like / dislike post**
   - Rota: `/api/posts/{id}/like`
   - Método: `PUT`
   - Descrição: Endpoint utilizado para dar like ou dislike em uma publicação.
   - Cabeçalho:
     ```
     Authorization:um_token_jwt
     ```
   - Corpo da Requisição (Like):
     ```json
     {
         "like": true
     }
     ```
   - Corpo da Requisição (Dislike):
     ```json
     {
         "like": false
     }
     ```
  - Resposta:
     ```
     Status 200 OK



###


# Labook - Instruções de Execução do Projeto

O Labook é um projeto NodeJS desenvolvido utilizando Typescript, Express, SQLite e Knex. Siga as instruções abaixo para configurar e executar o projeto em seu ambiente local.

## Pré-requisitos

Certifique-se de ter o NodeJS e o npm instalados em sua máquina. Você pode baixá-los em [https://nodejs.org/](https://nodejs.org/).

## Configuração do Projeto

1. Clone o repositório para sua máquina:
 
 ```
git clone (https://github.com/Lu4n-M0ur4/labook)
 ```

###
Navegue até o diretório do projeto:
```
cd labook
```

Instale as dependências.  
```
npm install
```
Arquivo .env
```
Configure o arquivo .env com as variáveis de ambiente necessárias. 
Um exemplo pode ser encontrado no arquivo .env.example.
```


SQLITE
```
Execute as query's para popular o banco de dados com dados iniciais (opcional):
```

Execução do Projeto
Inicie o servidor:
```
npm run start
O projeto estará acessível em http://localhost:3003/.
```


- Para maiores informações entre em contato :
- email >> luan.moura-rj@hotmail.com
- telefone >> 21 - 993636584
