import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      bg: string;
      text: string;
      primary: string;
      secondary?: string;
      danger?: string;
      success?: string;
      warning?: string;
    };
  }
}
