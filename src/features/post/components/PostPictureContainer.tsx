import { useState } from "react";
import styled from "styled-components";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import AvatarDefault from "@assets/images/avatar-default.png";

const apiUrl = import.meta.env.VITE_API_URL;

interface PostPictureContainerProps {
    images: string[];
}

export default function PostPictureContainer({ images }: PostPictureContainerProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    
    if (!images || images.length === 0) return null;

    const goPrev = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const goNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const goTo = (index: number) => setCurrentIndex(index);

    const currentImage = images[currentIndex];

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (images.length <= 1) return;
        if (e.key === "ArrowLeft") goPrev();
        if (e.key === "ArrowRight") goNext();
    };

    const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        setTouchStartX(e.touches[0].clientX);
    };

    const onTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
        if (touchStartX === null) return;
        const diff = e.changedTouches[0].clientX - touchStartX;
        const threshold = 40;
        if (diff > threshold) goPrev();
        if (diff < -threshold) goNext();
        setTouchStartX(null);
    };

    return (
        <PictureContainer
            tabIndex={0}
            role="region"
            aria-label="Carrossel de imagens do post"
            onKeyDown={handleKeyDown}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
        >
            <PostPicture key={currentImage}>
                <img
                    src={`${apiUrl}/picture/${currentImage}`}
                    alt={currentImage || `post-image-${currentIndex + 1}`}
                    loading="lazy"
                    draggable={false}
                    onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = AvatarDefault;
                    }}
                />
            </PostPicture>
            {images.length > 1 && (
                <>
                    <CarouselButtonLeft onClick={goPrev} aria-label="Imagem anterior">
                        <FaChevronLeft />
                    </CarouselButtonLeft>
                    <CarouselButtonRight onClick={goNext} aria-label="Próxima imagem">
                        <FaChevronRight />
                    </CarouselButtonRight>
                    <ImageCounter>{currentIndex + 1}/{images.length}</ImageCounter>
                    <DotsContainer>
                        {images.map((_, i) => (
                            <Dot
                                key={`dot-${i}`}
                                $active={i === currentIndex}
                                onClick={() => goTo(i)}
                                aria-label={`Ir para imagem ${i + 1}`}
                            />
                        ))}
                    </DotsContainer>
                </>
            )}
        </PictureContainer>
    );
}

const PictureContainer = styled.div`
    position: relative;
    display: flex;
    overflow: hidden;
    inline-size: 100%;
    aspect-ratio: 16 / 9;
    max-block-size: 60vh;
    min-block-size: 220px;
    border-radius: 8px;
    outline: none;

    @media (max-width: 600px) {
        aspect-ratio: 4 / 3;
    }
`;

const PostPicture = styled.div`
    inline-size: 100%;
    block-size: 100%;
    
    img {
        inline-size: 100%;
        block-size: 100%;
        object-fit: cover;
        object-position: center;
        display: block;
        border-radius: 8px;
        user-select: none;
    }
`;

const CarouselButtonBase = styled.button`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.35);
    border: 1px solid rgba(255,255,255,0.2);
    color: #fff;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.1s ease;
    z-index: 5;

    &:hover {
        background: rgba(0, 0, 0, 0.5);
    }
`;

const CarouselButtonLeft = styled(CarouselButtonBase)`
    left: 8px;
`;

const CarouselButtonRight = styled(CarouselButtonBase)`
    right: 8px;
`;

const DotsContainer = styled.div`
    position: absolute;
    bottom: 8px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 6px;
    z-index: 5;
`;

const Dot = styled.button<{ $active: boolean }>`
    width: 8px;
    height: 8px;
    background: ${({ $active, theme }) => ($active ? theme.colors.primary : 'rgba(255,255,255,0.5)')};
    border: none;
    border-radius: 50%;
    cursor: pointer;
    padding: 0;
    transition: transform 0.2s ease, background 0.2s ease;

    &:hover {
        transform: scale(1.1);
    }
`;

const ImageCounter = styled.span`
    position: absolute;
    top: 8px;
    right: 10px;
    padding: 4px 8px;
    border-radius: 12px;
    background: rgba(0, 0, 0, 0.45);
    color: #fff;
    font-size: 12px;
    z-index: 6;
`;

