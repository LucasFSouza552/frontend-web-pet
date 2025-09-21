
import { Link } from "react-router-dom"
import { PrimaryButton } from "../PrimaryButton";
import { HeaderConteiner, HeaderMenu, Logo, Navigation } from "./style";

export const HeaderComponent = () => {

    return (
        <HeaderConteiner>
            <Logo>

            </Logo>
            <Navigation>
                <Link to="/">Home</Link>
                <Link to="/disclosure">Divulgação</Link>
                <Link to="/support">Suporte</Link>
            </Navigation>
            <HeaderMenu>
                <PrimaryButton text="Anunciar" type="button" filled to="/" />
                <PrimaryButton text="Entrar" type="button" filled={false} to="/login" />
            </HeaderMenu>
        </HeaderConteiner>
    )
}

