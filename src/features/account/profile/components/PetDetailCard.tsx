import { useState } from "react";
import styled from "styled-components";
import type IPet from "@models/Pet";
import { pictureService } from "@api/pictureService";
import {
    IoMdLocate,
    IoMdMale,
    IoMdFemale,
    IoMdCalendar,
    IoMdStar
} from "react-icons/io";
import {
    FaWeightHanging,
    FaShieldDog,
    FaHeart,
    FaUsers
} from "react-icons/fa6";
import { PiBird, PiCat, PiDog, PiPawPrint } from "react-icons/pi";
import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface PetDetailCardProps {
    pet: IPet;
    adoptionRequestsCount?: number;
    handleModalRequests?: () => void;
}

export default function PetDetailCard({ pet, adoptionRequestsCount, handleModalRequests = () => {} }: PetDetailCardProps) {
    const [imagePage, setImagePage] = useState(0);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [modalImageIndex, setModalImageIndex] = useState(0);

    const handleImageClick = () => {
        const imageIndex = imagePage < pet.images.length - 1 ? imagePage + 1 : 0;
        setImagePage(imageIndex);
    };

    const handleCardClick = () => {
        setShowDetailsModal(true);
        setModalImageIndex(0);
    };

    const handleCloseModal = () => {
        setShowDetailsModal(false);
        setModalImageIndex(0);
    };

    const handleNextImage = () => {
        setModalImageIndex((prev) => (prev + 1) % pet.images.length);
    };

    const handlePrevImage = () => {
        setModalImageIndex((prev) => (prev - 1 + pet.images.length) % pet.images.length);
    };

    const pictures = pet.images.map((image) => pictureService.fetchPicture(image));

    const getPetTypeIcon = () => {
        switch (pet.type) {
            case "Cachorro":
                return <PiDog size={24} />;
            case "Gato":
                return <PiCat size={24} />;
            case "Pássaro":
                return <PiBird size={24} />;
            default:
                return <PiPawPrint size={24} />;
        }
    };

    const formatAddress = () => {
        const { address } = pet.account;
        if (!address) return "Localização não informada";

        const parts = [
            address.street,
            address.number,
            address.neighborhood,
            address.city,
            address.state
        ].filter(Boolean);

        return parts.join(", ");
    };

    const formatDate = (dateString?: string | Date) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toLocaleDateString("pt-BR");
    };


    return (
        <>
        <CardContainer onClick={handleCardClick}>
            <ImageSection onClick={(e) => { e.stopPropagation(); handleImageClick(); }}>
                {pet.images.length > 0 && (
                    <>
                        <PetImage src={pictures[imagePage]} alt={pet.name} />
                        {pet.images.length > 1 && (
                            <ImageIndicator>
                                {pet.images.map((_, index) => (
                                    <IndicatorDot
                                        key={index}
                                        $active={imagePage === index}
                                    />
                                ))}
                            </ImageIndicator>
                        )}
                        <ImageOverlay>
                            <ImageCounter>{imagePage + 1} / {pet.images.length}</ImageCounter>
                        </ImageOverlay>
                    </>
                )}
                {pet.adopted && (
                    <AdoptedBadge>
                        <FaHeart size={14} />
                        Adotado
                    </AdoptedBadge>
                )}
            </ImageSection>

            <CardContent>
                <HeaderSection>
                    <PetNameContainer>
                        <PetName onClick={(e) => { e.stopPropagation(); handleCardClick(); }}>{pet.name}</PetName>
                        <PetTypeBadge>
                            {getPetTypeIcon()}
                            <span>{pet.type}</span>
                        </PetTypeBadge>
                    </PetNameContainer>
                    <GenderIcon>
                        {pet.gender === "male" ? (
                            <IoMdMale size={32} color="#008CFF" />
                        ) : (
                            <IoMdFemale size={32} color="#a502b4" />
                        )}
                    </GenderIcon>
                </HeaderSection>

                {pet.description && (
                    <DescriptionSection>
                        <DescriptionText>{pet.description}</DescriptionText>
                    </DescriptionSection>
                )}

                <DetailsGrid>
                    {pet.weight && (
                        <DetailItem>
                            <DetailIcon>
                                <FaWeightHanging size={18} />
                            </DetailIcon>
                            <DetailContent>
                                <DetailLabel>Peso</DetailLabel>
                                <DetailValue>{pet.weight} kg</DetailValue>
                            </DetailContent>
                        </DetailItem>
                    )}

                    {pet.age && (
                        <DetailItem>
                            <DetailIcon>
                                <IoMdCalendar size={18} />
                            </DetailIcon>
                            <DetailContent>
                                <DetailLabel>Idade</DetailLabel>
                                <DetailValue>{pet.age} {pet.age === 1 ? "ano" : "anos"}</DetailValue>
                            </DetailContent>
                        </DetailItem>
                    )}

                    {pet.adoptedAt && (
                        <DetailItem>
                            <DetailIcon>
                                <IoMdStar size={18} color="#f7c944" />
                            </DetailIcon>
                            <DetailContent>
                                <DetailLabel>Adotado em</DetailLabel>
                                <DetailValue>{formatDate(pet.adoptedAt)}</DetailValue>
                            </DetailContent>
                        </DetailItem>
                    )}

                    {adoptionRequestsCount !== undefined && adoptionRequestsCount > 0 && (
                        <DetailItem onClick={() => handleModalRequests()}>
                            <DetailIcon>
                                <FaUsers size={18} />
                            </DetailIcon>
                            <DetailContent>
                                <DetailLabel>Interessados</DetailLabel>
                                <DetailValue>{adoptionRequestsCount} {adoptionRequestsCount === 1 ? "pessoa" : "pessoas"}</DetailValue>
                            </DetailContent>
                        </DetailItem>
                    )}
                </DetailsGrid>

                {pet.account && pet.account.name && <InstitutionSection>
                    <InstitutionIcon>
                        <FaShieldDog size={20} />
                    </InstitutionIcon>
                    <InstitutionInfo>
                        <InstitutionLabel>Instituição</InstitutionLabel>
                        <InstitutionName>{pet.account.name}</InstitutionName>
                    </InstitutionInfo>
                </InstitutionSection>}

                <LocationSection>
                    <LocationIcon>
                        <IoMdLocate size={20} />
                    </LocationIcon>
                    <LocationText>{formatAddress()}</LocationText>
                </LocationSection>
            </CardContent>
        </CardContainer>

        {showDetailsModal && (
            <ModalOverlay onClick={handleCloseModal}>
                <ModalContent onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                    <ModalHeader>
                        <ModalTitle>Detalhes do Pet</ModalTitle>
                        <ModalCloseButton onClick={handleCloseModal}>
                            <FaTimes />
                        </ModalCloseButton>
                    </ModalHeader>

                    <ModalBody>
                        {pet.images.length > 0 && (
                            <ModalImageSection>
                                <ModalImageContainer>
                                    <ModalImage src={pictures[modalImageIndex]} alt={pet.name} />
                                    {pet.images.length > 1 && (
                                        <>
                                            <ModalImageNavButton $left onClick={handlePrevImage}>
                                                <FaChevronLeft />
                                            </ModalImageNavButton>
                                            <ModalImageNavButton $right onClick={handleNextImage}>
                                                <FaChevronRight />
                                            </ModalImageNavButton>
                                            <ModalImageIndicator>
                                                {pet.images.map((_, index) => (
                                                    <ModalIndicatorDot
                                                        key={index}
                                                        $active={modalImageIndex === index}
                                                        onClick={() => setModalImageIndex(index)}
                                                    />
                                                ))}
                                            </ModalImageIndicator>
                                            <ModalImageCounter>
                                                {modalImageIndex + 1} / {pet.images.length}
                                            </ModalImageCounter>
                                        </>
                                    )}
                                </ModalImageContainer>
                            </ModalImageSection>
                        )}

                        <ModalInfoSection>
                            <ModalPetHeader>
                                <ModalPetName>{pet.name}</ModalPetName>
                                <ModalPetTypeBadge>
                                    {getPetTypeIcon()}
                                    <span>{pet.type}</span>
                                </ModalPetTypeBadge>
                                <ModalGenderIcon>
                                    {pet.gender === "male" ? (
                                        <IoMdMale size={28} color="#008CFF" />
                                    ) : (
                                        <IoMdFemale size={28} color="#a502b4" />
                                    )}
                                </ModalGenderIcon>
                            </ModalPetHeader>

                            {pet.description && (
                                <ModalDescription>
                                    <ModalDescriptionTitle>Descrição</ModalDescriptionTitle>
                                    <ModalDescriptionText>{pet.description}</ModalDescriptionText>
                                </ModalDescription>
                            )}

                            <ModalDetailsGrid>
                                {pet.weight && (
                                    <ModalDetailItem>
                                        <ModalDetailIcon>
                                            <FaWeightHanging size={20} />
                                        </ModalDetailIcon>
                                        <ModalDetailContent>
                                            <ModalDetailLabel>Peso</ModalDetailLabel>
                                            <ModalDetailValue>{pet.weight} kg</ModalDetailValue>
                                        </ModalDetailContent>
                                    </ModalDetailItem>
                                )}

                                {pet.age && (
                                    <ModalDetailItem>
                                        <ModalDetailIcon>
                                            <IoMdCalendar size={20} />
                                        </ModalDetailIcon>
                                        <ModalDetailContent>
                                            <ModalDetailLabel>Idade</ModalDetailLabel>
                                            <ModalDetailValue>{pet.age} {pet.age === 1 ? "ano" : "anos"}</ModalDetailValue>
                                        </ModalDetailContent>
                                    </ModalDetailItem>
                                )}

                                {pet.adoptedAt && (
                                    <ModalDetailItem>
                                        <ModalDetailIcon>
                                            <IoMdStar size={20} color="#f7c944" />
                                        </ModalDetailIcon>
                                        <ModalDetailContent>
                                            <ModalDetailLabel>Adotado em</ModalDetailLabel>
                                            <ModalDetailValue>{formatDate(pet.adoptedAt)}</ModalDetailValue>
                                        </ModalDetailContent>
                                    </ModalDetailItem>
                                )}

                                {pet.createdAt && (
                                    <ModalDetailItem>
                                        <ModalDetailIcon>
                                            <IoMdCalendar size={20} />
                                        </ModalDetailIcon>
                                        <ModalDetailContent>
                                            <ModalDetailLabel>Cadastrado em</ModalDetailLabel>
                                            <ModalDetailValue>{formatDate(pet.createdAt)}</ModalDetailValue>
                                        </ModalDetailContent>
                                    </ModalDetailItem>
                                )}
                            </ModalDetailsGrid>

                            {pet.account && pet.account.name && (
                                <ModalInstitutionSection>
                                    <ModalInstitutionIcon>
                                        <FaShieldDog size={24} />
                                    </ModalInstitutionIcon>
                                    <ModalInstitutionInfo>
                                        <ModalInstitutionLabel>Instituição</ModalInstitutionLabel>
                                        <ModalInstitutionName>{pet.account.name}</ModalInstitutionName>
                                        {pet.account.email && (
                                            <ModalInstitutionEmail>{pet.account.email}</ModalInstitutionEmail>
                                        )}
                                    </ModalInstitutionInfo>
                                </ModalInstitutionSection>
                            )}

                            <ModalLocationSection>
                                <ModalLocationIcon>
                                    <IoMdLocate size={24} />
                                </ModalLocationIcon>
                                <ModalLocationText>{formatAddress()}</ModalLocationText>
                            </ModalLocationSection>

                            {pet.adopted && (
                                <ModalAdoptedBadge>
                                    <FaHeart size={16} />
                                    <span>Este pet já foi adotado</span>
                                </ModalAdoptedBadge>
                            )}
                        </ModalInfoSection>
                    </ModalBody>
                </ModalContent>
            </ModalOverlay>
        )}
        </>
    );
}

