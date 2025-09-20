import styled from "styled-components"

const HeaderConteiner = styled.header`
    width: 100%;
    height: 80px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.bg};
`;

const Logo = styled.div`
    
`;

const Navigation = styled.nav`
    display: flex;
    height: 100%;
    align-items: center;
    gap: 15px;

    a {
        text-transform: uppercase;
        font-weight: bolder;
    }
`;

const HeaderMenu = styled.div`
    display: flex;
    flex-direction: row;
    gap: 5px;
`;

export {
    HeaderConteiner,
    HeaderMenu,
    Logo,
    Navigation
}