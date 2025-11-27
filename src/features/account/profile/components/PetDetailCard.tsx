import { useState, useEffect } from "react";
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
import { FaTimes, FaChevronLeft, FaChevronRight, FaCheck, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendar } from "react-icons/fa";
import type { IAccount } from "@models/Account";

interface AdoptionRequest {
    account: IAccount;
    pet: IPet;
    institution?: IAccount;
    createdAt?: string;
    id?: string;
}

interface PetDetailCardProps {
    pet: IPet;
    adoptionRequestsCount?: number;
    adoptionRequests?: AdoptionRequest[];
    isOwner?: boolean;
    onAcceptAdoption?: (petId: string, adopterAccountId: string) => Promise<void>;
    onRejectAdoption?: (petId: string, adopterAccountId: string) => Promise<void>;
    processingRequest?: string | null;
    onCancelAdoption?: (petId: string) => Promise<void> | void;
    isCancelling?: boolean;
}

const EMPTY_ADOPTION_REQUESTS: AdoptionRequest[] = [];

export default function PetDetailCard({ 
    pet, 
    adoptionRequestsCount, 
    adoptionRequests,
    isOwner = false,
    onAcceptAdoption,
    onRejectAdoption,
    processingRequest = null,
    onCancelAdoption,
    isCancelling = false
}: PetDetailCardProps) {
    const adoptionRequestsList = adoptionRequests ?? EMPTY_ADOPTION_REQUESTS;
    const [imagePage, setImagePage] = useState(0);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [modalImageIndex, setModalImageIndex] = useState(0);
    const [localAdoptionRequests, setLocalAdoptionRequests] = useState<AdoptionRequest[]>(adoptionRequestsList);
    const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);

    useEffect(() => {
        if (!showDetailsModal) {
            setLocalAdoptionRequests(adoptionRequestsList);
        }
    }, [adoptionRequestsList, showDetailsModal]);

    const handleImageClick = () => {
        const imageIndex = imagePage < pet.images.length - 1 ? imagePage + 1 : 0;
        setImagePage(imageIndex);
    };

    const handleCardClick = () => {
        setShowDetailsModal(true);
        setModalImageIndex(0);
        setLocalAdoptionRequests(adoptionRequestsList);
    };

    const handleCloseModal = () => {
        setShowDetailsModal(false);
        setModalImageIndex(0);
    };

    const handleCancelAdoptionClick = (event?: React.MouseEvent) => {
        event?.stopPropagation();
        setShowCancelConfirmation(true);
    };

    const handleDismissCancel = (event?: React.MouseEvent) => {
        event?.stopPropagation();
        setShowCancelConfirmation(false);
    };

    const handleConfirmCancel = async () => {
        if (!onCancelAdoption) return;
        await onCancelAdoption(pet.id);
        setShowCancelConfirmation(false);
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

    const formatInstitutionAddress = () => {
        const { address } = pet.account;
        if (!address) return "Endereço não informado";

        const parts = [
            address.street && address.number ? `${address.street}, ${address.number}` : address.street || address.number,
            address.neighborhood,
            address.city && address.state ? `${address.city} - ${address.state}` : address.city || address.state
        ].filter(Boolean);

        return parts.join(", ");
    };

    const formatDate = (dateString?: string | Date) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toLocaleDateString("pt-BR");
    };

    const handleLocalAcceptAdoption = async (petId: string, adopterAccountId: string) => {
        if (onAcceptAdoption) {
            setLocalAdoptionRequests(prev => prev.filter(req => req.account?.id !== adopterAccountId));
            await onAcceptAdoption(petId, adopterAccountId);
        }
    };

    const handleLocalRejectAdoption = async (petId: string, adopterAccountId: string) => {
        if (onRejectAdoption) {
            setLocalAdoptionRequests(prev => prev.filter(req => req.account?.id !== adopterAccountId));
            await onRejectAdoption(petId, adopterAccountId);
        }
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
                       {pet.images.length > 1 && <ImageOverlay>
                            <ImageCounter>{imagePage + 1} / {pet.images.length}</ImageCounter>
                        </ImageOverlay>}
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
                        <DetailItem>
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
                        <InstitutionHeader>
                            <InstitutionLabel>Instituição</InstitutionLabel>
                            {pet.account.verified && (
                                <InstitutionVerifiedBadge>
                                    <FaCheck size={10} />
                                    Verificada
                                </InstitutionVerifiedBadge>
                            )}
                        </InstitutionHeader>
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
                                        <ModalInstitutionHeader>
                                            <ModalInstitutionLabel>Instituição</ModalInstitutionLabel>
                                            {pet.account.verified && (
                                                <ModalVerifiedBadge>
                                                    <FaCheck size={12} />
                                                    Verificada
                                                </ModalVerifiedBadge>
                                            )}
                                        </ModalInstitutionHeader>
                                        <ModalInstitutionName>{pet.account.name}</ModalInstitutionName>
                                        {pet.account.cnpj && (
                                            <ModalInstitutionDetail>
                                                <FaShieldDog size={14} />
                                                <span>CNPJ: {pet.account.cnpj}</span>
                                            </ModalInstitutionDetail>
                                        )}
                                        {pet.account.email && (
                                            <ModalInstitutionDetail>
                                                <FaEnvelope size={14} />
                                                <span>{pet.account.email}</span>
                                            </ModalInstitutionDetail>
                                        )}
                                        {pet.account.phone_number && (
                                            <ModalInstitutionDetail>
                                                <FaPhone size={14} />
                                                <span>{pet.account.phone_number}</span>
                                            </ModalInstitutionDetail>
                                        )}
                                        {pet.account.address && (
                                            <ModalInstitutionDetail>
                                                <FaMapMarkerAlt size={14} />
                                                <span>{formatInstitutionAddress()}</span>
                                            </ModalInstitutionDetail>
                                        )}
                                    </ModalInstitutionInfo>
                                </ModalInstitutionSection>
                            )}
                            {onCancelAdoption && (
                                <CancelSection>
                                    <CancelSectionTitle>Cancelar pedido de adoção</CancelSectionTitle>
                                    <CancelSectionDescription>
                                        Se mudou de ideia, você pode desfazer o pedido enviado à instituição.
                                    </CancelSectionDescription>
                                    <CancelAdoptionButton
                                        type="button"
                                        onClick={handleCancelAdoptionClick}
                                        disabled={isCancelling}
                                    >
                                        {isCancelling ? "Cancelando..." : "Cancelar pedido de adoção"}
                                    </CancelAdoptionButton>
                                </CancelSection>
                            )}

                            {pet.adopted && (
                                <ModalAdoptedBadge>
                                    <FaHeart size={16} />
                                    <span>Este pet já foi adotado</span>
                                </ModalAdoptedBadge>
                            )}

                            {isOwner && localAdoptionRequests && localAdoptionRequests.length > 0 && (
                                <ModalInterestedSection>
                                    <ModalInterestedHeader>
                                        <ModalInterestedTitle>
                                            <FaUsers size={20} />
                                            Interessados em {pet.name}
                                        </ModalInterestedTitle>
                                        <ModalInterestedSubtitle>
                                            {localAdoptionRequests.length} {localAdoptionRequests.length === 1 ? "pessoa interessada" : "pessoas interessadas"}
                                        </ModalInterestedSubtitle>
                                    </ModalInterestedHeader>
                                    <ModalInterestedList>
                                        {localAdoptionRequests.map((request, index) => {
                                            const account = request.account;
                                            const reqId = `${pet.id}-${account?.id || index}`;
                                            const isProcessing = processingRequest === reqId;
                                            const avatarUrl = account?.avatar ? pictureService.fetchPicture(account.avatar) : null;
                                            
                                            return (
                                                <ModalInterestedCard key={request.id || index}>
                                                    <InterestedCardHeader>
                                                        <InterestedAvatarContainer>
                                                            {avatarUrl ? (
                                                                <InterestedAvatar src={avatarUrl} alt={account?.name || "Usuário"} />
                                                            ) : (
                                                                <InterestedAvatarPlaceholder>
                                                                    <FaUser size={20} />
                                                                </InterestedAvatarPlaceholder>
                                                            )}
                                                        </InterestedAvatarContainer>
                                                        <InterestedUserInfo>
                                                            <InterestedUserName>{account?.name || "Usuário"}</InterestedUserName>
                                                            {account?.email && (
                                                                <InterestedUserDetail>
                                                                    <FaEnvelope size={12} />
                                                                    {account.email}
                                                                </InterestedUserDetail>
                                                            )}
                                                        </InterestedUserInfo>
                                                    </InterestedCardHeader>
                                                    
                                                    <InterestedCardDetails>
                                                        {account?.phone_number && (
                                                            <InterestedDetailRow>
                                                                <InterestedDetailIcon>
                                                                    <FaPhone size={14} />
                                                                </InterestedDetailIcon>
                                                                <InterestedDetailText>{account.phone_number}</InterestedDetailText>
                                                            </InterestedDetailRow>
                                                        )}
                                                        {account?.address && (
                                                            <InterestedDetailRow>
                                                                <InterestedDetailIcon>
                                                                    <FaMapMarkerAlt size={14} />
                                                                </InterestedDetailIcon>
                                                                <InterestedDetailText>
                                                                    {[
                                                                        account.address.city,
                                                                        account.address.state
                                                                    ].filter(Boolean).join(", ") || "Localização não informada"}
                                                                </InterestedDetailText>
                                                            </InterestedDetailRow>
                                                        )}
                                                        {request.createdAt && (
                                                            <InterestedDetailRow>
                                                                <InterestedDetailIcon>
                                                                    <FaCalendar size={14} />
                                                                </InterestedDetailIcon>
                                                                <InterestedDetailText>
                                                                    Solicitado em {new Date(request.createdAt).toLocaleDateString("pt-BR", {
                                                                        day: "2-digit",
                                                                        month: "long",
                                                                        year: "numeric"
                                                                    })}
                                                                </InterestedDetailText>
                                                            </InterestedDetailRow>
                                                        )}
                                                    </InterestedCardDetails>
                                                    
                                                    {isOwner && onAcceptAdoption && onRejectAdoption && (
                                                        <InterestedActions>
                                                            <InterestedAcceptButton
                                                                onClick={() => account?.id && handleLocalAcceptAdoption(pet.id, account.id)}
                                                                disabled={isProcessing || !account?.id}
                                                            >
                                                                <FaCheck size={14} />
                                                                {isProcessing ? "Processando..." : "Aceitar"}
                                                            </InterestedAcceptButton>
                                                            <InterestedRejectButton
                                                                onClick={() => account?.id && handleLocalRejectAdoption(pet.id, account.id)}
                                                                disabled={isProcessing || !account?.id}
                                                            >
                                                                <FaTimes size={14} />
                                                                {isProcessing ? "Processando..." : "Recusar"}
                                                            </InterestedRejectButton>
                                                        </InterestedActions>
                                                    )}
                                                </ModalInterestedCard>
                                            );
                                        })}
                                    </ModalInterestedList>
                                </ModalInterestedSection>
                            )}
                        </ModalInfoSection>
                    </ModalBody>
                </ModalContent>
            </ModalOverlay>
        )}
        {showCancelConfirmation && (
            <CancelConfirmOverlay onClick={handleDismissCancel}>
                <CancelConfirmContent onClick={(e) => e.stopPropagation()}>
                    <CancelConfirmTitle>Cancelar pedido?</CancelConfirmTitle>
                    <CancelConfirmText>
                        Tem certeza de que deseja cancelar o pedido de adoção para {pet.name}? A instituição será notificada.
                    </CancelConfirmText>
                    <CancelConfirmActions>
                        <CancelConfirmButton type="button" onClick={handleConfirmCancel} disabled={isCancelling}>
                            {isCancelling ? "Cancelando..." : "Confirmar cancelamento"}
                        </CancelConfirmButton>
                        <CancelConfirmDismiss type="button" onClick={handleDismissCancel} disabled={isCancelling}>
                            Continuar com o pedido
                        </CancelConfirmDismiss>
                    </CancelConfirmActions>
                </CancelConfirmContent>
            </CancelConfirmOverlay>
        )}
        </>
    );
}

