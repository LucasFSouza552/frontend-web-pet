import { styled } from "styled-components";
import type { Post } from "../models/post";

interface PostCardProps {
    post: Post;
    onLike?: (postId: string) => void; 
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike }) => {
    return (
        <CardContainer>
            <Header>
                <Avatar src={post.accountId.avatar || ""} alt={post.accountId.name} />
                <div>
                    <AuthorName>{post.accountId.name}</AuthorName>
                    <PostDate>{new Date(post.date).toLocaleDateString()}</PostDate>
                </div>
            </Header>

            <Content>{post.content}</Content>

            {post.images && post.images.length > 0 && (
                <ImagesContainer>
                    {post.images.map((img, idx) => (
                        <PostImage key={idx} src={img} alt={`post-${idx}`} />
                    ))}
                </ImagesContainer>
            )}

            <Footer>
                <LikeButton onClick={() => onLike?.(post.id)}>
                    ❤️ {post.likes.length}
                </LikeButton>
                <CommentsCount>{post.comments || 0} comentários</CommentsCount>
            </Footer>
        </CardContainer>
    );
};

const CardContainer = styled.div`
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 16px;
  margin-bottom: 20px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const AuthorName = styled.p`
  font-weight: bold;
  margin: 0;
`;

const PostDate = styled.span`
  font-size: 12px;
  color: #666;
`;

const Content = styled.p`
  font-size: 14px;
  margin-bottom: 12px;
`;

const ImagesContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
`;

const PostImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LikeButton = styled.button`
  background: none;
  border: none;
  color: #e0245e;
  cursor: pointer;
  font-size: 14px;
`;

const CommentsCount = styled.span`
  font-size: 14px;
  color: #666;
`;

export default PostCard;