const CardContainer = styled.div`
    width: 100%;
    max-width: 500px;
    width: 500;
    min-width: 450px;
    height: 750px;
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.quarternary} 0%, ${({ theme }) => theme.colors.quinary} 100%);
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    flex-direction: column;
    cursor: pointer;

    &:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 48px rgba(182, 72, 160, 0.3);
        z-index: 10;
    }
`;

const ImageSection = styled.div`
    position: relative;
    width: 100%;
    height: 320px;
    overflow: hidden;
    cursor: pointer;
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.secondary} 0%, ${({ theme }) => theme.colors.quarternary} 100%);
`;

const PetImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;

    ${ImageSection}:hover & {
        transform: scale(1.1);
    }
`;

const ImageIndicator = styled.div`
    position: absolute;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 8px;
    z-index: 2;
`;

const IndicatorDot = styled.span<{ $active: boolean }>`
    width: ${({ $active }) => $active ? "24px" : "8px"};
    height: 8px;
    border-radius: 4px;
    background-color: ${({ $active, theme }) =>
        $active ? theme.colors.primary : "rgba(255, 255, 255, 0.5)"};
    transition: all 0.3s ease;
`;

const ImageOverlay = styled.div`
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 2;
`;

const ImageCounter = styled.div`
    background: rgba(0, 0, 0, 0.6);
    color: white;
    padding: 6px 12px;
    border-radius: 12px;
    font-size: 0.875rem;
    font-weight: 600;
    backdrop-filter: blur(10px);
