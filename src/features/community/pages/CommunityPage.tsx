import styled from "styled-components";
import { HeaderComponent } from "../../../shared/components/HeaderComponent";
import { AuthContext } from "../../auth/AuthContext";

import { FaChevronDown, FaPaw, FaHeart, FaComment, FaShare, FaSearch } from 'react-icons/fa';

import backgroundPage from "../../../shared/assets/images/background-page.jpg";
import { useCallback, useContext, useEffect, useRef } from "react";
import Section from "../../../shared/styles/SectionStyle";
import { PostsContext } from "../../post/postContext";
import PostsContainer from "../../post/components/PostsContainer";

export default function CommunityPage() {

    const { account } = useContext(AuthContext);

    if (!account) return null

    const { posts, refreshPosts, loadMorePosts, hasMorePosts, loadingPosts } = useContext(PostsContext);
    const observer = useRef<IntersectionObserver>(null);

    useEffect(() => {
        refreshPosts();
    }, []);

    const lastPostRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMorePosts) {
                    loadMorePosts();
                }
            });
            if (node) observer.current.observe(node);
        },
        [hasMorePosts, loadMorePosts, loadingPosts]
    );

    return (
        <Container>
            <HeaderComponent account={account} />
            <MainFlex>
                <SectionContent>

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

                    </LeftSideContainer>
                    <MiddleSideContainer>
                        <PostsContainer account={account} posts={posts} title={"Comunidade"} refCallback={lastPostRef} />
                    </MiddleSideContainer>
                    <RightSideContainer>
                        <div className="active-communities">
                            <h3>Comunidades ativas</h3>
                            <ul>
                                <li>
                                    <div className="community-icon">
                                        <FaPaw />
                                    </div>
                                    <span>Amicao</span>
                                </li>
                                <li>
                                    <div className="community-icon">
                                        <FaPaw />
                                    </div>
                                    <span>Amicao</span>
                                </li>
                                <li>
                                    <div className="community-icon">
                                        <FaPaw />
                                    </div>
                                    <span>Amicao</span>
                                </li>
                            </ul>
                        </div>
                    </RightSideContainer>
                </SectionContent>
            </MainFlex>
        </Container>
    );
}

const SectionContent = styled(Section)`
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
    min-height: calc(100dvh - var(--header-height));
    background-image: url(${backgroundPage});
    background-size: cover;
    background-position: center;
    background-repeat: repeat;
    background-attachment: fixed;
    padding: 5px;

`;

const MenuContainer = styled.nav`
    
`

const MainFlex = styled.main`
  flex: 1;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MiddleSideContainer = styled.div`
    background-color: #363135;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    gap: 30px;
    flex:2;
    color: white;

`

const RightSideContainer = styled.aside`
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 30px;
    flex: 1;
    height: max-content;
    color: white;
    border: solid 1px white;
    position: sticky;
    background-color: #363135;
    top: 0;
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
`

const LogoContainer = styled.div`
    font-size: 1.2rem;
    font-weight: bold;
    color: #e0e0e0;
    text-decoration: none;
    display: block;
    margin-bottom: 30px;
`