import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { PostsContext } from "@/shared/contexts/PostContext";
import type { IPost } from "@/shared/models/post";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import animationFile from "@/shared/assets/lottie/loading.lottie?url";
import { useNavigate } from "react-router-dom";

export default function TrendingPosts() {
    const { topPosts } = useContext(PostsContext);
    const [posts, setPosts] = useState<IPost[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTopPosts = async () => {
            try {
                setLoading(true);
                const topPostsData = await topPosts();
                setPosts(topPostsData || []);
            } catch (error) {
                console.error("Erro ao carregar posts populares:", error);
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTopPosts();
    }, []);

    const handlePostClick = (postId: string) => {
        navigate(`/post/${postId}`);
    };

    if (loading) {
        return (
            <TrendingPostsContainer>
                <LoadingWrapper>
                    <DotLottieReact src={animationFile} autoplay loop style={{ width: "100px" }} />
                </LoadingWrapper>
            </TrendingPostsContainer>
        );
    }

    return (
        <TrendingPostsContainer>
            <SectionHeader>
                <h3>Mais Populares</h3>
                <p>Posts em alta na comunidade</p>
            </SectionHeader>
            {posts.length === 0 ? (
                <EmptyState>
                    <p>Nenhum post popular no momento</p>
                </EmptyState>
            ) : (
                <PostsList>
                    {posts.map((post, index) => (
                        <PostItem key={post.id} onClick={() => handlePostClick(post.id)}>
                            <PostRank>{index + 1}</PostRank>
                            <PostContent>
                                <PostTitle>{post.title || "Sem título"}</PostTitle>
                                <PostMeta>
                                    <span>{post.likes?.length || 0} curtidas</span>
                                </PostMeta>
                            </PostContent>
                        </PostItem>
                    ))}
                </PostsList>
            )}
        </TrendingPostsContainer>
    );
}

const TrendingPostsContainer = styled.aside`
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    flex: 1;
    flex-shrink: 0;
    max-width: 320px;
    height: fit-content;
    color: white;
    border: 1px solid ${({ theme }) => theme.colors.primary || "#B648A0"};
    background-color: ${({ theme }) => theme.colors.quarternary || "rgba(54, 49, 53, 0.95)"};
    padding: 1.25rem;
    box-shadow: 0 4px 12px rgba(182, 72, 160, 0.2);
    overflow-y: auto;
    align-self: flex-start;
    z-index: 5;
    
    &::-webkit-scrollbar {
        width: 4px;
    }
    
    &::-webkit-scrollbar-track {
        background: transparent;
    }
    
    &::-webkit-scrollbar-thumb {
        background: ${({ theme }) => theme.colors.primary || "#B648A0"};
        border-radius: 2px;
    }

    @media (max-width: 1024px) {
        display: none;
    }
`;

const SectionHeader = styled.div`
    padding-bottom: 1rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.primary};
    margin-bottom: 1rem;

    h3 {
        font-size: 1.1rem;
        margin-bottom: 0.25rem;
        color: ${({ theme }) => theme.colors.primary || "#B648A0"};
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-weight: 600;
    }

    p {
        font-size: 0.75rem;
        color: rgba(255, 255, 255, 0.6);
        margin: 0;
    }
`;

const LoadingWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
`;

const EmptyState = styled.div`
    padding: 2rem 1rem;
    text-align: center;
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.875rem;
`;

const PostsList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
`;

const PostItem = styled.li`
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.875rem;
    border-radius: 8px;
    background-color: rgba(44, 39, 43, 0.6);
    transition: all 0.3s ease;
    cursor: pointer;
    border: 1px solid transparent;

    &:hover {
        background-color: ${({ theme }) => theme.colors.primary || "#B648A0"};
        transform: translateX(4px);
        border-color: ${({ theme }) => theme.colors.primary || "#B648A0"};
        box-shadow: 0 2px 8px rgba(182, 72, 160, 0.3);
    }

    &:active {
        transform: translateX(2px);
    }
`;

const PostRank = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.primary || "#B648A0"};
    color: white;
    font-weight: bold;
    font-size: 0.75rem;
    flex-shrink: 0;
`;

const PostContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1;
    min-width: 0;
`;

const PostTitle = styled.span`
    font-size: 0.875rem;
    font-weight: 500;
    color: white;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.4;
`;

const PostMeta = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.7);
    margin-top: 0.25rem;
`;