`;

const AdoptedBadge = styled.div`
    position: absolute;
    top: 16px;
    left: 16px;
    background: linear-gradient(135deg, #B648A0 0%, #a502b4 100%);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 6px;
    z-index: 2;
    box-shadow: 0 4px 12px rgba(182, 72, 160, 0.4);
`;

const CardContent = styled.div`
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    flex: 1;
    overflow-y: auto;
    min-height: 0;
`;

const HeaderSection = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
`;

const PetNameContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    flex: 1;
`;

const PetName = styled.h2`
    color: white;
    font-size: 1.75rem;
    font-weight: 700;
    margin: 0;
    line-height: 1.2;
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover {
        color: ${({ theme }) => theme.colors.primary};
    }
`;

const PetTypeBadge = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    background: ${({ theme }) => theme.colors.tertiary};
    color: white;
    padding: 8px 16px;
    border-radius: 12px;
    width: fit-content;
    font-size: 0.875rem;
    font-weight: 600;
`;

const GenderIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 12px;
    backdrop-filter: blur(10px);
`;

const DescriptionSection = styled.div`
    padding: 16px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    border-left: 3px solid ${({ theme }) => theme.colors.primary};
`;

const DescriptionText = styled.p`
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.95rem;
    line-height: 1.6;
    margin: 0;
`;

const DetailsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
`;

const DetailItem = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    transition: background 0.2s ease;

    &:hover {
        background: rgba(255, 255, 255, 0.1);
    }
`;

const DetailIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 10px;
    color: white;
    flex-shrink: 0;
`;

const DetailContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
    cursor: pointer;
    min-width: 0;
`;

const DetailLabel = styled.span`
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
`;

const DetailValue = styled.span`
    color: white;
    font-size: 0.95rem;
    font-weight: 600;
`;

const InstitutionSection = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    border-top: 2px solid ${({ theme }) => theme.colors.primary};
`;

const InstitutionIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 12px;
    color: white;
    flex-shrink: 0;
`;

const InstitutionInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
`;

const InstitutionLabel = styled.span`
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
`;

const InstitutionName = styled.span`
    color: white;
    font-size: 1rem;
    font-weight: 600;
`;

const LocationSection = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 12px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
`;

const LocationIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    color: ${({ theme }) => theme.colors.primary};
    flex-shrink: 0;
`;

const LocationText = styled.span`
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.875rem;
    line-height: 1.5;
    flex: 1;
`;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
    overflow-y: auto;
`;

const ModalContent = styled.div`
    width: 100%;
    max-width: 900px;
    max-height: 90vh;
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.quarternary} 0%, ${({ theme }) => theme.colors.quinary} 100%);
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    flex-direction: column;
    overflow-y: auto;

    @media (max-width: 768px) {
        max-width: 100%;
        max-height: 95vh;
    }
