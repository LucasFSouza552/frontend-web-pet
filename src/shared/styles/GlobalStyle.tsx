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

  }

  /* Estilo global */
  body {
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