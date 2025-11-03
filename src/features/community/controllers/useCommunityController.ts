import { useCallback, useContext, useEffect, useRef } from "react";
import { PostsContext } from "@/shared/contexts/PostContext";

export function useCommunityController() {
    const { posts, refreshPosts, loadMorePosts, hasMorePosts, loadingPosts } = useContext(PostsContext);
    const observer = useRef<IntersectionObserver>(null);

    useEffect(() => {
        refreshPosts();
    }, []);

    const lastPostRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMorePosts && !loadingPosts) {
                    loadMorePosts();
                }
            });
            if (node) observer.current.observe(node);
        },
        [hasMorePosts, loadMorePosts, loadingPosts]
    );

    return {
        posts,
        loadingPosts,
        lastPostRef,
        hasMorePosts,
        refreshPosts
    };
}

