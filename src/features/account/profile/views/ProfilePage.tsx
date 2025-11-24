import { useContext, useEffect, useState } from "react";
import styled from "styled-components";

import animationFile from "@assets/lottie/loading.lottie?url";
import Section from "@styles/SectionStyle";
import ProfileCard from "../components/ProfileCard";
import ProfileTabs, { type TabType } from "../components/ProfileTabs";
import PostsTab from "../components/PostsTab";
import PetsTab from "../components/PetsTab";
import AdoptedPetsTab from "../components/AdoptedPetsTab";
import HistoryTab from "../components/HistoryTab";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

import backgroundPage from "@assets/images/background-page.jpg";
import { useNavigate, useParams } from "react-router-dom";
import { ProfileContext } from "@contexts/ProfileContext";
import ResponsiveSidebar, { HamburgerButton } from "@/shared/components/ResponsiveSidebar";
import { useResponsiveSidebar } from "@/shared/hooks/useResponsiveSidebar";
import SideBar from "@components/Sidebar";
import StickySidebar from "@/shared/styles/StickySidebar";

export default function ProfileSection() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabType>("posts");
    const { isMenuOpen, toggleMenu, closeMenu } = useResponsiveSidebar();

    const { account, loading, viewedAccount, loadViewedProfile, viewedAccountStatus, loadingViewedAccount } = useContext(ProfileContext);

    const profileAccountId = useParams().username;

    useEffect(() => {
        if (!profileAccountId) return;
        loadViewedProfile(profileAccountId);
    }, [profileAccountId, loadViewedProfile]);


    useEffect(() => {
        if (!account && !loading) {
            navigate("/");
        }
    }, [account, loading, navigate]);

    const renderTabContent = () => {
        if (loadingViewedAccount) {
            return (
                <LoadingContainer>
                    <LoadingCard>
                        <DotLottieReact src={animationFile} autoplay loop style={{ width: "300px", height: "300px" }} />
                        <LoadingText>Carregando perfil...</LoadingText>
                    </LoadingCard>
                </LoadingContainer>
            );
        }

        switch (activeTab) {
            case "posts":
                return <PostsTab account={viewedAccount} profileAccountId={profileAccountId} />;
            case "pets":
                return <PetsTab accountId={viewedAccount?.id} accountRole={viewedAccount?.role} currentAccount={account} />;
            case "adopted":
                return <AdoptedPetsTab accountId={viewedAccount?.id} accountRole={viewedAccount?.role} currentAccount={account} />;
            case "history":
                if (viewedAccount?.role === "institution") {
                    return null;
                }
                return <HistoryTab accountId={viewedAccount?.id} />;
            default:
                return null;
        }
    };

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
                <MainContent>
                    <HamburgerButton onClick={toggleMenu} />
                    {!loadingViewedAccount && viewedAccount && viewedAccountStatus && (
                        <ProfileCard account={viewedAccount} accountStatus={viewedAccountStatus} editButtonProfile={viewedAccount?.id === account?.id} />
                    )}
                    <ProfileTabs
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        accountRole={viewedAccount?.role}
                    />
                    {renderTabContent()}
                </MainContent>
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

const MainContent = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    overflow-y: auto;
`;

const LoadingContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 4rem 2rem;
    min-height: 400px;
`;

const LoadingCard = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    padding: 3rem;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    animation: fadeIn 0.3s ease-in;

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @media (max-width: 768px) {
        padding: 2rem 1.5rem;
        gap: 1.5rem;
    }

    @media (max-width: 480px) {
        padding: 1.5rem 1rem;
        gap: 1rem;
        border-radius: 16px;
    }
`;

const LoadingText = styled.p`
    color: rgba(255, 255, 255, 0.9);
    font-size: 1.2rem;
    font-weight: 500;
    margin: 0;
    text-align: center;
    letter-spacing: 0.5px;

    @media (max-width: 768px) {
        font-size: 1rem;
    }

    @media (max-width: 480px) {
        font-size: 0.9rem;
    }
`;