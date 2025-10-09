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
                <ProfileAvatar avatar={post.account.avatar} alt="" />
                <span>{post.account.name || "Unknown"}</span>
                {/* Nome do usuário */}
                {/* Data do post */}
            </PostHeader>
            <div>
                {/* Titulo do post */}
            </div>
            <div>
                {/* Imagem do post */}
            </div>
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

