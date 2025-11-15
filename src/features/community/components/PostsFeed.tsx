import { useContext } from "react";
import styled from "styled-components";
import { ProfileContext } from "@contexts/ProfileContext";
import PostsContainerList from "@/features/post/components/PostsContainerList";
import type { RefCallback } from "react";
import type { IPost } from "@models/post";

interface PostsFeedProps {
    posts: IPost[];
    refCallback?: RefCallback<HTMLDivElement>;
}

export default function PostsFeed({ posts, refCallback }: PostsFeedProps) {
    const { account } = useContext(ProfileContext);

    return (
        <FeedContainer>
            <PostsContainerList
                account={account}
                posts={posts}
                title={"Comunidade"}
                refCallback={refCallback || (() => {})}
            />
        </FeedContainer>
    );
}

const FeedContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`;

