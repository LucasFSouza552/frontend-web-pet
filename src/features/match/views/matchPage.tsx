import { styled } from "styled-components";
import { HeaderComponent } from "../../../shared/components/HeaderComponent";
import MatchCard from "../components/MatchCard";
import Section from "../../../shared/styles/SectionStyle";
import backgroundPage from "../../../shared/assets/images/background-page.jpg";
import { useContext, useEffect } from "react";
import MatchCardSkeleton from "../components/MatchCardSkeleton";
import NoMorePetsCard from "../components/NoMorePetsCard";
import { ProfileContext } from "@/shared/contexts/ProfileContext";
import SideBar from "@/shared/components/Sidebar";

export default function MatchSection() {

    const { account } = useContext(ProfileContext);
    const { loadFeed, petFeed, loadingFeed, hasMorePets } = useContext(ProfileContext);

    useEffect(() => {
        loadFeed();
    }, []);


    return (
        <Container>
            <SectionContent>
                <SideBar account={account} />
                <MatchContentWrapper>

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
    padding: 20px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const SectionContent = styled(Section)`
    display: flex;
    width: 100%;
    flex-direction: row;
    min-height: 100%;
    max-height: calc(100dvh);
    background-image: url(${backgroundPage});
    background-size: cover;
    background-position: center;
    background-repeat: repeat;

    background-attachment: fixed;
`;