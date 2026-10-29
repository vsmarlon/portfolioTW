---
title: Pokédex: quando a interface também explica as regras
slug: pokedex-interface-regras
excerpt: Busca, filtros, detalhes e batalhas mostram como uma interface pode organizar muitos dados sem perder clareza.
publishedAt: 2026-10-08
category: Estudo de projeto
tags: [TypeScript, Tailwind CSS, Vite, UX]
featured: false
hasDemo: false
---
# Muitos dados precisam de uma ordem visível

Uma Pokédex reúne nomes, tipos, atributos, habilidades, altura, peso e imagens. Colocar tudo na tela de uma vez cria volume, mas não ajuda a encontrar ou comparar nada.

Este projeto usa TypeScript, Tailwind CSS, Vite e a PokéAPI para organizar os primeiros 151 Pokémon. A aplicação combina catálogo, busca, filtros, detalhes e uma arena de batalha por turnos.

O interesse do projeto está na passagem entre explorar informação e tomar uma ação.

## Busca e filtro respondem perguntas diferentes

A busca serve quando a pessoa já conhece um nome. O filtro por tipo serve quando ela quer explorar uma categoria, como água ou fogo.

Os dois controles podem atuar sobre a mesma coleção, mas precisam comunicar seu estado. Uma busca sem resultado não é igual a um filtro que esconde todos os itens. Limpar os controles também deve ser simples, principalmente em telas pequenas.

Uma ordem útil para essa tela é:

1. Mostrar o tamanho do conjunto atual.
2. Manter busca e filtro próximos.
3. Exibir os cards em uma grade que se adapta à largura.
4. Explicar quando nenhum item corresponde à escolha.
5. Preservar o caminho de volta depois de abrir detalhes.

Essa estrutura reduz o esforço de navegação sem depender de animações.

## O card apresenta, os detalhes aprofundam

Cada card precisa ajudar no reconhecimento rápido. Nome, imagem, número e tipo cumprem esse papel. Atributos completos e habilidades pertencem à visualização de detalhes.

Essa divisão evita dois problemas comuns: cards altos demais no celular e informações repetidas que competem pela atenção. A pessoa vê o suficiente para escolher e aprofunda apenas quando precisa.

No mobile, a área de toque deve incluir todo o card e manter distância segura entre ações. No desktop, a grade pode ganhar colunas, mas a hierarquia continua igual.

## A batalha transforma dados em decisão

A arena permite escolher dois Pokémon e comparar suas forças em uma batalha automática ou em turnos com habilidades escolhidas pela pessoa.

Uma boa tela de batalha precisa deixar quatro pontos claros:

- quem está agindo;
- qual habilidade foi escolhida;
- quanto de vida ainda resta;
- quando a rodada ou a batalha terminou.

Essas informações importam mais do que efeitos visuais. Cor e movimento podem reforçar uma mudança, mas o texto e os valores precisam explicar o resultado por conta própria.

TypeScript ajuda a descrever os formatos usados nessas regras. Um Pokémon, uma habilidade e o estado de uma batalha têm campos diferentes. Tipos claros reduzem erros ao passar dados entre catálogo, detalhes e arena.

## A API externa não controla a experiência

A PokéAPI fornece os dados, mas a aplicação decide como carregá-los e apresentá-los. Isso inclui estados de espera, mensagens de erro e limites de consulta.

Uma tela não deve parecer vazia enquanto aguarda uma resposta. Também não deve continuar mostrando resultados antigos como se pertencessem ao filtro atual. Mesmo em um projeto de estudo, esses estados demonstram cuidado com quem usa.

## Identidade visual sem esconder conteúdo

O visual retrô combina com o tema, mas não precisa comprometer leitura. Títulos podem carregar mais personalidade enquanto textos, filtros e valores usam tamanhos confortáveis.

Tailwind CSS ajuda a manter espaçamento e comportamento responsivo consistentes. O ganho aparece quando as classes seguem poucas regras de composição, em vez de criar uma exceção para cada card.

