import { useCallback, useContext, useEffect, useRef } from "react";
import styled from "styled-components";

import animationFile from "@/shared/assets/lottie/loading.lottie?url";
import Section from "@styles/SectionStyle";
import ProfileCard from "../components/ProfileCard";
import { HeaderComponent } from "@components/HeaderComponent";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

import backgroundPage from "@assets/images/background-page.jpg";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "@/shared/contexts/AuthContext";
import { ProfileContext } from "@/shared/contexts/ProfileContext";
import { PostsContext } from "@/shared/contexts/PostContext";
import PostsContainerList from "@/features/post/components/PostsContainerList";
import SideBar from "@/shared/components/Sidebar";

export default function ProfileSection() {
    const navigate = useNavigate();

    const { loading } = useContext(AuthContext);
    const { account, viewedAccount, loadViewedProfile, viewedAccountStatus, loadingViewedAccount } = useContext(ProfileContext);

    useEffect(() => {
        if (!loading && !account) {
            navigate("/");
        }
    }, [loading, account, navigate]);


    const profileAccountId = useParams().username;

    useEffect(() => {
        if (!profileAccountId) return
        loadViewedProfile(profileAccountId);
    }, [profileAccountId]);


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

    // if (loading) {
    //     return <div><DotLottieReact src={animationFile} autoplay loop style={{ width: "1000px" }} /></div>
    // }

    return (
        <ProfileContainer>

            <SectionContent>
                <SideBar account={account} />
                <div style={{ width: "100%", flexDirection: "column", display: "flex" }}>
                    {loadingViewedAccount && <DotLottieReact src={animationFile} autoplay loop style={{ width: "500" }} />}
                    {!loadingViewedAccount && viewedAccount && viewedAccountStatus && <ProfileCard account={viewedAccount} accountStatus={viewedAccountStatus} />}

                    {/* <HeaderComponent account={account} /> */}
                    <PostsContainerList account={viewedAccount} posts={userPosts} title={"Suas publicações"} refCallback={lastPostRef} />
                </div>

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
    align-items: flex-start;
    width: 100%;    
    flex-direction: row;
    width: 100%;
    height: 100%;
    min-height: calc(100dvh);
    background-image: url(${backgroundPage});
    background-size: cover;
    background-position: center;
    background-repeat: repeat;
    background-attachment: fixed;
`;