`;

const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 2rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const ModalTitle = styled.h2`
    color: white;
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
`;

const ModalCloseButton = styled.button`
    background: transparent;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    transition: all 0.2s ease;

    &:hover {
        background: rgba(255, 255, 255, 0.1);
        transform: rotate(90deg);
    }
`;

const ModalBody = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 2rem;
    overflow-y: auto;

    @media (max-width: 768px) {
        padding: 1.5rem;
        gap: 1.5rem;
    }
`;

const ModalImageSection = styled.div`
    width: 100%;
`;

const ModalImageContainer = styled.div`
    position: relative;
    width: 100%;
    height: 400px;
    border-radius: 16px;
    overflow: hidden;
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.secondary} 0%, ${({ theme }) => theme.colors.quarternary} 100%);

    @media (max-width: 768px) {
        height: 300px;
    }
`;

const ModalImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
`;

const ModalImageNavButton = styled.button<{ $left?: boolean; $right?: boolean }>`
    position: absolute;
    top: 50%;
    ${({ $left }) => $left && "left: 1rem;"}
    ${({ $right }) => $right && "right: 1rem;"}
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.6);
    border: none;
    color: white;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    z-index: 10;

    &:hover {
        background: rgba(0, 0, 0, 0.8);
        transform: translateY(-50%) scale(1.1);
    }