const CardContainer = styled.div`
    width: 450px;
    max-width: 450px;
    min-width: 450px;
    height: fit-content;
    
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

    @media (max-width: 768px) {
        width: 100%;
        max-width: 100%;
        min-width: unset;
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

const InstitutionHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    margin-bottom: 0.25rem;
`;

const InstitutionLabel = styled.span`
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
`;

const InstitutionVerifiedBadge = styled.div`
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.2rem 0.4rem;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    border-radius: 4px;
    font-size: 0.65rem;
    font-weight: 600;
    white-space: nowrap;
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

const ModalInstitutionHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    margin-bottom: 0.25rem;
`;

const ModalVerifiedBadge = styled.div`
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    border-radius: 6px;
    font-size: 0.7rem;
    font-weight: 600;
    white-space: nowrap;
`;

const ModalInstitutionDetail = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    margin-top: 0.5rem;
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.875rem;
    line-height: 1.4;

    svg {
        color: ${({ theme }) => theme.colors.primary || "#B648A0"};
        flex-shrink: 0;
        margin-top: 2px;
    }

    span {
        flex: 1;
        word-break: break-word;
    }
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

const CancelSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1.25rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    border-left: 4px solid ${({ theme }) => theme.colors.primary};
`;

const CancelSectionTitle = styled.h3`
    margin: 0;
    color: white;
    font-size: 1.1rem;
    font-weight: 600;
