import styled, { keyframes, css } from "styled-components";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaComment } from "react-icons/fa";
import { postService } from "@api/postService";
import { pictureService } from "@api/pictureService";
import type { IPost } from "@models/Post";

export default function TopPostsSection() {
  const navigate = useNavigate();
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopPosts = async () => {
      try {
        setLoading(true);
        const topPosts = await postService.fetchTopPosts();
        setPosts(Array.isArray(topPosts) ? topPosts.slice(0, 4) : []);
      } catch (error) {
        console.error("Erro ao buscar top posts:", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopPosts();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-index"));
          if (entry.isIntersecting) {
            setVisibleCards((prev) =>
              prev.includes(index) ? prev : [...prev, index]
            );
          }
        });
      },
      { threshold: 0.3 }
    );

    cardsRef.current.forEach((el) => el && observer.observe(el));

    return () => observer.disconnect();
  }, [posts]);

  if (loading) {
    return (
      <Section>
        <Titulo>Top Posts</Titulo>
        <ContainerCards>
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} $visible={false}>
              <SkeletonContent />
            </Card>
          ))}
        </ContainerCards>
      </Section>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <Section>
      <Titulo>Top Posts</Titulo>
      <ContainerCards>
        {posts.map((post, i) => {
          const firstImage = post.image && post.image.length > 0 
            ? pictureService.fetchPicture(post.image[0]) 
            : null;
          const likesCount = post.likes?.length || 0;
          const commentsCount = post.comments?.length || 0;

          return (
            <Card
              key={post.id}
              ref={(el) => {
                if (el) cardsRef.current[i] = el;
              }}
              data-index={i}
              $visible={visibleCards.includes(i)}
              onClick={() => navigate(`/post/${post.id}`)}
            >

              {firstImage && (
                <PostImage src={firstImage} alt={post.title || "Post"} />
              )}

              <Texto>{post.content}</Texto>

              <Estatisticas>
                <EstatisticaItem>
                  <FaHeart />
                  <span>{likesCount}</span>
                </EstatisticaItem>
                <EstatisticaItem>
                  <FaComment />
                  <span>{commentsCount}</span>
                </EstatisticaItem>
              </Estatisticas>
            </Card>
          );
        })}
      </ContainerCards>
    </Section>
  );
}

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(60px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Section = styled.section`
  width: 100%;
  background-color: white;
  text-align: center;
  padding: 100px 40px;
`;

const Titulo = styled.h2`
  color: #B648A0;
  font-size: 34px;
  margin-bottom: 60px;
`;

const ContainerCards = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 40px;
`;

const Card = styled.div<{ $visible: boolean }>`
  background-color: #3B343A;
  color: white;
  width: 280px;
  min-height: 230px;
  border-radius: 20px;
  padding: 35px;
  text-align: left;
  border-top: 4px solid #B648A0;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  opacity: 0;
  transform: translateY(60px);
  transition: opacity 0.6s ease, transform 0.6s ease, cursor 0.3s ease;
  cursor: pointer;
  ${({ $visible }) =>
    $visible &&
    css`
      opacity: 1;
      transform: translateY(0);
      animation: ${fadeUp} 0.8s ease;
    `}

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: scale(1.02);
  }
`;

const PostImage = styled.img`
  width: 100%;
  max-height: 180px;
  object-fit: cover;
  border-radius: 12px;
  margin: 15px 0;
`;

const Texto = styled.p`
  font-size: 15px;
  color: #eaeaea;
  line-height: 1.5;
  margin: 15px 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Estatisticas = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const EstatisticaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #eaeaea;
  font-size: 14px;

  svg {
    color: #B648A0;
    font-size: 16px;
  }
`;

const SkeletonContent = styled.div`
  width: 100%;
  height: 200px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.1) 100%
  );
  background-size: 2000px 100%;
  animation: ${keyframes`
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  `} 2s infinite linear;
  border-radius: 12px;
`;
