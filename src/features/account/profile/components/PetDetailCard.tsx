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

interface PetDetailCardProps {
    pet: IPet;
    adoptionRequestsCount?: number;
    handleModalRequests?: () => void;
}

export default function PetDetailCard({ pet, adoptionRequestsCount, handleModalRequests = () => {} }: PetDetailCardProps) {
    const [imagePage, setImagePage] = useState(0);

    const handleImageClick = () => {
        const imageIndex = imagePage < pet.images.length - 1 ? imagePage + 1 : 0;
        setImagePage(imageIndex);
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
        <CardContainer>
            <ImageSection onClick={handleImageClick}>
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
                        <PetName>{pet.name}</PetName>
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
    );
}

const CardContainer = styled.div`
    width: 100%;
    max-width: 500px;
    width: 500;
    min-width: 450px;
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.quarternary} 0%, ${({ theme }) => theme.colors.quinary} 100%);
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);

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

