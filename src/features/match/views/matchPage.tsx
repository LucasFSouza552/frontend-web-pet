import { styled } from "styled-components";
import { HeaderComponent } from "../../../shared/components/HeaderComponent";
import MatchCard from "../components/MatchCard";
import Section from "../../../shared/styles/SectionStyle";
import backgroundPage from "../../../shared/assets/images/background-page.jpg";
import { useContext, useEffect } from "react";
import { ProfileContext } from "../../profile/profileContext";
import { AuthContext } from "../../auth/AuthContext";
import MatchCardSkeleton from "../components/MatchCardSkeleton";
import NoMorePetsCard from "../components/NoMorePetsCard";

export default function MatchSection() {

    const { account } = useContext(AuthContext);
    const { loadFeed, petFeed, loadingFeed, hasMorePets } = useContext(ProfileContext);

    useEffect(() => {
        loadFeed();
    }, []);


    return (
        <Container>
            <HeaderComponent account={account} />
            <SectionContent>
                {loadingFeed ? (
                    <MatchCardSkeleton />
                ) : !hasMorePets ? (
                    <NoMorePetsCard />
                ) : (
                    <MatchCard Pet={petFeed[petFeed.length - 1]} />
                )}
            </SectionContent>
        </Container>
    );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const SectionContent = styled(Section)`
    display: flex;
    align-items: center;
    width: 100%;
    flex-direction: column;
    min-height: 100%;
    max-height: calc(100dvh - var(--header-height));
    background-image: url(${backgroundPage});
    background-size: cover;
    background-position: center;
    background-repeat: repeat;
    background-attachment: fixed;
    justify-content: center;
`;