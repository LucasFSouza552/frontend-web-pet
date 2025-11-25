import { styled } from "styled-components";
import MatchCard from "../components/MatchCard";
import Section from "@styles/SectionStyle";
import backgroundPage from "@assets/images/background-page.jpg";
import { useContext, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import MatchCardSkeleton from "../components/MatchCardSkeleton";
import NoMorePetsCard from "../components/NoMorePetsCard";
import { ProfileContext } from "@contexts/ProfileContext";
import SideBar from "@components/Sidebar";
import StickySidebar from "@/shared/styles/StickySidebar";
import ResponsiveSidebar, { HamburgerButton } from "@/shared/components/ResponsiveSidebar";
import { useResponsiveSidebar } from "@/shared/hooks/useResponsiveSidebar";
import { petService } from "@/features/pet/petService";
import type IPet from "@models/Pet";
import { pictureService } from "@api/pictureService";
import { usePetInteractionController } from "@/features/pet/controllers/usePetInteractionController";

export default function MatchSection() {
    const { account } = useContext(ProfileContext);
    const { isMenuOpen, toggleMenu, closeMenu } = useResponsiveSidebar();
    const { loadFeed, petFeed, loadingFeed, hasMorePets } = useContext(ProfileContext);
    const [searchParams, setSearchParams] = useSearchParams();
    const petIdFromUrl = searchParams.get('pet');
    
    const [specificPet, setSpecificPet] = useState<IPet | null>(null);
    const [loadingSpecificPet, setLoadingSpecificPet] = useState(false);
    const [petError, setPetError] = useState<string | null>(null);
    
    const { handleLikePet: originalHandleLikePet, handleDislikePet: originalHandleDislikePet } = usePetInteractionController();
    
    const removeUrlParams = useCallback(() => {
        const currentParams = new URLSearchParams(searchParams);
        const hasParams = currentParams.toString().length > 0;
        
        if (hasParams) {
            setSearchParams({}, { replace: true });
        }
    }, [searchParams, setSearchParams]);
    
    const handleLikePet = useCallback(async (petId: string) => {
        await originalHandleLikePet(petId);
        removeUrlParams();
        if (petIdFromUrl) {
            setSpecificPet(null);
            loadFeed();
        }
    }, [originalHandleLikePet, removeUrlParams, petIdFromUrl, loadFeed]);
    
    const handleDislikePet = useCallback(async (petId: string) => {
        await originalHandleDislikePet(petId);
        removeUrlParams();
        if (petIdFromUrl) {
            setSpecificPet(null);
            loadFeed();
        }
    }, [originalHandleDislikePet, removeUrlParams, petIdFromUrl, loadFeed]);

    useEffect(() => {
        if (petIdFromUrl) {
            setLoadingSpecificPet(true);
            setPetError(null);
            petService.fetchPetById(petIdFromUrl)
                .then((pet) => {
                    if (pet.account?.avatar) {
                        pet.account.avatar = pictureService.fetchPicture(pet.account.avatar);
                    }
                    if (pet.images && pet.images.length > 0) {
                        pet.images = pet.images.map((img: string) => pictureService.fetchPicture(img));
                    }
                    setSpecificPet(pet);
                    setLoadingSpecificPet(false);
                })
                .catch((error) => {
                    console.error("Erro ao buscar pet:", error);
                    setPetError(error.message || "Pet não encontrado");
                    setLoadingSpecificPet(false);
                });
        } else {
            loadFeed();
        }
    }, [petIdFromUrl, loadFeed]);


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

                    {petIdFromUrl ? (
                        loadingSpecificPet ? (
                            <MatchCardSkeleton />
                        ) : petError ? (
                            <ErrorContainer>
                                <ErrorText>{petError}</ErrorText>
                            </ErrorContainer>
                        ) : specificPet ? (
                            <MatchCard 
                                Pet={specificPet} 
                                handleLikePet={handleLikePet}
                                handleDislikePet={handleDislikePet}
                            />
                        ) : (
                            <NoMorePetsCard />
                        )
                    ) : (
                        loadingFeed ? (
                            <MatchCardSkeleton />
                        ) : !hasMorePets || !petFeed || petFeed.length === 0 ? (
                            <NoMorePetsCard />
                        ) : (
                            <MatchCard 
                                Pet={petFeed[petFeed.length - 1]} 
                                handleLikePet={handleLikePet}
                                handleDislikePet={handleDislikePet}
                            />
                        )
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
  overflow: hidden;
  
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

const ErrorContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background-color: ${({ theme }) => theme?.colors?.quarternary || "rgba(44, 39, 43, 0.95)"};
    border-radius: 16px;
    border: 2px solid ${({ theme }) => theme?.colors?.primary || "#B648A0"};
    min-width: 300px;
`;

const ErrorText = styled.p`
    color: #ff6b6b;
    font-size: 1.1rem;
    font-weight: 600;
    text-align: center;
    margin: 0;
`;