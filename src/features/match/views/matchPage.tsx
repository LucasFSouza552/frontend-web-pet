import { styled } from "styled-components";
import MatchCard from "../components/MatchCard";
import Section from "@styles/SectionStyle";
import backgroundPage from "@assets/images/background-page.jpg";
import { useContext, useEffect } from "react";
import MatchCardSkeleton from "../components/MatchCardSkeleton";
import NoMorePetsCard from "../components/NoMorePetsCard";
import { ProfileContext } from "@contexts/ProfileContext";
import SideBar from "@components/Sidebar";
import StickySidebar from "@/shared/styles/StickySidebar";
import ResponsiveSidebar, { HamburgerButton } from "@/shared/components/ResponsiveSidebar";
import { useResponsiveSidebar } from "@/shared/hooks/useResponsiveSidebar";

export default function MatchSection() {
    const { account } = useContext(ProfileContext);
    const { isMenuOpen, toggleMenu, closeMenu } = useResponsiveSidebar();
    const { loadFeed, petFeed, loadingFeed, hasMorePets } = useContext(ProfileContext);

    useEffect(() => {
        loadFeed();
    }, []);


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
                <MatchContentWrapper>
                    <HamburgerButton onClick={toggleMenu} />

                    {loadingFeed ? (
                        <MatchCardSkeleton />
                    ) : !hasMorePets ? (
                        <NoMorePetsCard />
                    ) : (
                        <MatchCard Pet={petFeed[petFeed.length - 1]} />
                    )}
                </MatchContentWrapper>
            </SectionContent>
        </Container>
    );
}

const MatchContentWrapper = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
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
    display: flex;
    width: 100%;
    flex-direction: row;
    min-height: calc(100dvh - var(--header-height, 80px));
    background-image: url(${backgroundPage});
    background-size: cover;
    background-position: center;
    background-repeat: repeat;
    background-attachment: fixed;
    padding: 1.25rem;
    gap: 1.25rem;
    box-sizing: border-box;
    overflow-x: hidden;

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