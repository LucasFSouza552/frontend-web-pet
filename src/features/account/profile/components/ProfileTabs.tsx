import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ProfileContext } from "@contexts/ProfileContext";
import { useContext, useEffect } from "react";

export type TabType = "posts" | "pets" | "adopted" | "history";

interface ProfileTabsProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
    accountRole?: "user" | "admin" | "institution";
}

export default function ProfileTabs({ activeTab, onTabChange, accountRole }: ProfileTabsProps) {
    const profileAccountId = useParams().username;
    const { account } = useContext(ProfileContext);

    return (
        <TabsContainer>
            <TabButton
                active={activeTab === "posts"}
                onClick={() => onTabChange("posts")}
            >
                Publicações
            </TabButton>
            <TabButton
                active={activeTab === "pets"}
                onClick={() => onTabChange("pets")}
            >
                Pets Desejados
            </TabButton>
            <TabButton
                active={activeTab === "adopted"}
                onClick={() => onTabChange("adopted")}
            >
                {accountRole === "institution" ? "Pets na instituição" : "Pets Adotados"}
            </TabButton>
            {account?.id === profileAccountId && <TabButton
                active={activeTab === "history"}
                onClick={() => onTabChange("history")}
            >
                Histórico
            </TabButton>}
        </TabsContainer>
    );
}

const TabsContainer = styled.div`
    display: flex;
    gap: 0.25rem;
    width: 100%;
    background-color: ${({ theme }) => theme.colors.quarternary || "rgba(0, 0, 0, 0.3)"};
    padding: 0.25rem;
    border-radius: 8px;
    backdrop-filter: blur(10px);
    margin-top: 0.75rem;
`;

const TabButton = styled.button<{ active: boolean }>`
    flex: 1;
    padding: 0.5rem 1rem;
    background-color: ${({ active, theme }) =>
        active ? (theme.colors.primary || "#008CFF") : "transparent"};
    color: ${({ active }) => active ? "#fff" : "rgba(255, 255, 255, 0.7)"};
    border: none;
    border-radius: 6px;
    font-weight: ${({ active }) => active ? "600" : "normal"};
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
        background-color: ${({ active, theme }) =>
        active ? (theme.colors.primary || "#008CFF") : "rgba(255, 255, 255, 0.1)"};
        color: ${({ active }) => active ? "#fff" : "#fff"};
    }

    &:active {
        transform: scale(0.98);
    }
`;