`;

const ModalImageIndicator = styled.div`
    position: absolute;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 8px;
    z-index: 10;
`;

const ModalIndicatorDot = styled.span<{ $active: boolean }>`
    width: ${({ $active }) => $active ? "24px" : "8px"};
    height: 8px;
    border-radius: 4px;
    background-color: ${({ $active, theme }) =>
        $active ? theme.colors.primary : "rgba(255, 255, 255, 0.5)"};
    transition: all 0.3s ease;
    cursor: pointer;
`;

const ModalImageCounter = styled.div`
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    padding: 8px 16px;
    border-radius: 12px;
    font-size: 0.875rem;
    font-weight: 600;
    backdrop-filter: blur(10px);
    z-index: 10;
`;

const ModalInfoSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

const ModalPetHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
`;

const ModalPetName = styled.h2`
    color: white;
    font-size: 2rem;
    font-weight: 700;
    margin: 0;
    flex: 1;
    min-width: 200px;
`;

const ModalPetTypeBadge = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    background: ${({ theme }) => theme.colors.tertiary};
    color: white;
    padding: 10px 20px;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
`;

const ModalGenderIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 12px;
    backdrop-filter: blur(10px);
`;

const ModalDescription = styled.div`
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    border-left: 4px solid ${({ theme }) => theme.colors.primary};
`;

const ModalDescriptionTitle = styled.h3`
    color: ${({ theme }) => theme.colors.primary};
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0 0 0.75rem 0;
`;

const ModalDescriptionText = styled.p`
    color: rgba(255, 255, 255, 0.9);
    font-size: 1rem;
    line-height: 1.6;
    margin: 0;
`;

const ModalDetailsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
`;

const ModalDetailItem = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
`;

const ModalDetailIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 12px;
    color: white;
    flex-shrink: 0;
`;

const ModalDetailContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
`;

const ModalDetailLabel = styled.span`
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
`;

const ModalDetailValue = styled.span`
    color: white;
    font-size: 1rem;
    font-weight: 600;
`;

const ModalInstitutionSection = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    border-top: 3px solid ${({ theme }) => theme.colors.primary};
`;

const ModalInstitutionIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 12px;
    color: white;
    flex-shrink: 0;
`;

const ModalInstitutionInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
`;

const ModalInstitutionLabel = styled.span`
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
`;

const ModalInstitutionName = styled.span`
    color: white;
    font-size: 1.1rem;
    font-weight: 600;
`;

const ModalInstitutionEmail = styled.span`
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.875rem;
`;

const ModalLocationSection = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
`;

const ModalLocationIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    color: ${({ theme }) => theme.colors.primary};
    flex-shrink: 0;
`;

const ModalLocationText = styled.span`
    color: rgba(255, 255, 255, 0.9);
    font-size: 1rem;
    line-height: 1.5;
    flex: 1;
`;

const ModalAdoptedBadge = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 1rem 1.5rem;
    background: linear-gradient(135deg, #B648A0 0%, #a502b4 100%);
    color: white;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(182, 72, 160, 0.4);
`;

