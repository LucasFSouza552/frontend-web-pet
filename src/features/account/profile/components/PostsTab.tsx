import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { styled } from "styled-components";
import { PostsContext } from "@contexts/PostContext";
import PostsContainerList from "@/features/post/components/PostsContainerList";
import type { IAccount } from "@/shared/models/Account";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import animationFile from "@/shared/assets/lottie/loading.lottie?url";

interface PostsTabProps {
    account: IAccount | null;
    profileAccountId?: string;
}

export default function PostsTab({ account, profileAccountId }: PostsTabProps) {
    const { userPosts, refreshUserPosts, loadMoreUserPosts, hasMoreUserPosts, loadingUserPosts } = useContext(PostsContext);
    const observer = useRef<IntersectionObserver>(null);
    const [initialLoading, setInitialLoading] = useState(false);

    useEffect(() => {
        if (!profileAccountId) {
            setInitialLoading(false);
            return;
        }
        
        setInitialLoading(true);
        refreshUserPosts(profileAccountId).finally(() => {
            setInitialLoading(false);
        });
    }, [profileAccountId]);

    const lastPostRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMoreUserPosts && !loadingUserPosts && !initialLoading) {
                    loadMoreUserPosts(profileAccountId);
                }
            });
            if (node) observer.current.observe(node);
        },
        [hasMoreUserPosts, loadMoreUserPosts, profileAccountId, loadingUserPosts, initialLoading]
    );

    if (initialLoading) {
        return (
            <LoadingContainer>
                <DotLottieReact src={animationFile} autoplay loop style={{ width: "200px" }} />
            </LoadingContainer>
        );
    }

    return (
        <PostsTabContainer>
            <PostsContainerList
                account={account}
                posts={userPosts}
                title={"Suas publicações"}
                refCallback={lastPostRef}
            />
            {loadingUserPosts && (
                <LoadingContainer>
                    <DotLottieReact src={animationFile} autoplay loop style={{ width: "150px" }} />
                </LoadingContainer>
            )}
        </PostsTabContainer>
    );
}

const PostsTabContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const LoadingContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    min-height: 200px;
`;

