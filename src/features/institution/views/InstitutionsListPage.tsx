import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { accountService } from "@/shared/api/accountService";
import type { IAccount } from "@/shared/models/Account";
import Section from "@/shared/styles/SectionStyle";
import backgroundPage from "@assets/images/background-page.jpg";
import { ProfileContext } from "@contexts/ProfileContext";
import SideBar from "@components/Sidebar";
import InstitutionCard from "@/features/institution/components/InstitutionCard";
import StickySidebar from "@/shared/styles/StickySidebar";
import ResponsiveSidebar, { HamburgerButton } from "@/shared/components/ResponsiveSidebar";
import { useResponsiveSidebar } from "@/shared/hooks/useResponsiveSidebar";

export default function InstitutionsListPage() {
    const navigate = useNavigate();
    const [institutions, setInstitutions] = useState<IAccount[]>([]);
    const [loading, setLoading] = useState(false);
    const { account } = useContext(ProfileContext);
    const { isMenuOpen, toggleMenu, closeMenu } = useResponsiveSidebar();

    const handleDonate = (institutionId: string) => {
        navigate(`/donate-institution/${institutionId}`);
    };

    const handleProfileInstitution = (institutionId: string) => {
        navigate(`/profile/${institutionId}`);
    }


    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const accounts = await accountService.searchAccount();
                const onlyInstitutions = (accounts || []).filter((acc: IAccount) => acc.role === "institution");
                setInstitutions(onlyInstitutions);
            } catch {
                setInstitutions([]);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <Container>
            <ResponsiveSidebar 
                account={account} 
                isMenuOpen={isMenuOpen} 
                onCloseMenu={closeMenu}
            />
            <BackgroundLayer />
            <SectionContent>
                <StickySidebar>
                    <SideBar account={account} />
                </StickySidebar>
                <ContentCard>
                    <HamburgerButton onClick={toggleMenu} />
                    <Header>
                        <h1>Instituições</h1>
                        <p>Conheça e apoie instituições cadastradas na plataforma.</p>
                    </Header>
                    {loading ? (
                        <Loading>Carregando...</Loading>
                    ) : institutions.length === 0 ? (
                        <EmptyState>Nenhuma instituição encontrada.</EmptyState>
                    ) : (
                        <CardsGrid>
                            {institutions.map((inst) => (
                                <InstitutionCard
                                    key={inst.id}
                                    institution={inst}
                                    onProfile={handleProfileInstitution}
                                    onDonate={handleDonate}
                                />
                            ))}
                        </CardsGrid>
                    )}
                </ContentCard>
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


const ContentCard = styled.div`
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    flex: 2;
    padding: 1.5rem;
    gap: 10px;
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

const Header = styled.div`
    color: white;
    h1 {
        margin: 0;
        font-size: 1.75rem;
    }
    p {
        margin: 0.25rem 0 0 0;
        opacity: 0.8;
    }
`;

const Loading = styled.div`
    color: white;
    padding: 2rem 0;
`;

const EmptyState = styled.div`
    color: rgba(255,255,255,0.8);
    background: rgba(0,0,0,0.25);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    padding: 2rem;
    text-align: center;
`;

const CardsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1rem;
`;

// Styles moved into InstitutionCard

