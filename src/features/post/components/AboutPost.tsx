import ProfileAvatar from "@components/ProfileAvatar";
import type { IPost } from "@models/post";
import { styled } from "styled-components";
import { BsX } from "react-icons/bs";

export default function AboutPost({
    post,
    onClose
}: {
    post: IPost;
    onClose?: () => void;
}) {
    return (
        <ModalContainer>
            <CloseButton onClick={onClose}>
                <BsX size={40} color="white" />
            </CloseButton>

            <Header>
                <ProfileAvatar
                    avatar={post?.account.avatar}
                    alt={post?.account.name}
                    width={60}
                />
                <div>
                    <h3>{post?.account?.name}</h3>
                    <DateContainer>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        {post.updatedAt && post.createdAt && post.updatedAt !== post.createdAt && (
                            <EditedBadge title={`Editado em ${new Date(post.updatedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}`}>
                                editado
                            </EditedBadge>
                        )}
                    </DateContainer>
                </div>
            </Header>

            <Stats>
                <p>
                    <strong>{post?.likes?.length}</strong> curtidas
                </p>
                {post.comments && (
                    <p>
                        <strong>{post.comments.length}</strong> comentários
                    </p>
                )}
            </Stats>
        </ModalContainer>
    );
}

const ModalContainer = styled.div`
    background-color: ${({ theme }) => theme.colors.quarternary};
    border: 1px solid ${({ theme }) => theme.colors.primary};
    border-radius: 16px;
    padding: 32px;
    max-width: 400px;
    width: 90%;
    color: white;
    display: flex;
    flex-direction: column;
    gap: 24px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
    animation: fadeIn 0.3s ease-in-out;

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translate(-50%, -45%);
        }
        to {
            opacity: 1;
            transform: translate(-50%, -50%);
        }
    }
`;

const CloseButton = styled.button`
    position: absolute;
    top: 16px;
    right: 16px;
    background: transparent;
    border: none;
    color: ${({ theme }) => theme.colors.text || "white"};
    cursor: pointer;
    transition: transform 0.2s ease, color 0.2s ease;

    &:hover {
        color: ${({ theme }) => theme.colors.primary};
        transform: rotate(90deg);
    }
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;

    h3 {
        margin: 0;
        font-size: 1.2rem;
        color: ${({ theme }) => theme.colors.primary};
    }

    span {
        font-size: 0.9rem;
        color: white;
    }
`;

const DateContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
`;

const EditedBadge = styled.span`
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.5);
    font-weight: 400;
    font-style: italic;
    opacity: 0.7;
    transition: opacity 0.2s ease;

    &:hover {
        opacity: 1;
    }
`;

const Stats = styled.div`
    display: flex;
    justify-content: space-between;
    padding-top: 12px;
    border-top: 1px solid ${({ theme }) => theme.colors.primary};

    p {
        margin: 0;
        font-size: 0.95rem;
        color: white;

        strong {
            color: ${({ theme }) => theme.colors.primary};
        }
    }
`;
