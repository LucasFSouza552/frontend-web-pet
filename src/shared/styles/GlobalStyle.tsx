import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`

  /* Reset básico */
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /* Ocupa a tela toda */
  html, body, #root {
    width: 100%;
    display: block;
    --header-height: 80px;

    .no-select {
      -webkit-user-select: none; /* Safari/Chrome */
      -moz-user-select: none;    /* Firefox */
      -ms-user-select: none;     /* IE/Edge */
      user-select: none;         /* Standard */
      -webkit-touch-callout: none; /* iOS: desativa o menu de contexto ao segurar */
    }

  }

  /* Estilo global */
  body {
    
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');
    font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Links */
  a {
    color: inherit;
    text-decoration: none;
  }

  /* Imagens responsivas */
  img, picture, video, canvas, svg {
    display: block;
    max-width: 100%;
  }

  /* Tipografia consistente */
  input, button, textarea, select {
    font: inherit;
  }

  /* Remove bullets padrão */
  ul, ol {
    list-style: none;
  }

  /* Botões */
  button {
    border: none;
    background: none;
    cursor: pointer;
  }
`;

export default GlobalStyle;