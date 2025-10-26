import { FaChevronDown, FaPaw, FaHeart, FaComment, FaShare, FaSearch } from 'react-icons/fa';
import { styled } from 'styled-components';
export default function Explorer() {
    return (<LeftSideContainer>
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
                    <li className="menu-item">
                        <a href="#">
                            Saúde e bem-estar
                            <FaChevronDown />
                        </a>
                    </li>
                    <li className="menu-item">
                        <a href="#">
                            Adestramento
                            <FaChevronDown />
                        </a>
                    </li>
                    <li className="menu-item">
                        <a href="#">
                            Cuidados diários
                            <FaChevronDown />
                        </a>
                    </li>
                    <li className="menu-item">
                        <a href="#">
                            Produtos e serviços
                            <FaChevronDown />
                        </a>
                    </li>
                </ul>
            </div>
            <div className="menu-section">
                <h2 className="menu-title">INFORMAÇÕES</h2>
                <ul>
                    <li className="menu-item">
                        <a href="#">
                            Regras
                            <FaChevronDown />
                        </a>
                    </li>
                </ul>
            </div>
        </MenuContainer>

    </LeftSideContainer>)
}

const MenuContainer = styled.nav`
   
`

const LeftSideContainer = styled.aside`
    background-color: #363135;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 30px;
    height: max-content;
    color: white;
    border: solid 1px white;
    position: sticky;
    top: 0;
    
    flex:1;

    @media (max-width: 900px) {
        display: none;
    }
`

const LogoContainer = styled.div`
    font-size: 1.2rem;
    font-weight: bold;
    color: #e0e0e0;
    text-decoration: none;
    display: block;
    margin-bottom: 30px;
    text-align: center;
    a {
        text-decoration: none;
        color: #e0e0e0;
    }
`