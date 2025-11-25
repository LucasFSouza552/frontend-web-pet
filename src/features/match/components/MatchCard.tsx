import styled from "styled-components";
import type IPet from "@models/Pet";

import { IoLocationSharp } from "react-icons/io5";
import { FaWeightHanging, FaShieldDog } from "react-icons/fa6";
import { IoMdMale, IoMdFemale } from "react-icons/io";
import { FaHeart, FaHeartBroken } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { usePetInteractionController } from "../../pet/controllers/usePetInteractionController";
import MatchCardSkeleton from "./MatchCardSkeleton";
import { pictureService } from "@api/pictureService";
import PetIconsMenu from "./PetIconsMenu";


interface MatchCardProps {
    Pet: IPet;
    handleLikePet?: (petId: string) => Promise<void>;
    handleDislikePet?: (petId: string) => Promise<void>;
}

export default function MatchCard({ Pet, handleLikePet: propHandleLikePet, handleDislikePet: propHandleDislikePet }: MatchCardProps) {
    const [imagePage, setImagePage] = useState(0);
    const [showInfo, setShowInfo] = useState(false);
    const [showShareMessage, setShowShareMessage] = useState(false);
    const { loading, error, handleLikePet: defaultHandleLikePet, handleDislikePet: defaultHandleDislikePet } = usePetInteractionController();
    
    const handleLikePet = propHandleLikePet || defaultHandleLikePet;
    const handleDislikePet = propHandleDislikePet || defaultHandleDislikePet;

    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [currentX, setCurrentX] = useState(0);
    const [isExiting, setIsExiting] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const startXRef = useRef(0);
    const currentXRef = useRef(0);

    const handleClick = async () => {
        if (isDragging || !Pet) return;
        const imageIndex = imagePage < (Pet.images?.length || 0) - 1 ? imagePage + 1 : 0;
        setImagePage(imageIndex);
    }

    const handleStart = (clientX: number) => {
        setIsDragging(true);
        setStartX(clientX);
        setCurrentX(clientX);
        startXRef.current = clientX;
        currentXRef.current = clientX;
    };

    const handleMove = (clientX: number) => {
        setCurrentX(clientX);
        currentXRef.current = clientX;
    };

    const handleEnd = () => {
        if (!isDragging || !Pet?.id) return;

        const finalDeltaX = currentXRef.current - startXRef.current;
        const threshold = 100;
        const petId = Pet.id;

        if (Math.abs(finalDeltaX) > threshold) {
            setIsExiting(true);
            setIsDragging(false);

            setTimeout(async () => {
                if (finalDeltaX > 0) {
                    await handleLikePet(petId);
                } else {
                    await handleDislikePet(petId);
                }
                setIsExiting(false);
                setCurrentX(0);
                setStartX(0);
                currentXRef.current = 0;
                startXRef.current = 0;
            }, 300);
        } else {
            setCurrentX(startXRef.current);
            currentXRef.current = startXRef.current;
            setIsDragging(false);
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        handleStart(e.clientX);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        handleMove(e.clientX);
    };

    const handleMouseUp = () => {
        handleEnd();
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        handleStart(e.touches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        handleMove(e.touches[0].clientX);
    };

    const handleTouchEnd = () => {
        handleEnd();
    };

    useEffect(() => {
        if (!Pet?.id) return;

        if (isDragging) {
            const petId = Pet.id;
            const handleGlobalMouseMove = (e: MouseEvent) => {
                setCurrentX(e.clientX);
                currentXRef.current = e.clientX;
            };
            const handleGlobalMouseUp = () => {
                const finalDeltaX = currentXRef.current - startXRef.current;
                const threshold = 100;

                if (Math.abs(finalDeltaX) > threshold) {
                    setIsExiting(true);
                    setIsDragging(false);

                    setTimeout(async () => {
                        if (finalDeltaX > 0) {
                            await handleLikePet(petId);
                        } else {
                            await handleDislikePet(petId);
                        }
                        setIsExiting(false);
                        setCurrentX(0);
                        setStartX(0);
                        currentXRef.current = 0;
                        startXRef.current = 0;
                    }, 300);
                } else {
                    setCurrentX(startXRef.current);
                    currentXRef.current = startXRef.current;
                    setIsDragging(false);
                }
            };

            window.addEventListener('mousemove', handleGlobalMouseMove);
            window.addEventListener('mouseup', handleGlobalMouseUp);

            return () => {
                window.removeEventListener('mousemove', handleGlobalMouseMove);
                window.removeEventListener('mouseup', handleGlobalMouseUp);
            };
        }
    }, [isDragging, Pet?.id, handleLikePet, handleDislikePet]);

    const deltaX = currentX - startX;
    const rotation = deltaX * 0.1;
    const opacity = 1 - Math.abs(deltaX) / 300;
    const isLike = deltaX > 50;
    const isDislike = deltaX < -50;

    const handleSharePet = async () => {
        if (!Pet?.id) return;
        
        const petUrl = `${window.location.origin}/match?pet=${Pet.id}`;
        const shareData = {
            title: `Conheça ${Pet.name}!`,
            text: Pet.description 
                ? `${Pet.description.substring(0, 100)}${Pet.description.length > 100 ? '...' : ''}` 
                : `Confira ${Pet.name}, um pet incrível que está procurando um lar!`,
            url: petUrl
        };

        try {
            if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(petUrl);
                setShowShareMessage(true);
                setTimeout(() => {
                    setShowShareMessage(false);
                }, 2000);
            }
        } catch (error) {
            if (error instanceof Error && error.name !== 'AbortError') {
                try {
                    await navigator.clipboard.writeText(petUrl);
                    setShowShareMessage(true);
                    setTimeout(() => {
                        setShowShareMessage(false);
                    }, 2000);
                } catch (clipboardError) {
                    console.error('Erro ao copiar link:', clipboardError);
                }
            }
        }
    };

    if (loading || !Pet || !Pet.id) {
        return (<MatchCardSkeleton />);
    }

    const pictures = Pet.images?.map((image) => {
        return pictureService.fetchPicture(image);
    }) || []

    return (
        <CardContainer>
            <SwipeableCard
                ref={cardRef}
                $deltaX={deltaX}
                $rotation={rotation}
                $opacity={Math.max(0.3, opacity)}
                $isExiting={isExiting}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <CardWrapper>
                    {(isLike || isDislike) && (
                        <SwipeOverlay $type={isLike ? "like" : "dislike"}>
                            <SwipeIcon $type={isLike ? "like" : "dislike"}>
                                {isLike ? <FaHeart size={80} /> : <FaHeartBroken size={80} />}
                            </SwipeIcon>
                            <SwipeText>{isLike ? "EU QUERO!" : "TALVEZ DEPOIS"}</SwipeText>
                        </SwipeOverlay>
                    )}
                    <CardDetails>

                        <PetPictureContainer onClick={handleClick}>
                            {Pet?.images?.length > 0 && <PetImageSection>
                                {Pet?.images?.map((_, index) => {
                                    return <span className={imagePage === index ? "active" : ""}></span>
                                })}</PetImageSection>}
                            {Pet?.images?.length > 0 && <img src={`${pictures[imagePage]}`} alt="" />}
                        </PetPictureContainer>
                        <PetInfo>
                            <PetLabel>
                                <p>
                                    {Pet.name}
                                </p>
                                <div>
                                    {Pet.gender === "male" && <IoMdMale size={30} color="#008CFF" />}
                                    {Pet.gender === "female" && <IoMdFemale size={30} color="#a502b4" />}
                                </div>
                            </PetLabel>
                            <PetDescription title="Descrição">
                                {Pet.description}
                            </PetDescription>
                            <Info>
                                <IoLocationSharp size={20} />
                                {Pet.account.address?.street || ""},{Pet.account.address?.neighborhood || ""} {Pet.account.address?.number},  {Pet.account.address?.city}, {Pet.account.address?.state}
                            </Info>
                            {Pet.weight && <Info>
                                <FaWeightHanging title="Peso" size={20} />
                                {Pet.weight}kg
                            </Info>}
                            <Info title="Instituição">
                                <FaShieldDog size={20} />
                                {Pet.account.name}
                            </Info>
                        </PetInfo>
                    </CardDetails>
                    <PetIconsMenu 
                        pet={Pet} 
                        setShowInfo={setShowInfo} 
                        handleLikePet={handleLikePet} 
                        handleDislikePet={handleDislikePet}
                        handleSharePet={handleSharePet}
                    />
                    {showShareMessage && (
                        <ShareMessageContainer>
                            <ShareMessage>Link copiado!</ShareMessage>
                        </ShareMessageContainer>
                    )}
                </CardWrapper>
            </SwipeableCard>
            {showInfo && (
                <ModalOverlay onClick={() => setShowInfo(false)}>
                    <ModalContent onClick={(e) => e.stopPropagation()}>
                        <ModalHeader>
                            <h3>{Pet.name}</h3>
                            <CloseButton onClick={() => setShowInfo(false)}>×</CloseButton>
                        </ModalHeader>
                        <ModalBody>
                            <p>{Pet.description}</p>
                            <Info>
                                <IoLocationSharp size={20} />
                                {Pet.account.address?.street || ""},{Pet.account.address?.neighborhood || ""} {Pet.account.address?.number},  {Pet.account.address?.city}, {Pet.account.address?.state}
                            </Info>
                            {Pet.weight && (
                                <Info>
                                    <FaWeightHanging title="Peso" size={20} />
                                    {Pet.weight}kg
                                </Info>
                            )}
                            <Info title="Instituição">
                                <FaShieldDog size={20} />
                                {Pet.account.name}
                            </Info>
                        </ModalBody>
                        {error && <ErrorText>{error}</ErrorText>}
                    </ModalContent>
                </ModalOverlay>
            )}
        </CardContainer>
    );
}

const PetImageSection = styled.div`
    width: 100%;
    position: absolute;
    z-index: 0;
    display: flex;
    flex-direction: row;
    gap: 5px;
    padding: 8px;
    span {
        display: block;
        width: 100%;
        height: 8px;
        background-color: ${({ theme }) => theme?.colors?.secondary || "#666"};
        border-radius: 5px;
    }

    .active {
        
        background-color: ${({ theme }) => theme?.colors?.primary || "#B648A0"};
    }
`;

const PetLabel = styled.div`
    --height: 50px;
    position: absolute;
    align-items: center;
    display: flex;
    font-weight: bold;
    background-color: ${({ theme }) => theme?.colors?.tertiary || "rgba(64, 59, 63, 0.95)"};
    color: white;
    height: var(--height);
    text-align: left;
    padding: 15px;
    z-index: 1;
    top: calc(0px - var(--height));
    left: 0;
    border-radius: 20px 20px 0 0;
    width: 100%;
    justify-content: space-between;

    font-size: 25px;
`;

const CardContainer = styled.div`
    width: 460px;
    display: flex;
    justify-content: center;
    overflow: visible;
    color: white;
    min-height: 80%;
    max-height: 80%;
    position: relative;
`;

const SwipeableCard = styled.div<{ $deltaX: number; $rotation: number; $opacity: number; $isExiting: boolean }>`
    position: relative;
    transform: translateX(${props => props.$deltaX}px) rotate(${props => props.$rotation}deg);
    opacity: ${props => props.$opacity};
    transition: ${props => props.$isExiting ? 'transform 0.3s ease-out, opacity 0.3s ease-out' : 'none'};
    cursor: ${props => props.$isExiting ? 'default' : 'grab'};
    user-select: none;
    touch-action: pan-y;
    display: flex;
    width: 460px;
    
    &:active {
        cursor: ${props => props.$isExiting ? 'default' : 'grabbing'};
    }
`;

const CardWrapper = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
    position: relative;
`;

const SwipeOverlay = styled.div<{ $type: 'like' | 'dislike' }>`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background: ${props =>
        props.$type === 'like'
            ? 'rgba(76, 175, 80, 0.2)'
            : 'rgba(244, 67, 54, 0.2)'};
    border: 4px solid ${props =>
        props.$type === 'like'
            ? '#4CAF50'
            : '#F44336'};
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 10;
    pointer-events: none;
    animation: pulse 0.5s ease-in-out infinite;
    
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
            opacity: 0.8;
        }
        50% {
            transform: scale(1.02);
            opacity: 1;
        }
    }
