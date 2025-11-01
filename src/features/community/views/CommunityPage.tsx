import styled from "styled-components";
import { HeaderComponent } from "../../../shared/components/HeaderComponent";
import { AuthContext } from "../../auth/AuthContext";
import backgroundPage from "../../../shared/assets/images/background-page.jpg";
import { useCallback, useContext, useEffect, useRef } from "react";
import Section from "../../../shared/styles/SectionStyle";
import { PostsContext } from "../../../app/contexts/PostContext";
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
                        <PostsContainerList 
                            account={account} 
                            posts={posts} 
                            title={"Comunidade"} 
                            refCallback={lastPostRef} 
                        />
                    </MiddleSideContainer>
                    <TopTrandings />
                </SectionContent>
            </MainFlex>
        </Container>
    );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #1f1b1e;
`;

const MainFlex = styled.main`
  flex: 1;
`;

const SectionContent = styled(Section)`
  display: flex;
  flex-direction: row;
  width: 100%;
  min-height: calc(100dvh - var(--header-height));
  background-image: url(${backgroundPage});
  background-size: cover;
  background-position: center;
  background-repeat: repeat;
  background-attachment: fixed;
  padding: 20px;
  gap: 20px;
  height: 100%;
  box-sizing: border-box;
  background-color: rgba(54, 49, 53, 0.9);

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: center;
    padding: 10px;
  }
`;

const MiddleSideContainer = styled.div`
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 20px;
  flex: 2;
  padding: 20px;
  background-color: rgba(44, 39, 43, 0.85);
  border: 1px solid #B648A0;
  box-shadow: 0 0 12px rgba(182, 72, 160, 0.3);
  color: white;
  min-height: 100dvh;
  height: fit-content;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.001);
    box-shadow: 0 0 20px rgba(182, 72, 160, 0.4);
  }

  @media (max-width: 900px) {
    width: 100%;
    padding: 10px;
  }
`;
