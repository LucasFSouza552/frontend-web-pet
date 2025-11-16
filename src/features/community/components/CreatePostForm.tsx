import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useContext } from "react";
import { ProfileContext } from "@contexts/ProfileContext";
import { PostsContext } from "@contexts/PostContext";
import { postService } from "@api/postService";
import ProfileAvatar from "@components/ProfileAvatar";
import { FaImage, FaTimes, FaSmile } from "react-icons/fa";

export default function CreatePostForm() {
    const { account } = useContext(ProfileContext);
    const { refreshPosts } = useContext(PostsContext);
    const [content, setContent] = useState("");
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const emojiPickerRef = useRef<HTMLDivElement>(null);
    const emojiButtonRef = useRef<HTMLButtonElement>(null);

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

    const insertEmojiAtCursor = (emoji: string) => {
        const el = textAreaRef.current;
        if (!el) {
            setContent(prev => prev + emoji);
            return;
        }
        const start = el.selectionStart ?? content.length;
        const end = el.selectionEnd ?? content.length;
        const before = content.slice(0, start);
        const after = content.slice(end);
        const next = `${before}${emoji}${after}`;
        setContent(next);
        setTimeout(() => {
            el.focus();
            const pos = start + emoji.length;
            el.setSelectionRange(pos, pos);
        }, 0);
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const pickerEl = emojiPickerRef.current;
            const btnEl = emojiButtonRef.current;
            if (pickerEl && !pickerEl.contains(e.target as Node) && btnEl && !btnEl.contains(e.target as Node)) {
                setShowEmojiPicker(false);
            }
        };
        if (showEmojiPicker) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showEmojiPicker]);

    const emojis = ["😀","😁","😂","🤣","😊","😍","😘","😎","🤔","😢","😭","😡","👍","👏","🙏","💙","🐶","🐱","🐾","✨","🔥","🎉","✅","❌", ];

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
            </FormHeader>

            <Form onSubmit={handleSubmit}>

                <ContentTextarea
                    placeholder="O que está acontecendo?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={3}
                    ref={textAreaRef}
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

                <ActionsBar>
                    <IconsRow>
                        <ImageInput
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageSelect}
                        />
                        <IconButton type="button" aria-label="Adicionar imagens" onClick={() => fileInputRef.current?.click()}>
                            <FaImage size={18} />
                        </IconButton>
                        <EmojiWrapper>
                            <IconButton
                                ref={emojiButtonRef}
                                type="button"
                                aria-label="Emoji"
                                onClick={() => setShowEmojiPicker((v) => !v)}
                            >
                                <FaSmile size={18} />
                            </IconButton>
                            {showEmojiPicker && (
                                <EmojiPicker ref={emojiPickerRef}>
                                    <EmojiGrid>
                                        {emojis.map((e, i) => (
                                            <EmojiItem
                                                key={`${e}-${i}`}
                                                onClick={() => {
                                                    insertEmojiAtCursor(e);
                                                    setShowEmojiPicker(false);
                                                }}
                                            >
                                                {e}
                                            </EmojiItem>
                                        ))}
                                    </EmojiGrid>
                                </EmojiPicker>
                            )}
                        </EmojiWrapper>
                    </IconsRow>
                    <SubmitButton type="submit" disabled={isSubmitting || !content.trim()}>
                        {isSubmitting ? "Postando..." : "Postar"}
                    </SubmitButton>
                </ActionsBar>
            </Form>
        </FormContainer>
    );
}

const FormContainer = styled.div`
    display: flex;
    align-items: flex-start;
    width: 100%;
    background: ${({ theme }) => theme.colors.quarternary};
    border-radius: 16px;
    padding: 1.5rem;
    flex-direction: row;
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
const Form = styled.form`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-left: 1rem;
`;

const ContentTextarea = styled.textarea`
    width: 100%;
    padding: 10px 4px;
    border-radius: 8px;
    border: none;
    outline: none;
    background-color: transparent;
    color: white;
    font-size: 1rem;
    font-family: inherit;
    resize: none;
    min-height: 64px;
    transition: all 0.3s ease;

    &::placeholder {
        color: rgba(255, 255, 255, 0.6);
    }

    &:focus {
        background-color: transparent;
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

const ActionsBar = styled.div`
width: 100%;  
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 0.75rem;
    padding-top: 0.25rem;
`;

const ImageInput = styled.input`
    display: none;
`;

const IconsRow = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    color: ${({ theme }) => theme.colors.primary || "#B648A0"};
`;

const IconButton = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
    color: ${({ theme }) => theme.colors.primary || "#B648A0"};
    border-radius: 6px;
    cursor: pointer;
    transition: 0.2s ease;

    &:hover:not(:disabled) {
        background: rgba(182, 72, 160, 0.15);
        transform: translateY(-1px);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const EmojiWrapper = styled.div`
    position: relative;
    display: inline-block;
`;

const EmojiPicker = styled.div`
    position: absolute;
    bottom: 40px;
    left: 0;
    background: rgba(20, 18, 20, 0.95);
    border: 1px solid rgba(182, 72, 160, 0.3);
    border-radius: 10px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    padding: 8px;
    z-index: 50;
    backdrop-filter: blur(6px);
`;

const EmojiGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(8, 28px);
    gap: 6px;
`;

const EmojiItem = styled.button`
    width: 28px;
    height: 28px;
    border-radius: 6px;
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 18px;
    line-height: 1;
    transition: 0.15s ease;
    &:hover {
        background: rgba(182, 72, 160, 0.15);
        transform: translateY(-1px);
    }
`;
const SubmitButton = styled.button`
    padding: 10px 16px;
    border-radius: 999px;
    border: none;
    background: ${({ theme }) => theme.colors.primary || "#B648A0"};
    color: white;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
    white-space: nowrap;

    &:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 4px 10px rgba(182, 72, 160, 0.35);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    @media (max-width: 768px) {
        justify-content: center;
    }
`;

