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
                <ProfileAvatar avatar={post.account.avatar || ""} alt="" />
                {/* Imagem do usuário */}
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
    background-color: blueviolet;
    border-radius: 12px;
    width: 30px;
`

const PostHeader = styled.div`
    
`

