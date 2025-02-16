# Interface Macrodata – Simulação Inspirada em Severance

Este projeto simula a interface do software de macrodata da Lumon, inspirada na série *Severance*. Desenvolvido em HTML, CSS e JavaScript, ele recria o ambiente opressivo e a dinâmica de coleta e eliminação dos “números assustadores”.

## Funcionalidades

- **Interface Visual e Animações**  
  - Tela de introdução com logo animado.  
  - Grade de números com efeitos de flutuação e animações base.
  
- **Bloco Assustador**  
  - Seleção aleatória de um bloco “assustador” na grade.  
  - Ao passar o mouse sobre qualquer célula do bloco, todas aumentam de tamanho (efeito hover) e um áudio de suspense inicia com fade‑in; o áudio faz fade‑out gradativo quando o mouse sai de todas as células.
  
- **Eliminação e Transporte de Dados**  
  - Ao clicar em qualquer célula do bloco assustador, os números são “eliminados” com uma animação de transporte que simula a viagem dos dados até um container.  
  - Cada célula eliminada é clonada e anima seu percurso até o container, enquanto a célula original recebe um novo número aleatório sem os efeitos do bloco assustador.
  
- **Containers Dinâmicos**  
  - O footer exibe 5 caixas (01 a 05) que armazenam os números eliminados.  
  - Cada caixa mostra um percentual de progresso (meta: 20 números por caixa) e apresenta uma animação de “portas” abrindo (simulando a caixa se abrindo para receber os dados) e fechando novamente.

## Estrutura do Projeto

- **index.html**  
  Contém a estrutura da interface, incluindo a área de introdução, header, grade (section) e footer.

- **styles.css**  
  Define o estilo visual, as animações e a responsividade da interface, incluindo as animações de abertura das “portas” dos containers.

- **script.js**  
  Gerencia a lógica de geração dos números, a seleção do bloco assustador, o controle do áudio (fade‑in/fade‑out) e a animação de transporte dos números para os containers.

## Pré-requisitos

- Navegador moderno com suporte a HTML5, CSS3 e JavaScript.
- O arquivo de áudio `suspense.mp3` deve estar disponível na pasta raiz do projeto (ou ajustar o caminho no `script.js`).

## Como Executar

1. Clone o repositório:
   ```bash
   git clone <URL_DO_REPOSITÓRIO>
