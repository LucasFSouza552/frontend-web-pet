import styled from "styled-components";
import type { IAccount } from "../models/Account";
import { Link } from "react-router-dom"
import ProfileMenu from "./ProfileMenu";
import { PrimaryButton } from "./PrimaryButton";

export default function SideBar({ account }: { account: IAccount | null }) {

    return (
        <div>
            <Navigation>
                <Link to="/">Página Principal</Link>
                <Link to="/disclosure">Divulgação</Link>
                <Link to="/support">Suporte</Link>
                <Link to="/match">Match</Link>
                <Link to="/community">Comunidade</Link>
            </Navigation>
            <div>
                {!account ?
                    <>
                        <PrimaryButton text="Anunciar" type="button" filled to="/" />
                        <PrimaryButton text="Entrar" type="button" filled={false} to="/login" />
                    </>
                    :
                    <ProfileMenu />
                }
            </div>
        </div>
    )
}


const Navigation = styled.nav`
    display: flex;
    flex-direction: column;
    height: 100%;
    align-items: center;
    gap: 15px;

    a {
        text-transform: uppercase;
        font-weight: bolder;
    }
`;