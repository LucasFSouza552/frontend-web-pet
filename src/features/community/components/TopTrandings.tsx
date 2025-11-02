import { PostsContext } from "@/shared/contexts/PostContext";
import type { IPost } from "@/shared/models/Post";
import { useContext, useEffect, useState } from "react";
import { styled } from "styled-components"

export default function TopTrandings() {

    const { topPosts } = useContext(PostsContext);
    const [posts, setPosts] = useState<IPost[]>([]);

    useEffect(() => {

        topPosts().then((posts) => setPosts(posts));

    }, [topPosts]);

return (
    <RightSideContainer>
        <div className="active-communities">
            <h3>Mais populares</h3>
            <ul>
                {posts.map((post) => (
                    <li key={post.id}>
                        <span>{post.title}</span>
                    </li>
                ))}
            </ul>
        </div>
    </RightSideContainer>
)
}

const RightSideContainer = styled.aside`
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 25px;
    flex: 1;
    height: max-content;
    color: white;
    border: 1px solid #B648A0;
    position: sticky;
    background-color: #363135;
    top: 0;
    padding: 20px;
    box-shadow: 0 0 10px rgba(182, 72, 160, 0.3);

    .active-communities {
        width: 100%;
    }

    h3 {
        font-size: 1.2rem;
        margin-bottom: 15px;
        text-align: center;
        color: #B648A0;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    li {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 15px;
        border-radius: 8px;
        background-color: #2c272b;
        transition: all 0.3s ease;
        cursor: pointer;
    }

    li:hover {
        background-color: #B648A0;
        transform: scale(1.03);
    }

    .community-icon {
        font-size: 1.2rem;
        color: white;
    }

    span {
        font-size: 1rem;
        font-weight: 500;
    }

    @media (max-width: 900px) {
        display: none;
    }
`
