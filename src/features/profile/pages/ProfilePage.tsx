import { useCallback, useContext, useEffect, useRef } from "react";
import styled from "styled-components";

import animationFile from "@/shared/assets/lottie/loading.lottie?url";
import Section from "../../../shared/styles/SectionStyle";
import ProfileCard from "../components/ProfileCard";
import { HeaderComponent } from "../../../shared/components/HeaderComponent";

import { AuthContext } from "../../auth/AuthContext";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { PostsContext } from "../../post/postContext";

import PostComponent from "../../post/components/postComponent"

import backgroundPage from "../../../shared/assets/images/background-page.jpg";
import { useNavigate } from "react-router-dom";

export default function ProfileSection() {
    const navigate = useNavigate();

    const { account, loading } = useContext(AuthContext);

    if (!account && !loading) {
        navigate("/");
    }

    const { userPosts, refreshUserPosts, loadMoreUserPosts, hasMoreUserPosts, loadingUserPosts } = useContext(PostsContext);
    const observer = useRef<IntersectionObserver>(null);


    useEffect(() => {
        refreshUserPosts(account?.id);
    }, [account?.id]);

    const lastPostRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMoreUserPosts) {
                    loadMoreUserPosts(account?.id);
                }
            });
            if (node) observer.current.observe(node);
        },
        [hasMoreUserPosts, loadMoreUserPosts, account?.id, loadingUserPosts]
    );

    if (loading) {
        return <DotLottieReact src={animationFile} autoplay loop style={{ width: "500px" }} />;
    }

    return (
        <ProfileContainer>
            <HeaderComponent account={account} />

            <SectionContent>

                {account && <ProfileCard />}

                <PostContainer>
                    {<h2>Suas Publicações</h2>}

                    {userPosts.length > 0 && userPosts?.map((post: any, index: number) => {
                        if (index === userPosts.length - 1) {
                            return <LastPostWrapper ref={lastPostRef} key={post.id}><PostComponent post={post} accountId={account?.id || ""} /></LastPostWrapper>;
                        }
                        return <PostComponent key={post.id} post={post} accountId={account?.id || ""} />;
                    })}
                </PostContainer>
            </SectionContent >
        </ProfileContainer>
    );
}

const LastPostWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const PostContainer = styled.div`
    width: 100%;
    flex-direction: column;
    align-items: center;
    flex-direction: column;
    gap: 1rem;
    display: flex;
    padding: 1rem;
    color: white;
`;

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