`;

const CancelSectionDescription = styled.p`
    margin: 0;
    color: rgba(255, 255, 255, 0.75);
    font-size: 0.9rem;
    line-height: 1.5;
`;

const CancelAdoptionButton = styled.button`
    align-self: flex-start;
    padding: 0.85rem 1.25rem;
    border-radius: 10px;
    border: none;
    background: #ef4444;
    color: white;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
        background: #dc2626;
        transform: translateY(-1px);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const CancelConfirmOverlay = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1500;
    padding: 1rem;
`;

const CancelConfirmContent = styled.div`
    width: min(420px, 100%);
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.quarternary} 0%, ${({ theme }) => theme.colors.quinary} 100%);
    border-radius: 20px;
    padding: 1.75rem;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45);
    border: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const CancelConfirmTitle = styled.h3`
    margin: 0;
    font-size: 1.35rem;
    color: white;
`;

const CancelConfirmText = styled.p`
    margin: 0;
    color: rgba(255, 255, 255, 0.85);
    font-size: 0.95rem;
    line-height: 1.5;
`;

const CancelConfirmActions = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
`;

const CancelConfirmButton = styled.button`
    flex: 1;
    min-width: 180px;
    padding: 0.85rem 1.25rem;
    border-radius: 10px;
    border: none;
    font-weight: 600;
    background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%);
    color: white;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
        filter: brightness(1.05);
        transform: translateY(-2px);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const CancelConfirmDismiss = styled.button`
    flex: 1;
    min-width: 180px;
    padding: 0.85rem 1.25rem;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.35);
    font-weight: 600;
    background: transparent;
    color: white;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.08);
        transform: translateY(-2px);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const ModalInterestedSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
`;

