import { styled } from "styled-components";
import PostComponent from "./postComponent";
import type { IPost } from "../../../shared/models/Post";
import React from "react";
import type { IAccount } from "../../../shared/models/Account";

interface PostsContainerProps {
    account: IAccount | null;
    posts: IPost[];
    title: string;
    refCallback: React.RefCallback<HTMLDivElement>;
}

export default function PostsContainer({ account, posts, title, refCallback }: PostsContainerProps) {
    
    return (
        <PostContainer>
            {<h2>{title}</h2>}

            {posts?.length > 0 && posts?.map((post: IPost, index: number) => {
                const isLast = index === posts.length - 1;

                // const Wrapper = isLast ? LastPostWrapper : React.Fragment;

                return (
                    <PostWrapper ref={isLast ? refCallback : null} key={post.id}>
                        <PostComponent key={post.id} post={post} accountId={account?.id || ""} />
                    </PostWrapper>
                );
            })}
        </PostContainer>

    )
}

const PostWrapper = styled.div`
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

const LastPostWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;