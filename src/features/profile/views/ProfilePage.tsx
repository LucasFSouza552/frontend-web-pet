import { useCallback, useContext, useEffect, useRef } from "react";
import styled from "styled-components";

import animationFile from "@/shared/assets/lottie/loading.lottie?url";
import Section from "../../../shared/styles/SectionStyle";
import ProfileCard from "../components/ProfileCard";
import { HeaderComponent } from "../../../shared/components/HeaderComponent";

import { AuthContext } from "../../auth/AuthContext";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { PostsContext } from "../../post/postContext";

import backgroundPage from "../../../shared/assets/images/background-page.jpg";
import { useNavigate, useParams } from "react-router-dom";
import { ProfileContext } from "../profileContext";
import PostsContainerList from "../../post/components/PostsContainerList";
import SideBar from "../../../shared/components/Sidebar";

export default function ProfileSection() {
    const navigate = useNavigate();

    const { account, loading } = useContext(AuthContext);
    const { account: currentProfile, accountStatus, loadProfile } = useContext(ProfileContext);

    if (!account && !loading) {
        navigate("/");
    }

    const profileAccountId = useParams().username;

    useEffect(() => {
        if (!profileAccountId) return
        loadProfile(profileAccountId);
    }, []);


    const { userPosts, refreshUserPosts, loadMoreUserPosts, hasMoreUserPosts, loadingUserPosts } = useContext(PostsContext);
    const observer = useRef<IntersectionObserver>(null);

    useEffect(() => {
        refreshUserPosts(profileAccountId);
    }, [profileAccountId]);

    const lastPostRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMoreUserPosts) {
                    loadMoreUserPosts(profileAccountId);
                }
            });
            if (node) observer.current.observe(node);
        },
        [hasMoreUserPosts, loadMoreUserPosts, profileAccountId, loadingUserPosts]
    );

    if (loading) {
        return <DotLottieReact src={animationFile} autoplay loop style={{ width: "500px" }} />;
    }

    return (
        <ProfileContainer>
            <HeaderComponent account={account} />
            {/* <SideBar account={account} /> */}
            <SectionContent>

                {currentProfile && accountStatus && <ProfileCard account={currentProfile} accountStatus={accountStatus} />}
                <PostsContainerList account={account} posts={userPosts} title={"Suas publicações"} refCallback={lastPostRef} />

            </SectionContent >
        </ProfileContainer>
    );
}





const ProfileContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100dvh;
    width: 100%;
`;

const SectionContent = styled(Section)`
    display: flex;
    align-items: center;
    width: 100%;
    flex-direction: column; width: 100%;
    height: 100%;
    min-height: calc(100dvh - var(--header-height));
    background-image: url(${backgroundPage});
    background-size: cover;
    background-position: center;
    background-repeat: repeat;
    background-attachment: fixed;
`;