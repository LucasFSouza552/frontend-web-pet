
import { Link } from "react-router-dom"
import { PrimaryButton } from "./PrimaryButton";
import type { IAccount } from "../models/account";
import ProfileMenu from "./ProfileMenu";
import { styled } from "styled-components";

export const HeaderComponent = ({ account }: { account?: IAccount | null }) => {

    return (
        <HeaderConteiner>
            <Logo>

            </Logo>
            <Navigation>
                <Link to="/">Home</Link>
                <Link to="/disclosure">Divulgação</Link>
                <Link to="/support">Suporte</Link>
                <Link to="/community">Comunidade</Link>
            </Navigation>
            <HeaderMenu>
                {!account ?
                    <>
                        <PrimaryButton text="Anunciar" type="button" filled to="/" />
                        <PrimaryButton text="Entrar" type="button" filled={false} to="/login" />
                    </>
                    :
                    <ProfileMenu />
                }
            </HeaderMenu>
        </HeaderConteiner>
    )
}

const HeaderConteiner = styled.header`
    width: 100%;
    height: 80px;
    padding: 5px;
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

