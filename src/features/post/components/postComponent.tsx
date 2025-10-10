import styled from "styled-components"
import ProfileAvatar from "../../../shared/components/ProfileAvatar"
import type { Post } from "../../../shared/models/post";

interface PostCardProps {
    post: Post;
    onLike?: (postId: string) => void;
}

const PostPictureContainer = ({ images }: { images: string[] }) => {
    if (!images || images.length === 0) return null;
    return (
        <PictureContainer>
            {images.map((image) => <PostPicture>{image}</PostPicture>)}
        </PictureContainer>
    )
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {

    if (!post || !post.account) return null;

    return (
        <PostContainer>

            <PostHeader>
                <ProfileAvatar avatar={post.account.avatar || ""} alt={post.account.name} />
                {/* Imagem do usuário */}
                <span>{post.account.name || "Unknown"}</span>
                {/* Nome do usuário */}
                {/* Data do post */}
            </PostHeader>
            <div>
                {/* Titulo do post */}
                <div>{post.title}</div>
            </div>
            <PostPictureContainer images={post.images || []} />
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

