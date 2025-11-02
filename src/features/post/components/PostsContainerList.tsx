import { styled } from "styled-components";
import type { IPost } from "../../../shared/models/Post";
import React from "react";
import type { IAccount } from "../../../shared/models/Account";
import PostModal from "./PostModal";
import PostCard from "./PostCard";
import AboutPost from "./AboutPost";

interface PostsContainerProps {
    account?: IAccount | null;
    posts: IPost[];
    title: string;
    refCallback: React.RefCallback<HTMLDivElement>;
}

export default function PostsContainerList({ account, posts, title, refCallback }: PostsContainerProps) {

    const [postOptions, setPostOptions] = React.useState<string>("");
    const [postAbout, setPostAbout] = React.useState<string>("");

    const handleOptions = (postId?: string) => {
        const isSamePost = postOptions === postId ? "" : postId;
        setPostOptions(isSamePost || "");
    }

    const handleAbout = (postId?: string) => {
        const isSamePost = postAbout === postId ? "" : postId;
        setPostAbout(isSamePost || "");
        setPostOptions("");
    }
    
    return (
        <PostContainer>
            <h2>{title}</h2>
            {posts?.length > 0 && posts?.map((post: IPost, index: number) => {
                const isLast = index === posts.length - 1;
                return (
                    <PostWrapper ref={isLast ? refCallback : null} key={post.id}>
                        <PostCard key={post.id} post={post} accountId={account?.id || ""} handleOptions={handleOptions} />
                        {postOptions === post.id && <PostModal postId={post.id} moreOptions={post.account.id === account?.id} closeModal={handleOptions} handleAbout={handleAbout} />}
                        {postAbout === post.id && <AboutPost post={post} onClose={handleAbout} />}
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
  position: relative;
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