`;

const SwipeIcon = styled.div<{ $type: 'like' | 'dislike' }>`
    color: ${props =>
        props.$type === 'like'
            ? '#4CAF50'
            : '#F44336'};
    margin-bottom: 16px;
    animation: bounce 0.6s ease-in-out infinite;
    
    @keyframes bounce {
        0%, 100% {
            transform: scale(1) translateY(0);
        }
        50% {
            transform: scale(1.1) translateY(-10px);
        }
    }
`;

const SwipeText = styled.div`
    font-size: 48px;
    font-weight: 900;
    color: white;
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
    letter-spacing: 4px;
    animation: fadeIn 0.3s ease-out;
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: scale(0.8);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
`;

const PetInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 5px;
    flex: 1;
    max-height: min-content;
    position: relative;
`;

const CardDetails = styled.div`
    background-color: ${({ theme }) => theme?.colors?.quarternary || "rgba(44, 39, 43, 0.95)"};
    width: 400px;
    padding: 5px;
    display: flex;
    flex-direction: column;
`;




const PetPictureContainer = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    
    flex: 1;
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
    }
`;

const Info = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
    color: white;
`;

const PetDescription = styled.p`
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.5;
    max-height: 3em;
    color: white;
`;


const ModalOverlay = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    background: ${({ theme }) => theme?.colors?.quarternary || "rgba(44, 39, 43, 0.95)"};
    color: #fff;
    border-radius: 12px;
    width: min(600px, 92vw);
    max-height: 80vh;
    overflow: auto;
    padding: 16px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
`;

const ModalHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
    h3 { font-size: 22px; }
`;

const CloseButton = styled.button`
    background: transparent;
    border: none;
    color: #fff;
    font-size: 24px;
    cursor: pointer;
`;

const ModalBody = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const ModalFooter = styled.div`
    margin-top: 12px;
    display: flex;
    justify-content: flex-end;
`;

const ActionButton = styled.button`
    background-color: ${({ theme }) => theme?.colors?.primary || "#B648A0"};
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 10px 16px;
    font-weight: bold;
    cursor: pointer;
`;

const ErrorText = styled.p`
    color: #ff8a8a;
    margin-top: 8px;
`;

const ShareMessageContainer = styled.div`
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10000;
    animation: slideUp 0.3s ease-out;

    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
`;

const ShareMessage = styled.div`
    background: ${({ theme }) => theme?.colors?.primary || "#B648A0"};
    color: white;
    padding: 12px 24px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
    white-space: nowrap;
    animation: fadeInOut 2s ease-in-out;

    @keyframes fadeInOut {
        0%, 100% {
            opacity: 0;
        }
        20%, 80% {
            opacity: 1;
        }
    }
`;