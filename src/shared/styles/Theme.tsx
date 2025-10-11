import type { DefaultTheme } from "styled-components";


const lightTheme: DefaultTheme = {
  colors: {
    bg: "#fff",
    text: "#000",
    primary: "#B648A0", // Rosa/Violeta
    secondary: "#363135", //  Cinza
    tertiary: "#61475C", 
    quarternary: "#332630",
    quinary: "#4A3A46" 
    
    
  },
};

const darkTheme: DefaultTheme = {
  colors: {
    bg: "#121212",
    text: "#ffffff",
    primary: "#B648A0",
    secondary: "#E3D9E8",
    tertiary: "#61475C",
    quarternary: "#332630",
    quinary: "#4A3A46"

  },
};

export { lightTheme, darkTheme };
