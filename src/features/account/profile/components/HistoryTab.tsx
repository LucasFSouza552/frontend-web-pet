import { useEffect, useState } from "react";
import styled from "styled-components";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { historyService } from "@/features/account/history/historyService";
import animationFile from "@/shared/assets/lottie/loading.lottie?url";
import type IHistory from "@/shared/models/history";
import { FaHeart, FaHandHoldingHeart, FaDonate, FaPaw, FaBuilding, FaCalendarAlt, FaMoneyBillWave, FaWeight, FaBirthdayCake, FaMars, FaVenus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import type IPet from "@/shared/models/Pet";

interface HistoryTabProps {
    accountId?: string;
}

export default function HistoryTab({ accountId }: HistoryTabProps) {
    const [historyRecords, setHistoryRecords] = useState<IHistory[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (accountId) {
            loadHistory();
        }
    }, [accountId]);

    const loadHistory = async () => {
        if (!accountId) return;
        setLoadingHistory(true);
        try {
            const histories = await historyService.listHistoriesByAccount();
            setHistoryRecords(histories || []);
        } catch (error) {
            console.error("Erro ao carregar histórico:", error);
            setHistoryRecords([]);
        } finally {
            setLoadingHistory(false);
        }
    };

    const translateType = (type: string): string => {
        const translations: Record<string, string> = {
            adoption: "Adoção",
            sponsorship: "Apadrinhamento",
            donation: "Doação"
        };
        return translations[type] || type;
    };

    const translateStatus = (status?: string): string => {
        if (!status) return "Sem status";
        const translations: Record<string, string> = {
            pending: "Pendente",
            completed: "Concluído",
            cancelled: "Cancelado",
            refunded: "Reembolsado"
        };
        return translations[status] || status;
    };

    const getStatusColor = (status?: string): string => {
        if (!status) return "rgba(255, 255, 255, 0.3)";
        const colors: Record<string, string> = {
            pending: "#FFA500",
            completed: "#4CAF50",
            cancelled: "#F44336",
            refunded: "#9E9E9E"
        };
        return colors[status] || "rgba(255, 255, 255, 0.3)";
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "adoption":
                return <FaPaw />;
            case "sponsorship":
                return <FaHandHoldingHeart />;
            case "donation":
                return <FaDonate />;
            default:
                return <FaHeart />;
        }
    };

    const formatCurrency = (amount?: string): string => {
        if (!amount) return "";
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount)) return amount;
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
        }).format(numAmount);
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const getPet = (pet: string | IPet | null | undefined): IPet | null => {
        if (!pet) return null;
        if (typeof pet === "string") return null;
        return pet as IPet;
    };

    const getInstitution = (institution: string | any | null | undefined): any => {
        if (!institution) return null;
        if (typeof institution === "string") return { id: institution, name: institution };
        return institution;
    };

    const getInstitutionName = (institution: string | any | null | undefined): string => {
        const inst = getInstitution(institution);
        return inst?.name || "";
    };

    const getInstitutionId = (institution: string | any | null | undefined): string => {
        const inst = getInstitution(institution);
        return inst?.id || "";
    };

    const translateGender = (gender?: string): string => {
        if (!gender) return "";
        return gender === "male" ? "Macho" : "Fêmea";
    };

    const formatWeight = (weight?: number): string => {
        if (!weight) return "";
        return `${weight} kg`;
    };

    const handleInstitutionClick = (institutionId: string) => {
        if (institutionId) {
            navigate(`/profile/${institutionId}`);
        }
    };

    if (loadingHistory) {
        return (
            <LoadingContainer>
                <DotLottieReact src={animationFile} autoplay loop style={{ width: "500px" }} />
            </LoadingContainer>
        );
    }

    return (
        <ContentContainer>
            <h2>Histórico</h2>
            {historyRecords.length === 0 ? (
                <EmptyState>
                    <h3>Nenhum histórico disponível</h3>
                    <p>Seu histórico de atividades aparecerá aqui.</p>
                </EmptyState>
            ) : (
                <HistoryList>
                    {historyRecords.map((history, index) => {
                        return (
                            <HistoryCard key={history.id || index}>
                                <HistoryHeader>
                                    <TypeBadge $type={history.type}>
                                        <TypeIcon>{getTypeIcon(history.type)}</TypeIcon>
                                        <TypeText>{translateType(history.type)}</TypeText>
                                    </TypeBadge>
                                    {history.status && (
                                        <StatusBadge $color={getStatusColor(history.status)}>
                                            {translateStatus(history.status)}
                                        </StatusBadge>
                                    )}
                                </HistoryHeader>

                                <HistoryContent>
                                    {history.pet && getPet(history.pet) && (() => {
                                        const pet = getPet(history.pet);
                                        if (!pet) return null;
                                        
                                        return (
                                            <PetInfoContainer>
                                                <PetHeader>
                                                    <InfoIcon>
                                                        <FaPaw />
                                                    </InfoIcon>
                                                    <InfoLabel>Pet</InfoLabel>
                                                </PetHeader>
                                                <PetDetails>
                                                    <PetName>{pet.name}</PetName>
                                                    <PetInfoGrid>
                                                        {pet.type && (
                                                            <PetInfoItem>
                                                                <PetInfoLabel>Tipo:</PetInfoLabel>
                                                                <PetInfoValue>{pet.type}</PetInfoValue>
                                                            </PetInfoItem>
                                                        )}
                                                        {pet.age !== undefined && (
                                                            <PetInfoItem>
                                                                <FaBirthdayCake size={14} />
                                                                <PetInfoValue>{pet.age} {pet.age === 1 ? 'ano' : 'anos'}</PetInfoValue>
                                                            </PetInfoItem>
                                                        )}
                                                        {pet.gender && (
                                                            <PetInfoItem>
                                                                {pet.gender === "male" ? <FaMars size={14} /> : <FaVenus size={14} />}
                                                                <PetInfoValue>{translateGender(pet.gender)}</PetInfoValue>
                                                            </PetInfoItem>
                                                        )}
                                                        {pet.weight && (
                                                            <PetInfoItem>
                                                                <FaWeight size={14} />
                                                                <PetInfoValue>{formatWeight(pet.weight)}</PetInfoValue>
                                                            </PetInfoItem>
                                                        )}
                                                    </PetInfoGrid>
                                                    {pet.description && (
                                                        <PetDescription>{pet.description}</PetDescription>
                                                    )}
                                                </PetDetails>
                                            </PetInfoContainer>
                                        );
                                    })()}

                                    {history.institution && getInstitutionName(history.institution) && (() => {
                                        const institutionId = getInstitutionId(history.institution);
                                        const institutionName = getInstitutionName(history.institution);
                                        
                                        return (
                                            <InfoRow>
                                                <InfoIcon>
                                                    <FaBuilding />
                                                </InfoIcon>
                                                <InfoText>
                                                    <InfoLabel>Instituição:</InfoLabel>
                                                    <InstitutionLink 
                                                        onClick={() => institutionId && handleInstitutionClick(institutionId)}
                                                        $clickable={!!institutionId}
                                                    >
                                                        {institutionName}
                                                    </InstitutionLink>
                                                </InfoText>
                                            </InfoRow>
                                        );
                                    })()}

                                    {history.amount && (
                                        <InfoRow>
                                            <InfoIcon>
                                                <FaMoneyBillWave />
                                            </InfoIcon>
                                            <InfoText>
                                                <InfoLabel>Valor:</InfoLabel>
                                                <AmountValue>{formatCurrency(history.amount)}</AmountValue>
                                            </InfoText>
                                        </InfoRow>
                                    )}

                                    {history.externalReference && (
                                        <InfoRow>
                                            <InfoText>
                                                <InfoLabel>Referência Externa:</InfoLabel>
                                                <ReferenceCode>{history.externalReference}</ReferenceCode>
                                            </InfoText>
                                        </InfoRow>
                                    )}

                                    {history.createdAt && (
                                        <InfoRow>
                                            <InfoIcon>
                                                <FaCalendarAlt />
                                            </InfoIcon>
                                            <InfoText>
                                                <InfoLabel>Data e Hora:</InfoLabel>
                                                {formatDate(history.createdAt)}
                                            </InfoText>
                                        </InfoRow>
                                    )}
                                </HistoryContent>
                            </HistoryCard>
                        )
                    })}
                </HistoryList>
            )}
        </ContentContainer>
    );
}


const ContentContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    color: white;

    h2 {
        color: white;
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
        font-weight: bold;
    }
`;

const LoadingContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 3rem;
`;

const EmptyState = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    color: rgba(255, 255, 255, 0.7);
    background-color: ${({ theme }) => theme.colors.quarternary || "rgba(0, 0, 0, 0.3)"};
    border-radius: 16px;
    padding: 3rem 2rem;
    text-align: center;
    backdrop-filter: blur(10px);

    h3 {
        font-size: 1.25rem;
        margin-bottom: 0.5rem;
        color: white;
    }

    p {
        font-size: 1rem;
        opacity: 0.8;
    }
`;

const HistoryList = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem 0;
`;

const HistoryCard = styled.div`
    width: 100%;
    background-color: ${({ theme }) => theme.colors.quarternary || "rgba(0, 0, 0, 0.3)"};
    border: 1px solid ${({ theme }) => theme.colors.primary}40;
    border-radius: 16px;
    padding: 1.5rem;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3),
                    0 0 20px ${({ theme }) => theme.colors.primary}30;
        border-color: ${({ theme }) => theme.colors.primary}80;
    }

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(
            90deg,
            ${({ theme }) => theme.colors.primary},
            ${({ theme }) => theme.colors.primary}80,
            transparent
        );
    }
`;

const HistoryHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.25rem;
    gap: 1rem;
    flex-wrap: wrap;
`;

const TypeBadge = styled.div<{ $type: string }>`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: ${({ theme, $type }) => {
        const colors: Record<string, string> = {
            adoption: `${theme.colors.primary}30`,
            sponsorship: `${theme.colors.primary}25`,
            donation: `${theme.colors.primary}20`
        };
        return colors[$type] || `${theme.colors.primary}20`;
    }};
    border: 1px solid ${({ theme }) => theme.colors.primary}60;
    border-radius: 20px;
    color: ${({ theme }) => theme.colors.primary};
`;

const TypeIcon = styled.span`
    display: flex;
    align-items: center;
    font-size: 1rem;
`;

const TypeText = styled.span`
    font-weight: 600;
    font-size: 0.95rem;
    text-transform: capitalize;
`;

const StatusBadge = styled.span<{ $color: string }>`
    padding: 0.4rem 0.9rem;
    background: ${({ $color }) => $color}30;
    border: 1px solid ${({ $color }) => $color}80;
    border-radius: 20px;
    color: ${({ $color }) => $color};
    font-size: 0.85rem;
    font-weight: 600;
    white-space: nowrap;
`;

const HistoryContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const InfoRow = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.5rem 0;
`;

const InfoIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 24px;
    width: 24px;
    height: 24px;
    color: ${({ theme }) => theme.colors.primary};
    font-size: 0.9rem;
    margin-top: 2px;
`;

const InfoText = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1;
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.95rem;
    line-height: 1.4;
`;

const InfoLabel = styled.span`
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.8rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
`;

const AmountValue = styled.span`
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 700;
    font-size: 1.1rem;
`;

const ReferenceCode = styled.code`
    background: rgba(0, 0, 0, 0.3);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.1);
`;

const PetInfoContainer = styled.div`
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid ${({ theme }) => theme.colors.primary}30;
    border-radius: 12px;
    padding: 1rem;
    margin: 0.5rem 0;
`;

const PetHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
`;

const PetDetails = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
`;

const PetName = styled.h4`
    color: ${({ theme }) => theme.colors.primary};
    font-size: 1.1rem;
    font-weight: 700;
    margin: 0;
`;

const PetInfoGrid = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
`;

const PetInfoItem = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9rem;

    svg {
        color: ${({ theme }) => theme.colors.primary};
    }
`;

const PetInfoLabel = styled.span`
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.85rem;
    font-weight: 500;
`;

const PetInfoValue = styled.span`
    color: rgba(255, 255, 255, 0.9);
    font-weight: 500;
`;

const PetDescription = styled.p`
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
    line-height: 1.5;
    margin: 0;
    padding-top: 0.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const InstitutionLink = styled.span<{ $clickable: boolean }>`
    color: ${({ theme, $clickable }) => $clickable ? theme.colors.primary : 'rgba(255, 255, 255, 0.9)'};
    font-weight: ${({ $clickable }) => $clickable ? '600' : 'normal'};
    cursor: ${({ $clickable }) => $clickable ? 'pointer' : 'default'};
    transition: all 0.2s ease;
    display: inline-block;

    ${({ $clickable }) => $clickable && `
        &:hover {
            text-decoration: underline;
            transform: translateX(2px);
        }
    `}
`;

