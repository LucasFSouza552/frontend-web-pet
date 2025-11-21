import styled from "styled-components";
import backgroundPage from "@assets/images/background-page.jpg";
import { useContext, useState, useMemo } from "react";
import Section from "@styles/SectionStyle";
import { ProfileContext } from "@contexts/ProfileContext";
import PostsFeed from "../components/PostsFeed";
import TrendingPosts from "../components/TrendingPosts";
import SearchBar, { type AccountTypeFilter } from "../components/SearchBar";
import CreatePostForm from "../components/CreatePostForm";
import { useCommunityController } from "../controllers/useCommunityController";
import StickySidebar from "@/shared/styles/StickySidebar";
import ResponsiveSidebar, { HamburgerButton } from "@/shared/components/ResponsiveSidebar";
import { useResponsiveSidebar } from "@/shared/hooks/useResponsiveSidebar";
import SideBar from "@components/Sidebar";
import type { IPost } from "@models/Post";

export default function CommunityPage() {
  const { account } = useContext(ProfileContext);
  const { isMenuOpen, toggleMenu, closeMenu } = useResponsiveSidebar();
  const [accountTypeFilter, setAccountTypeFilter] = useState<AccountTypeFilter>("all");
  const {
    posts,
    lastPostRef,
    searchResults,
    loadingSearchResults,
    lastSearchPostRef,
    handleSearch,
    isSearching
  } = useCommunityController();

  const filterPostsByAccountType = (postsToFilter: IPost[]): IPost[] => {
    if (accountTypeFilter === "all") {
      return postsToFilter;
    }
    return postsToFilter.filter(post => post.account?.role === accountTypeFilter);
  };

  const filteredPosts = useMemo(() => filterPostsByAccountType(posts), [posts, accountTypeFilter]);
  const filteredSearchResults = useMemo(() => filterPostsByAccountType(searchResults), [searchResults, accountTypeFilter]);

  return (
    <Container>
      <ResponsiveSidebar 
        account={account} 
        isMenuOpen={isMenuOpen} 
        onCloseMenu={closeMenu}
      />

      <SectionContent>
          <StickySidebar>
            <SideBar account={account} />
          </StickySidebar>
        <MiddleSideContainer>
          <HamburgerButton onClick={toggleMenu} />
          <SearchBar 
            onSearch={handleSearch} 
            accountTypeFilter={accountTypeFilter}
            onAccountTypeFilterChange={setAccountTypeFilter}
          />
          <CreatePostForm />

          {!isSearching && <PostsFeed posts={filteredPosts} refCallback={lastPostRef} />}
          {isSearching && (
            <>
              {filteredSearchResults.length > 0 && (
                <PostsFeed posts={filteredSearchResults} refCallback={lastSearchPostRef} />
              )}
              {filteredSearchResults.length === 0 && !loadingSearchResults && (
                <NoResults>
                  Nenhum resultado encontrado.
                </NoResults>
              )}
              {loadingSearchResults && filteredSearchResults.length > 0 && (
                <LoadingMore>
                  Carregando mais resultados...
                </LoadingMore>
              )}
            </>
          )}
        </MiddleSideContainer>
        <StickySidebar>
          <TrendingPosts />
        </StickySidebar>
      </SectionContent>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  min-height: 100dvh;
  width: 100%;
  overflow-x: hidden;
  
  @media (max-width: 480px) {
    min-height: 100vh;
  }
`;

const SectionContent = styled(Section)`
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  width: 100%;
  min-height: calc(100dvh - var(--header-height, 80px));
  padding: 1.25rem;
  gap: 1.25rem;
  box-sizing: border-box;
  overflow-x: hidden;

  background-image: url(${backgroundPage});
  background-size: cover;
  background-position: center;
  background-repeat: repeat;
  background-attachment: fixed;

  @media (max-width: 1200px) {
    gap: 1rem;
    padding: 1rem;
  }

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

  @media (max-width: 480px) {
    padding: 0.5rem;
    gap: 0.5rem;
  }
`;

const MiddleSideContainer = styled.div`
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    flex: 2;
    min-width: 0;
    padding: 1.5rem;
    background-color: ${({ theme }) => theme.colors.quarternary};
    border: 1px solid ${({ theme }) => theme.colors.primary};
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

    @media (max-width: 1200px) {
        padding: 1.25rem;
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

    @media (max-width: 480px) {
        padding: 0.5rem;
        border-radius: 6px;
    }
`;


const LoadingMore = styled.div`
    padding: 1rem;
    text-align: center;
    color: ${({ theme }) => theme.colors.primary || "#B648A0"};
    font-size: 0.875rem;
    font-weight: 500;
    
    @media (max-width: 768px) {
        padding: 0.75rem;
        font-size: 0.8125rem;
    }
    
    @media (max-width: 480px) {
        padding: 0.5rem;
        font-size: 0.75rem;
    }
`;

const NoResults = styled.div`
    padding: 2rem;
    text-align: center;
    color: rgba(255, 255, 255, 0.7);
    font-size: 1rem;
    font-weight: 500;
    
    @media (max-width: 768px) {
        padding: 1.5rem;
        font-size: 0.9375rem;
    }
    
    @media (max-width: 480px) {
        padding: 1rem;
        font-size: 0.875rem;
    }
`;
