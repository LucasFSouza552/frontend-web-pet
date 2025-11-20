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
                    <DotLottieReact src={animationFile} autoplay loop style={{ width: "500px" }} />
                </LoadingContainer>
            );
        }

        switch (activeTab) {
            case "posts":
                return <PostsTab account={viewedAccount} profileAccountId={profileAccountId} />;
            case "pets":
                return <PetsTab accountId={viewedAccount?.id} accountRole={viewedAccount?.role} />;
            case "adopted":
                return <AdoptedPetsTab accountId={viewedAccount?.id} accountRole={viewedAccount?.role} />;
            case "history":
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
    padding: 3rem;
`;