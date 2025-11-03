import { useCallback, useContext, useEffect, useRef } from "react";
import { PostsContext } from "@contexts/PostContext";
import PostsContainerList from "@/features/post/components/PostsContainerList";
import type { IAccount } from "@models/Account";

interface PostsTabProps {
    account: IAccount | null;
    profileAccountId?: string;
}

export default function PostsTab({ account, profileAccountId }: PostsTabProps) {
    const { userPosts, refreshUserPosts, loadMoreUserPosts, hasMoreUserPosts, loadingUserPosts } = useContext(PostsContext);
    const observer = useRef<IntersectionObserver>(null);

    useEffect(() => {
        if (profileAccountId) {
            refreshUserPosts(profileAccountId);
        }
    }, [profileAccountId, refreshUserPosts]);

    const lastPostRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMoreUserPosts && !loadingUserPosts) {
                    loadMoreUserPosts(profileAccountId);
                }
            });
            if (node) observer.current.observe(node);
        },
        [hasMoreUserPosts, loadMoreUserPosts, profileAccountId, loadingUserPosts]
    );

    return (
        <PostsContainerList 
            account={account} 
            posts={userPosts} 
            title={"Suas publicações"} 
            refCallback={lastPostRef} 
        />
    );
}

