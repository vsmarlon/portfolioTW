---
title: MoviesFlutter: integração de catálogo, identidade e persistência
slug: movies-flutter-produto-completo
excerpt: Estudo de um aplicativo Flutter que separa dados do TMDB, cache local e favoritos persistentes, com limites de consistência explicitados.
publishedAt: 2026-10-21
category: Estudo de projeto
tags: [Flutter, TypeScript, PostgreSQL, Mobile]
featured: true
hasDemo: false
---
# Um catálogo é apenas o começo

Exibir filmes populares permite exercitar o consumo de uma API, mas não constitui, por si só, um produto coerente. O problema se amplia quando identidade, pesquisa, persistência por usuário e continuidade entre sessões passam a integrar o mesmo fluxo.

O MoviesFlutter foi construído com esse segundo objetivo. O aplicativo usa Flutter no celular, uma API em TypeScript com Express e um banco PostgreSQL. Os dados públicos dos filmes vêm do TMDB. Já as contas e os favoritos pertencem ao próprio produto.

Essa separação parece simples, mas define quase todas as decisões importantes do projeto.

![Catálogo real do CineFlutter com busca, pôsteres e favoritos](/blog/movies-catalog.webp)

*Tela do projeto: a busca fica acima do catálogo e o coração identifica os filmes favoritados. Imagem do repositório original.*

## Dois tipos de dado, duas responsabilidades

O catálogo do TMDB é uma fonte externa. Ele oferece títulos, sinopses, imagens e informações de descoberta. Copiar todo esse conteúdo para o banco local aumentaria o trabalho de sincronização sem melhorar a experiência.

Os favoritos têm outra natureza. Eles representam uma escolha pessoal e precisam estar ligados a uma conta. Por isso, ficam no PostgreSQL e passam pela API do projeto.

| Dado | Origem | Motivo |
| --- | --- | --- |
| Filmes populares | TMDB | Conteúdo mantido por uma fonte especializada |
| Resultado de busca | TMDB | Catálogo amplo e atualizado |
| Conta | API própria | Identidade controlada pelo produto |
| Favoritos | PostgreSQL | Preferência durável e ligada ao usuário |

![Diagrama das fontes de dados do MoviesFlutter](/blog/movies-system.svg)

O diagrama resume uma fronteira que aparece no código: o cliente busca filmes no TMDB, mas consulta e altera favoritos por uma API Express autenticada. O banco guarda identificadores de filmes por usuário; quando a lista é aberta, o app usa esses IDs para recuperar detalhes no TMDB.

A interface reúne esses dados sem esconder de onde cada um vem. Se o catálogo externo falhar, a tela precisa explicar o problema. Se a sessão expirar, a pessoa precisa entrar novamente antes de alterar seus favoritos. Cada falha pede uma resposta diferente.

## Autenticação que protege uma ação concreta

O projeto usa cadastro e login com senhas protegidas e tokens JWT. Um token é um comprovante temporário de que a API reconheceu aquela sessão. Ele acompanha as chamadas que consultam ou alteram os favoritos.

O ponto principal não é apenas emitir o token. A API precisa validar esse comprovante em todas as rotas privadas e usar a identidade validada para buscar os dados corretos. O cliente não deve escolher livremente o identificador de outro usuário.

No aplicativo, isso cria uma jornada clara:

1. A pessoa cria a conta ou entra.
2. A API devolve uma sessão válida.
3. O app usa essa sessão ao consultar os favoritos.
4. A API associa cada alteração ao usuário autenticado.
5. Uma sessão inválida leva de volta ao acesso, com uma mensagem direta.

Esse fluxo transforma autenticação em parte da experiência, e não em uma tela isolada.

![Tela real de acesso do CineFlutter](/blog/movies-login.webp)

*O login é a entrada para favoritos persistidos por conta, não um bloqueio para consultar o catálogo público.*

## Flutter como cliente de um sistema

O aplicativo usa Riverpod nos providers de autenticação e favoritos, Dio para chamadas HTTP e go_router para navegação. O projeto também declara Provider como dependência, mas os fluxos de favoritos examinados são implementados com Riverpod. Essa distinção importa porque o texto deve descrever o código que existe, não apenas a lista de pacotes.

Há uma segunda escolha interessante: o catálogo popular passa por um repositório que busca dados remotos e os grava em uma base local com Floor. A tela observa um fluxo dessa base. Assim, cache local ajuda a leitura do catálogo, enquanto favoritos pertencem à conta no servidor.

O estado da interface deve responder perguntas visíveis: a busca está em andamento, terminou sem resultados ou falhou? O filme já está nos favoritos? A sessão ainda é válida? Quando esses estados são tratados separadamente, a tela evita saltos e mensagens contraditórias.

A navegação também precisa refletir o produto. Login, catálogo, detalhes e favoritos não são apenas páginas. Elas formam uma sequência que deve continuar compreensível quando a pessoa volta, pesquisa ou perde a conexão.

## O backend mantém a regra central

Express recebe as chamadas, Sequelize conversa com o PostgreSQL e o Docker Compose reúne os serviços para desenvolvimento. Essa base permite que o cliente mobile continue focado em apresentação e interação.

A regra de propriedade fica na API. É ela que decide quais favoritos pertencem à sessão atual. Também é ela que protege as senhas e valida os dados recebidos.

