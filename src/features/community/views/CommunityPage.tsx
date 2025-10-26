import styled from "styled-components";
import { HeaderComponent } from "../../../shared/components/HeaderComponent";
import { AuthContext } from "../../auth/AuthContext";

import backgroundPage from "../../../shared/assets/images/background-page.jpg";
import { useCallback, useContext, useEffect, useRef } from "react";
import Section from "../../../shared/styles/SectionStyle";
import { PostsContext } from "../../post/postContext";
import PostsContainerList from "../../post/components/PostsContainerList";
import Explorer from "../components/Explorer";
import TopTrandings from "../components/TopTrandings";

export default function CommunityPage() {

    const { account } = useContext(AuthContext);

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
                    <Explorer />
                    <MiddleSideContainer>
                        <PostsContainerList account={account} posts={posts} title={"Comunidade"} refCallback={lastPostRef} />
                    </MiddleSideContainer>
                    <TopTrandings/>
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



const MainFlex = styled.main`
  flex: 1;
  
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MiddleSideContainer = styled.div`
    border-radius: 10px;
    display: flex;
    justify-content: center;
    gap: 30px;
    flex:2;
    color: white;
`
