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

export default function ProfileSection() {

    const { account, loading } = useContext(AuthContext);

    const { posts, refreshPosts, loadMorePosts, hasMore, loading: loadingPosts } = useContext(PostsContext);
    const observer = useRef<IntersectionObserver>(null);

    useEffect(() => {
        refreshPosts(account?.id);
    }, [account?.id]);

    const lastPostRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    loadMorePosts(account?.id);
                }
            });
            if (node) observer.current.observe(node);
        },
        [hasMore, loadMorePosts, account?.id]
    );

    return (
        <ProfileContainer>
            <HeaderComponent account={account} />

            <SectionContent>
                {/* {!loading && <DotLottieReact src={animationFile} autoplay loop style={{ width: "500px" }} />} */}

                {account && <ProfileCard />}

                <PostContainer>
                    {<h2>Posts</h2>}

                    {!loadingPosts && posts.length > 0 ? posts?.map((post: any, index: number) => {
                        if (index === posts.length - 1) {
                            return <div ref={lastPostRef} key={post.id}><PostComponent post={post} /></div>;
                        }
                        return <PostComponent key={post.id} post={post} />;
                    }) :
                        <DotLottieReact src={animationFile} autoplay loop style={{ width: "500px" }} />}
                </PostContainer>
            </SectionContent >
        </ProfileContainer>
    );
}

const PostContainer = styled.div`
    width: 100%;
    flex-direction: column;
    align-items: center;
    min-height: 100dvh;
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
    flex-direction: column;
`;