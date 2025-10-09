import styled from "styled-components"
import ProfileAvatar from "../../../shared/components/ProfileAvatar"
import type { Post } from "../../../shared/models/post";

interface PostCardProps {
    post: Post;
    onLike?: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {

    return (
        <PostContainer>

            <PostHeader>
                <ProfileAvatar avatar={post.account.avatar || ""} alt={post.account.name} />
                {/* Imagem do usuário */}
                <ProfileAvatar avatar={post.account.avatar} alt="" />
                <span>{post.account.name || "Unknown"}</span>
                {/* Nome do usuário */}
                {/* Data do post */}
            </PostHeader>
            <div>
                {/* Titulo do post */}
                <div>{post.title}</div>
            </div>
            <PictureContainer>
                {/* Imagem do post */}
                {post.images?.map((image) => <PostPicture>{image}</PostPicture>)}
            </PictureContainer>
            <div>
                <div>
                    {/* Likes */}
                </div>
                <div>
                    {/* Comentarios */}
                </div>
                <div>
                    {/* Compartilhar */}
                </div>
            </div>

        </PostContainer>
    )
}

export default PostCard;

const PictureContainer = styled.div`
    display: flex;
    overflow-x: auto;
    gap: 8px;
    background-color: aqua;
    width: 100%;
    height: 300px;
    
`;

const PostPicture = styled.div`
    
`;

const PostContainer = styled.div`
    border-radius: 12px;
    height: auto;
    background-color: red;
    padding: 10px;
    display: flex;
    flex-direction: column;
    
`

const PostHeader = styled.div`
    display: flex;
    align-items: center;
    flex-direction: row;
    gap: 10px;
`

