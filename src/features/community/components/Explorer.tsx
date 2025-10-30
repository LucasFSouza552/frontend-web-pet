import { FaChevronDown } from 'react-icons/fa';
import { styled } from 'styled-components';

export default function Explorer() {
    return (
        <LeftSideContainer>
            <LogoContainer>
                <a href="#">Página Inicial</a>
            </LogoContainer>
            <MenuContainer>
                <div className="menu-section">
                    <h2 className="menu-title">ASSUNTOS</h2>
                    <ul>
                        <li className="menu-item has-submenu">
                            <a href="#">
                                Adoção e resgate
                                <FaChevronDown />
                            </a>
                            <ul className="submenu">
                                <li><a href="#">Cuidados veterinários básicos</a></li>
                                <li><a href="#">Vacinação e vermifugação</a></li>
                                <li><a href="#">Alimentação saudável</a></li>
                                <li><a href="#">Prevenção de doenças comuns</a></li>
                            </ul>
                        </li>
                        <li className="menu-item"><a href="#">Saúde e bem-estar<FaChevronDown /></a></li>
                        <li className="menu-item"><a href="#">Adestramento<FaChevronDown /></a></li>
                        <li className="menu-item"><a href="#">Cuidados diários<FaChevronDown /></a></li>
                        <li className="menu-item"><a href="#">Produtos e serviços<FaChevronDown /></a></li>
                    </ul>
                </div>
                <div className="menu-section">
                    <h2 className="menu-title">INFORMAÇÕES</h2>
                    <ul>
                        <li className="menu-item"><a href="#">Regras<FaChevronDown /></a></li>
                    </ul>
                </div>
            </MenuContainer>
        </LeftSideContainer>
    )
}

const LeftSideContainer = styled.aside`
    background-color: #363135;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 25px;
    height: max-content;
    color: white;
    border: 1px solid #B648A0;
    position: sticky;
    top: 0;
    flex: 1;
    padding: 25px 20px;
    box-shadow: 0 0 10px rgba(182, 72, 160, 0.3);

    @media (max-width: 900px) {
        display: none;
    }
`

const LogoContainer = styled.div`
    font-size: 1.3rem;
    font-weight: bold;
    margin-bottom: 20px;
    text-align: center;

    a {
        text-decoration: none;
        color: #B648A0;
        transition: color 0.3s ease;
    }

    a:hover {
        color: #e0e0e0;
    }
`

const MenuContainer = styled.nav`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 25px;

    .menu-section {
        background-color: #2c272b;
        padding: 15px;
        border-radius: 10px;
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
    }

    .menu-title {
        color: #B648A0;
        font-size: 1rem;
        font-weight: 700;
        margin-bottom: 10px;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    ul {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .menu-item {
        margin-bottom: 10px;
        border-radius: 8px;
        transition: background-color 0.3s ease;
    }

    .menu-item a {
        display: flex;
        align-items: center;
        justify-content: space-between;
        text-decoration: none;
        color: #fff;
        font-weight: 500;
        padding: 10px 12px;
        border-radius: 8px;
        transition: all 0.3s ease;
        background-color: #3e383d;
    }

    .menu-item a:hover {
        background-color: #B648A0;
        transform: scale(1.02);
    }

    .submenu {
        margin-top: 8px;
        margin-left: 10px;
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    .submenu li a {
        font-size: 0.9rem;
        color: #d1cfd0;
        padding: 6px 10px;
        border-radius: 6px;
        background-color: #2a2529;
        transition: all 0.3s ease;
    }

    .submenu li a:hover {
        background-color: #B648A0;
        color: white;
    }
`