## Desempenho também é parte do tema

Uma Pokédex pode precisar de muitas imagens e respostas da API. Carregar tudo de uma vez aumenta o uso de dados e atrasa o primeiro conteúdo visível. A melhor estratégia começa pelo que aparece na tela.

Imagens abaixo da área visível podem ser carregadas depois. Cada imagem também deve reservar seu espaço antes de chegar, evitando que a grade mude de posição durante a rolagem. O formato e o tamanho do arquivo precisam acompanhar o tamanho real do card.

Busca e filtro podem operar sobre dados que já estão no navegador. Isso evita uma nova chamada para cada tecla quando o conjunto local é suficiente. Se uma consulta externa for necessária, um pequeno intervalo antes do envio impede pedidos que serão descartados imediatamente.

A arena também se beneficia de regras leves. Uma rodada deve calcular apenas o necessário para atualizar os dois participantes e o registro da batalha. Efeitos visuais não podem bloquear os botões nem atrasar a informação do resultado.

## Movimento precisa informar

Transições suaves ajudam a acompanhar uma abertura de detalhes ou uma mudança de turno. Elas deixam de ajudar quando cada card se move por conta própria ou quando a pessoa precisa esperar a animação terminar.

Uma duração curta, perto de algumas centenas de milissegundos, costuma ser suficiente para indicar continuidade. Opacidade e transformação são propriedades adequadas porque o navegador consegue atualizá-las com pouco trabalho. Alterar várias sombras e filtros grandes durante a rolagem custa mais e raramente melhora a compreensão.

O projeto também deve respeitar a preferência do sistema por menos movimento. Nesse modo, as transições podem desaparecer sem remover nenhuma informação. A experiência continua completa porque o estado não depende do efeito.

## Acessibilidade melhora a regra do jogo

Uma arena acessível precisa funcionar por teclado e comunicar as mudanças que normalmente seriam percebidas pela cor ou animação. O foco deve seguir uma ordem previsível, e o botão da habilidade escolhida precisa ter um nome claro.

Quando um ataque acontece, uma região de aviso pode informar o nome do golpe, o dano e a vida restante. Essa mensagem não precisa interromper toda a página. Ela deve chegar no momento certo e usar uma frase curta.

Os tipos de Pokémon não podem ser diferenciados apenas por cor. Texto e ícones ajudam pessoas com diferentes formas de percepção e também tornam a interface mais fácil de entender sob luz forte ou em uma tela de baixa qualidade.

Essas escolhas não formam uma camada separada. Elas obrigam a aplicação a representar cada estado com precisão, o que também reduz erros para quem usa mouse ou toque.

## O que vale testar

Os testes mais valiosos se concentram nas regras que podem quebrar sem deixar um erro visível no código:

- busca sem diferença entre maiúsculas e minúsculas;
- combinação entre texto e filtro de tipo;
- limpeza dos controles;
- escolha de dois participantes válidos;
- fim da batalha quando a vida chega a zero;
- impossibilidade de agir depois do encerramento;
- retorno ao catálogo sem perder a posição esperada.

Os cálculos da arena podem ser testados sem renderizar a página inteira. Já a navegação por teclado e os avisos de mudança precisam de testes que usem a interface. Separar esses níveis mantém a suíte rápida e cobre o comportamento que importa.

## Próximos passos úteis

O projeto já reúne exploração e interação. As melhorias que mais agregariam valor seriam tornar a batalha totalmente acessível por teclado, anunciar mudanças de turno para leitores de tela e guardar uma equipe escolhida no navegador.

Também seria valioso testar as regras da arena separadamente da interface. Assim, uma mudança visual não poderia alterar o resultado de uma batalha sem ser percebida.

Uma revisão final em aparelhos reais completaria esse trabalho. Largura de tela, qualidade da conexão e forma de toque revelam problemas que um navegador de desktop nem sempre reproduz com fidelidade. O resultado deve continuar legível e previsível em todas essas condições.

O código está disponível no [GitHub](https://github.com/vsmarlon/pokedex).
