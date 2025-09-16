import styled from "styled-components"
import { Link } from "react-router-dom"
import { PrimaryButton } from "./PrimaryButton";

export const HeaderComponent = () => {

    return (
        <HeaderConteiner>
            <Logo>

            </Logo>
            <Navigation>
                <Link to="/">Home</Link>
                <Link to="/disclosure">Divulgação</Link>
                <Link to="/suport">Suporte</Link>
            </Navigation>
            <HeaderMenu>
                <PrimaryButton text="Anunciar" type="button" filled to="/" />
                <PrimaryButton text="Entrar" type="button" filled={false} to="/login" />
            </HeaderMenu>
        </HeaderConteiner>
    )
}

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

