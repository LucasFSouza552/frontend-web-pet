import { useEffect, useState } from "react";
import styled from "styled-components";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { historyService } from "@/features/account/history/historyService";
import animationFile from "@/shared/assets/lottie/loading.lottie?url";

interface HistoryTabProps {
    accountId?: string;
}

export default function HistoryTab({ accountId }: HistoryTabProps) {
    const [historyRecords, setHistoryRecords] = useState<any[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

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
            console.log(histories);
            setHistoryRecords(histories || []);
        } catch (error) {
            console.error("Erro ao carregar histórico:", error);
            setHistoryRecords([]);
        } finally {
            setLoadingHistory(false);
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
                    {historyRecords.map((history, index) => (
                        <HistoryCard key={history.id || index}>
                            <HistoryContent>
                                <HistoryTitle>{history.title || "Registro de histórico"}</HistoryTitle>
                                <HistoryDescription>
                                    {history.description || history.content || "Sem descrição"}
                                </HistoryDescription>
                                {history.createdAt && (
                                    <HistoryDate>
                                        {new Date(history.createdAt).toLocaleDateString("pt-BR", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric"
                                        })}
                                    </HistoryDate>
                                )}
                            </HistoryContent>
                        </HistoryCard>
                    ))}
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
    border-radius: 12px;
    padding: 1.5rem;
    backdrop-filter: blur(10px);
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
`;

const HistoryContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
`;

const HistoryTitle = styled.h3`
    color: white;
    font-size: 1.25rem;
    font-weight: bold;
    margin: 0;
`;

const HistoryDescription = styled.p`
    color: rgba(255, 255, 255, 0.9);
    font-size: 1rem;
    line-height: 1.5;
    margin: 0;
`;

const HistoryDate = styled.span`
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.875rem;
    margin-top: 0.5rem;
`;

