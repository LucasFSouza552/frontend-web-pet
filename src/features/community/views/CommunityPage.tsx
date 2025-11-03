import styled from "styled-components";
import backgroundPage from "../../../shared/assets/images/background-page.jpg";
import { useContext } from "react";
import Section from "../../../shared/styles/SectionStyle";
import { ProfileContext } from "@/shared/contexts/ProfileContext";
import SideBar from "@/shared/components/Sidebar";
import PostsFeed from "../components/PostsFeed";
import TrendingPosts from "../components/TrendingPosts";
import { useCommunityController } from "../controllers/useCommunityController";

export default function CommunityPage() {
  const { account } = useContext(ProfileContext);
  const { posts, lastPostRef } = useCommunityController();

  return (
    <Container>
      <BackgroundLayer />
      <SectionContent>
        <StickySidebar>
          <SideBar account={account} />
        </StickySidebar>
        <MiddleSideContainer>
          <PostsFeed posts={posts} refCallback={lastPostRef} />
        </MiddleSideContainer>
        <TrendingPosts />
      </SectionContent>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  min-height: 100dvh;
  width: 100%;
  overflow-x: hidden;
`;

const BackgroundLayer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${backgroundPage});
  background-size: cover;
  background-position: center;
  background-repeat: repeat;
  background-attachment: fixed;
  z-index: 0;
  pointer-events: none;
`;

const SectionContent = styled(Section)`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  width: 100%;
  min-height: calc(100dvh - var(--header-height, 80px));
  padding: 1.25rem;
  gap: 1.25rem;
  box-sizing: border-box;
  overflow-x: hidden;

  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: stretch;
    padding: 1rem;
    gap: 1rem;
  }

  @media (max-width: 768px) {
    padding: 0.75rem;
    gap: 0.75rem;
  }
`;

const StickySidebar = styled.div`
  position: sticky;
  top: 0;
  align-self: flex-start;
  height: fit-content;
  max-height: calc(100dvh - 30px);
  overflow-y: auto;
  z-index: 10;
  flex-shrink: 0;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.primary || "#B648A0"};
    border-radius: 2px;
  }
  
  @media (max-width: 1024px) {
    position: static;
    width: 100%;
    max-height: none;
    z-index: 1;
  }
`;

const MiddleSideContainer = styled.div`
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex: 2;
  padding: 1.5rem;
  background-color: ${({ theme }) => theme.colors.quarternary || "rgba(44, 39, 43, 0.85)"};
  border: 1px solid ${({ theme }) => theme.colors.primary || "#B648A0"};
  box-shadow: 0 4px 16px rgba(182, 72, 160, 0.25);
  color: white;
  min-height: fit-content;
  height: fit-content;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  overflow: visible;

  &:hover {
    box-shadow: 0 6px 24px rgba(182, 72, 160, 0.35);
  }

  @media (max-width: 1024px) {
    width: 100%;
    flex: 1;
    padding: 1rem;
  }

  @media (max-width: 768px) {
    padding: 0.75rem;
    border-radius: 8px;
  }
`;
