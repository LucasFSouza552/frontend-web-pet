import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      bg: string;
      text: string;
      primary: string;
      secondary?: string;
      tertiary: string;
      quarternary: string;
      quinary: string;
      danger?: string;
      success?: string;
      warning?: string;
    };
  }
}