Essa divisão prepara o projeto para receber outro cliente no futuro, como uma interface web, sem duplicar regras importantes.

## Conexão lenta muda a prioridade

Um aplicativo de filmes trabalha com muitas imagens. Em uma rede rápida, é fácil não perceber o custo de carregar pôsteres grandes ou pedir a mesma lista várias vezes. Em uma conexão móvel instável, esses detalhes definem se a tela parece pronta ou travada.

A primeira resposta não precisa ser um sistema complexo de cache. O app pode começar com medidas diretas:

- pedir imagens no tamanho em que serão exibidas;
- carregar primeiro os elementos visíveis;
- manter o último resultado útil durante uma atualização;
- evitar uma nova busca quando o texto não mudou;
- mostrar um espaço reservado com as mesmas dimensões do pôster.

O espaço reservado evita que o conteúdo pule quando a imagem chega. Manter o resultado anterior evita uma tela vazia entre duas consultas. As duas escolhas melhoram a sensação de velocidade sem fingir que a rede respondeu antes.

Os favoritos merecem cuidado extra. A interface pode responder ao toque rapidamente, mas deve deixar claro quando a gravação ainda está em andamento. Se a API recusar a mudança, o estado visual precisa voltar ao valor confirmado. Velocidade percebida não pode criar uma informação falsa.

No `FavoritesNotifier`, essa reversão já existe: adicionar ou remover um filme atualiza a lista local primeiro; se a chamada à API falha, o provider restaura o estado anterior. É um exemplo concreto de atualização otimista com rollback. O próximo refinamento seria comunicar a falha à pessoa, porque hoje o `catch` restaura o estado sem apresentar uma mensagem específica.

## Estados de erro fazem parte da navegação

Uma falha no TMDB não significa que o login parou de funcionar. Uma falha na API própria não significa que o catálogo público está indisponível. Tratar tudo como um erro genérico desperdiça a separação entre os serviços.

As mensagens podem orientar a próxima ação:

| Situação | Resposta útil |
| --- | --- |
| Catálogo indisponível | Manter a navegação e oferecer nova tentativa |
| Sessão expirada | Explicar que é necessário entrar novamente |
| Favorito não salvo | Restaurar o estado confirmado e permitir repetir |
| Dispositivo sem rede | Preservar o conteúdo já carregado e informar a condição |

Essa precisão reduz frustração. A pessoa entende o que permaneceu funcionando e o que pode fazer em seguida.

## Validação precisa atravessar as camadas

O formulário mobile pode impedir um email sem formato válido ou uma senha vazia. Essa validação ajuda a pessoa a corrigir o dado antes de enviar. Ainda assim, a API precisa repetir as verificações importantes.

O aplicativo está sob controle de quem usa. Uma chamada pode ser feita sem passar pela tela original. Por isso, regras de autenticação, propriedade e formato ficam no servidor. O cliente antecipa problemas comuns; a API decide o que aceita.

No banco, restrições completam essa proteção. Uma conta precisa ter um identificador estável, e a relação de favorito não deve gerar cópias do mesmo filme para o mesmo usuário. Cada camada protege uma parte diferente do sistema.

O código atual usa `findOrCreate` para não adicionar o mesmo filme duas vezes e responde `409` quando ele já está na lista. O modelo Sequelize, porém, não declara uma restrição única composta por `user_id` e `movie_id`. Sob duas requisições simultâneas, essa regra precisa de proteção no banco para ser garantida. É um limite verificável da implementação atual.

## Como eu verificaria a jornada

Testar componentes isolados é útil, mas este produto pede cenários que atravessam o aplicativo e a API. Os casos mais valiosos começam com uma ação que uma pessoa realmente faria:

1. criar uma conta e entrar;
2. pesquisar um filme e abrir seus detalhes;
3. adicionar esse filme aos favoritos;
4. fechar a sessão e entrar novamente;
5. confirmar que o favorito continua disponível;
6. remover o item e verificar a resposta da interface.

Também vale repetir a jornada com a API lenta, uma resposta inválida do catálogo e um token expirado. Esses cenários revelam mensagens ausentes e estados que parecem corretos apenas no caminho ideal.

O objetivo não é acumular testes. É proteger as ligações que tornam o projeto um produto completo.

## O que este projeto demonstra

MoviesFlutter mostra mais do que consumo de uma API pública. Ele conecta uma fonte externa a dados próprios, protege ações por usuário e mantém a experiência coerente entre várias telas.

Os próximos passos mais úteis seriam testes de integração para as rotas de autenticação e favoritos, estados offline mais explícitos e uma revisão de acessibilidade nas telas mobile. São melhorias concretas, ligadas ao comportamento que já existe.

## Referências

- [Flutter: Guide to app architecture](https://docs.flutter.dev/app-architecture/guide)
- [TMDB: Getting Started](https://developer.themoviedb.org/docs/getting-started)
- [RFC 7519: JSON Web Token](https://www.rfc-editor.org/rfc/rfc7519)
- [PostgreSQL: Unique Constraints](https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-UNIQUE-CONSTRAINTS)

**Explore o código e as capturas originais:** [Repositório MoviesFlutter](https://github.com/vsmarlon/MoviesFlutter)
