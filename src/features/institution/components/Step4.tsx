import { useState, useRef, useCallback } from "react";
import styled from "styled-components";
import { FaPlus, FaCheck, FaTimes, FaCrop } from "react-icons/fa";

export default function Step4({ handleChange }: { images?: string, handleChange: (key: string, value: string) => void }) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [croppedImage, setCroppedImage] = useState<string | null>(null);
    const [isCropping, setIsCropping] = useState(false);
    const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageUrl = event.target?.result as string;
                setSelectedImage(imageUrl);
                setIsCropping(true);
                setCroppedImage(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageLoad = () => {
        if (imageRef.current && containerRef.current) {
            const container = containerRef.current;
            const size = Math.min(container.clientWidth, container.clientHeight) - 20; 
            
            setCropArea({
                x: (container.clientWidth - size) / 2,
                y: (container.clientHeight - size) / 2,
                width: size,
                height: size
            });
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!isCropping || !imageRef.current || !containerRef.current) return;
        setIsDragging(true);
        const rect = containerRef.current.getBoundingClientRect();
        setDragStart({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !imageRef.current || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;
        
        const deltaX = currentX - dragStart.x;
        const deltaY = currentY - dragStart.y;
        
        setCropArea(prev => {
            const containerWidth = containerRef.current?.clientWidth || 400;
            const containerHeight = containerRef.current?.clientHeight || 400;
            
            return {
                ...prev,
                x: Math.max(0, Math.min(prev.x + deltaX, containerWidth - prev.width)),
                y: Math.max(0, Math.min(prev.y + deltaY, containerHeight - prev.height))
            };
        });
        
        setDragStart({ x: currentX, y: currentY });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleCrop = useCallback(() => {
        if (!selectedImage || !imageRef.current || !containerRef.current) return;

        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const container = containerRef.current!;
            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;
            
            // Calcular escala entre a imagem original e o preview
            const scaleX = img.width / containerWidth;
            const scaleY = img.height / containerHeight;
            
            // Calcular dimensões do crop na imagem original
            const cropWidth = cropArea.width * scaleX;
            const cropHeight = cropArea.height * scaleY;
            const cropX = cropArea.x * scaleX;
            const cropY = cropArea.y * scaleY;
            
            canvas.width = cropWidth;
            canvas.height = cropHeight;

            ctx.drawImage(
                img,
                cropX,
                cropY,
                cropWidth,
                cropHeight,
                0,
                0,
                canvas.width,
                canvas.height
            );

            canvas.toBlob((blob) => {
                if (blob) {
                    const croppedUrl = URL.createObjectURL(blob);
                    setCroppedImage(croppedUrl);
                    setIsCropping(false);
                    
                    // Converter para base64 para enviar
                    const reader = new FileReader();
                    reader.onload = () => {
                        handleChange("images", reader.result as string);
                    };
                    reader.readAsDataURL(blob);
                }
            }, 'image/jpeg', 0.9);
        };
        img.src = selectedImage;
    }, [selectedImage, cropArea, handleChange]);

    const handleCancel = () => {
        setSelectedImage(null);
        setCroppedImage(null);
        setIsCropping(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleReset = () => {
        setCroppedImage(null);
        setIsCropping(true);
    };

    return (
        <Step4Container>
            <ImageUploadSection>
                <ImageUploadArea ref={containerRef}>
                    {!selectedImage && !croppedImage ? (
                        <>
                            <UploadIcon>
                                <FaPlus size={64} />
                            </UploadIcon>
                            <HiddenFileInput
                                ref={fileInputRef}
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </>
                    ) : isCropping && selectedImage ? (
                        <CropContainer
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                        >
                            <CropImage
                                ref={imageRef}
                                src={selectedImage}
                                onLoad={handleImageLoad}
                                alt="Preview"
                            />
                            <CropOverlay>
                                <CropBox
                                    style={{
                                        left: `${cropArea.x}px`,
                                        top: `${cropArea.y}px`,
                                        width: `${cropArea.width}px`,
                                        height: `${cropArea.height}px`
                                    }}
                                />
                            </CropOverlay>
                            <CropControls>
                                <CropButton onClick={handleCancel}>
                                    <FaTimes /> Cancelar
                                </CropButton>
                                <CropButton primary onClick={handleCrop}>
                                    <FaCheck /> Confirmar
                                </CropButton>
                            </CropControls>
                        </CropContainer>
                    ) : croppedImage ? (
                        <PreviewContainer>
                            <PreviewImage src={croppedImage} alt="Cropped" />
                            <PreviewOverlay>
                                <PreviewButton onClick={handleReset}>
                                    <FaCrop /> Recortar novamente
                                </PreviewButton>
                            </PreviewOverlay>
                        </PreviewContainer>
                    ) : null}
                </ImageUploadArea>
            </ImageUploadSection>
            <FormSection>
                <Step4Description>
                    <h3>Adicione a foto do pet</h3>
                    {!selectedImage && !croppedImage && (
                        <p>Selecione uma imagem clicando na área ao lado</p>
                    )}
                    {isCropping && (
                        <p>Arraste a área de recorte para ajustar a imagem</p>
                    )}
                    {croppedImage && (
                        <p>Imagem recortada com sucesso! Você pode recortar novamente se desejar.</p>
                    )}
                </Step4Description>
            </FormSection>
        </Step4Container>
    );
}

const Step4Container = styled.div`
    display: flex;
    gap: 2rem;
    width: 100%;

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 1.5rem;
    }
`;

const ImageUploadSection = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const ImageUploadArea = styled.div`
    width: 100%;
    aspect-ratio: 1;
    max-width: 400px;
    border: 3px dashed ${({ theme }) => theme.colors.primary || "#B648A0"};
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: rgba(182, 72, 160, 0.05);
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    &:hover {
        background-color: rgba(182, 72, 160, 0.1);
        border-color: ${({ theme }) => theme.colors.primary || "#B648A0"};
        transform: scale(1.02);
    }

    input[type="file"] {
        position: absolute;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
        z-index: 10;
    }
`;

const UploadIcon = styled.div`
    color: ${({ theme }) => theme.colors.primary || "#B648A0"};
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
`;

const FormSection = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    justify-content: center;
`;

const Step4Description = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    color: white;

    h3 {
        font-size: 1.2rem;
        font-weight: 600;
        margin: 0;
        color: white;
    }

    p {
        font-size: 0.9rem;
        color: rgba(255, 255, 255, 0.7);
        margin: 0;
    }
`;

const HiddenFileInput = styled.input`
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
    z-index: 10;
`;

const CropContainer = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    cursor: move;
    overflow: hidden;
`;

const CropImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    user-select: none;
    pointer-events: none;
`;

const CropOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    pointer-events: none;
`;

const CropBox = styled.div`
    position: absolute;
    border: 3px solid ${({ theme }) => theme.colors.primary || "#B648A0"};
    background: transparent;
    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
    cursor: move;
    pointer-events: all;
    
    &::before,
    &::after {
        content: '';
        position: absolute;
        background: ${({ theme }) => theme.colors.primary || "#B648A0"};
    }
    
    &::before {
        width: 20px;
        height: 3px;
        top: -3px;
        left: 50%;
        transform: translateX(-50%);
    }
    
    &::after {
        width: 3px;
        height: 20px;
        left: -3px;
        top: 50%;
        transform: translateY(-50%);
    }
`;

const CropControls = styled.div`
    position: absolute;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 1rem;
    z-index: 20;
`;

const CropButton = styled.button<{ primary?: boolean }>`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    border: 2px solid ${({ theme, primary }) => primary ? theme.colors.primary || "#B648A0" : "rgba(255, 255, 255, 0.3)"};
    background-color: ${({ theme, primary }) => primary ? theme.colors.primary || "#B648A0" : "rgba(0, 0, 0, 0.7)"};
    color: white;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);

    &:hover {
        background-color: ${({ primary }) => primary ? "rgba(182, 72, 160, 0.8)" : "rgba(255, 255, 255, 0.2)"};
        transform: scale(1.05);
    }

    &:active {
        transform: scale(0.95);
    }
`;

const PreviewContainer = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 12px;
`;

const PreviewImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const PreviewOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;

    &:hover {
        opacity: 1;
    }
`;

const PreviewButton = styled.button`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    border: 2px solid ${({ theme }) => theme.colors.primary || "#B648A0"};
    background-color: rgba(182, 72, 160, 0.9);
    color: white;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);

    &:hover {
        background-color: ${({ theme }) => theme.colors.primary || "#B648A0"};
        transform: scale(1.05);
    }

    &:active {
        transform: scale(0.95);
    }
`;