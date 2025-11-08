import { useState, useRef } from "react";
import styled from "styled-components";
import { useContext } from "react";
import { ProfileContext } from "@/shared/contexts/ProfileContext";
import { PostsContext } from "@/shared/contexts/PostContext";
import { postService } from "@/shared/api/postService";
import ProfileAvatar from "@/shared/components/ProfileAvatar";
import { FaImage, FaTimes, FaPaperPlane } from "react-icons/fa";

export default function CreatePostForm() {
    const { account } = useContext(ProfileContext);
    const { refreshPosts } = useContext(PostsContext);
    const [content, setContent] = useState("");
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length + images.length > 6) {
            alert("Você pode adicionar no máximo 6 imagens");
            return;
        }

        const newImages = [...images, ...files];
        setImages(newImages);
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews([...imagePreviews, ...newPreviews]);
    };

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        
        URL.revokeObjectURL(imagePreviews[index]);
        
        setImages(newImages);
        setImagePreviews(newPreviews);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!content.trim()) {
            alert("Por favor, escreva algo no post");
            return;
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("content", content);
            
            images.forEach((image) => {
                formData.append("images", image);
            });

            await postService.createPost(formData);

            setContent("");
            setImages([]);
            imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
            setImagePreviews([]);
            
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            refreshPosts();
        } catch (error) {
            console.error("Erro ao criar post:", error);
            alert("Erro ao criar post. Tente novamente.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!account) {
        return null;
    }

    return (
        <FormContainer>
            <FormHeader>
                <ProfileAvatar avatar={account.avatar} alt={account.name} width={48} border />
                <UserInfo>
                    <UserName>{account.name}</UserName>
                    <UserRole>{account.role === "institution" ? "Instituição" : "Usuário"}</UserRole>
                </UserInfo>
            </FormHeader>

            <Form onSubmit={handleSubmit}>

                <ContentTextarea
                    placeholder="No que você está pensando?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                />

                {imagePreviews.length > 0 && (
                    <ImagePreviewContainer>
                        {imagePreviews.map((preview, index) => (
                            <ImagePreviewItem key={index}>
                                <PreviewImage src={preview} alt={`Preview ${index + 1}`} />
                                <RemoveImageButton
                                    type="button"
                                    onClick={() => removeImage(index)}
                                >
                                    <FaTimes size={14} />
                                </RemoveImageButton>
                            </ImagePreviewItem>
                        ))}
                    </ImagePreviewContainer>
                )}

                <FormActions>
                    <ImageInputWrapper>
                        <ImageInput
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageSelect}
                        />
                        <ImageButton type="button" onClick={() => fileInputRef.current?.click()}>
                            <FaImage size={18} />
                            Adicionar Fotos
                        </ImageButton>
                    </ImageInputWrapper>

                    <SubmitButton type="submit" disabled={isSubmitting || !content.trim()}>
                        <FaPaperPlane size={16} />
                        {isSubmitting ? "Publicando..." : "Publicar"}
                    </SubmitButton>
                </FormActions>
            </Form>
        </FormContainer>
    );
}

const FormContainer = styled.div`
    width: 100%;
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.quarternary} 0%, ${({ theme }) => theme.colors.quinary} 100%);
    border-radius: 16px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    border: 1px solid ${({ theme }) => theme.colors.primary || "#B648A0"};
    box-shadow: 0 4px 16px rgba(182, 72, 160, 0.2);
    backdrop-filter: blur(10px);
`;

const FormHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.25rem;
`;

const UserInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
`;

const UserName = styled.span`
    color: white;
    font-size: 1rem;
    font-weight: 600;
`;

const UserRole = styled.span`
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.875rem;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const TitleInput = styled.input`
    width: 100%;
    padding: 12px 16px;
    border-radius: 12px;
    border: 2px solid rgba(255, 255, 255, 0.1);
    outline: none;
    background-color: rgba(255, 255, 255, 0.05);
    color: white;
    font-size: 1rem;
    transition: all 0.3s ease;

    &::placeholder {
        color: rgba(255, 255, 255, 0.5);
    }

    &:focus {
        border-color: ${({ theme }) => theme.colors.primary || "#B648A0"};
        box-shadow: 0 0 0 3px rgba(182, 72, 160, 0.2);
        background-color: rgba(255, 255, 255, 0.08);
    }
`;

const ContentTextarea = styled.textarea`
    width: 100%;
    padding: 12px 16px;
    border-radius: 12px;
    border: 2px solid rgba(255, 255, 255, 0.1);
    outline: none;
    background-color: rgba(255, 255, 255, 0.05);
    color: white;
    font-size: 1rem;
    font-family: inherit;
    resize: vertical;
    min-height: 120px;
    transition: all 0.3s ease;

    &::placeholder {
        color: rgba(255, 255, 255, 0.5);
    }

    &:focus {
        border-color: ${({ theme }) => theme.colors.primary || "#B648A0"};
        box-shadow: 0 0 0 3px rgba(182, 72, 160, 0.2);
        background-color: rgba(255, 255, 255, 0.08);
    }
`;

const ImagePreviewContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 0.75rem;
    padding: 1rem;
    background-color: rgba(255, 255, 255, 0.03);
    border-radius: 12px;
`;

const ImagePreviewItem = styled.div`
    position: relative;
    width: 100%;
    aspect-ratio: 1;
    border-radius: 8px;
    overflow: hidden;
`;

const PreviewImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const RemoveImageButton = styled.button`
    position: absolute;
    top: 4px;
    right: 4px;
    background: rgba(0, 0, 0, 0.7);
    border: none;
    color: white;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background: rgba(0, 0, 0, 0.9);
        transform: scale(1.1);
    }
`;

const FormActions = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding-top: 0.5rem;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const ImageInputWrapper = styled.div`
    flex: 1;
`;

const ImageInput = styled.input`
    display: none;
`;

const ImageButton = styled.button`
    padding: 12px 20px;
    border-radius: 12px;
    border: 2px solid ${({ theme }) => theme.colors.primary || "#B648A0"};
    background: transparent;
    color: ${({ theme }) => theme.colors.primary || "#B648A0"};
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;

    &:hover {
        background: ${({ theme }) => theme.colors.primary || "#B648A0"};
        color: white;
        transform: translateY(-2px);
    }

    @media (max-width: 768px) {
        width: 100%;
        justify-content: center;
    }
`;

const SubmitButton = styled.button`
    padding: 12px 24px;
    border-radius: 12px;
    border: none;
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary || "#B648A0"} 0%, #a502b4 100%);
    color: white;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
    white-space: nowrap;

    &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(182, 72, 160, 0.4);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    @media (max-width: 768px) {
        width: 100%;
        justify-content: center;
    }
`;