const ModalInterestedHeader = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
`;

const ModalInterestedTitle = styled.h3`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
    color: white;
`;

const ModalInterestedSubtitle = styled.p`
    margin: 0;
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.7);
`;

const ModalInterestedList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-height: 400px;
    overflow-y: auto;
    padding-right: 0.5rem;

    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
        background: ${({ theme }) => theme.colors.primary};
        border-radius: 3px;
    }
`;

const ModalInterestedCard = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 1.25rem;
    transition: all 0.2s ease;
    
    &:hover {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.2);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
`;

const InterestedCardHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`;

const InterestedAvatarContainer = styled.div`
    flex-shrink: 0;
`;

const InterestedAvatar = styled.img`
    width: 56px;
    height: 56px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid ${({ theme }) => theme.colors.primary || "#B648A0"};
`;

const InterestedAvatarPlaceholder = styled.div`
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary || "#B648A0"};
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    border: 2px solid ${({ theme }) => theme.colors.primary || "#B648A0"};
`;

const InterestedUserInfo = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
`;

const InterestedUserName = styled.h4`
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: white;
`;

const InterestedUserDetail = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.7);
    
    svg {
        opacity: 0.6;
    }
`;

const InterestedCardDetails = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 8px;
`;

const InterestedDetailRow = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
`;

const InterestedDetailIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    color: ${({ theme }) => theme.colors.primary || "#B648A0"};
    flex-shrink: 0;
    margin-top: 2px;
`;

const InterestedDetailText = styled.span`
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.5;
    flex: 1;
`;

const InterestedActions = styled.div`
    display: flex;
    gap: 0.75rem;
    margin-top: 0.5rem;
    
    @media (max-width: 480px) {
        flex-direction: column;
    }
`;

const baseInterestedBtn = `
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem 0.75rem;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.875rem;
    flex: 1;
`;

const InterestedAcceptButton = styled.button`
    ${baseInterestedBtn}
    background-color: #10b981;
    color: white;
    &:hover:not(:disabled) {
        background-color: #059669;
        transform: translateY(-1px);
    }
    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const InterestedRejectButton = styled.button`
    ${baseInterestedBtn}
    background-color: #ef4444;
    color: white;
    &:hover:not(:disabled) {
        background-color: #dc2626;
        transform: translateY(-1px);
    }
    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

