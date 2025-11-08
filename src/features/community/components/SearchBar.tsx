import { useState } from "react";
import styled from "styled-components";
import { FaSearch } from "react-icons/fa";

interface SearchBarProps {
    onSearch: (query: string) => void;
    placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = "Pesquisar posts..." }: SearchBarProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchQuery);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        if (value === "") {
            onSearch("");
        }
    };

    return (
        <SearchContainer>
            <SearchForm onSubmit={handleSubmit}>
                <SearchInputWrapper>
                    <SearchIcon>
                        <FaSearch size={20} />
                    </SearchIcon>
                    <SearchInput
                        type="text"
                        placeholder={placeholder}
                        value={searchQuery}
                        onChange={handleChange}
                    />
                    {searchQuery && (
                        <ClearButton
                            type="button"
                            onClick={() => {
                                setSearchQuery("");
                                onSearch("");
                            }}
                        >
                            ×
                        </ClearButton>
                    )}
                </SearchInputWrapper>
                <SearchButton type="submit">
                    <FaSearch size={16} />
                    Pesquisar
                </SearchButton>
            </SearchForm>
        </SearchContainer>
    );
}

const SearchContainer = styled.div`
    width: 100%;
    margin-bottom: 1.5rem;
`;

const SearchForm = styled.form`
    display: flex;
    gap: 1rem;
    align-items: center;

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 0.75rem;
    }
`;

const SearchInputWrapper = styled.div`
    position: relative;
    flex: 1;
    display: flex;
    align-items: center;
`;

const SearchIcon = styled.div`
    position: absolute;
    left: 16px;
    color: ${({ theme }) => theme.colors.primary || "#B648A0"};
    z-index: 1;
    pointer-events: none;
`;

const SearchInput = styled.input`
    width: 100%;
    padding: 14px 16px 14px 48px;
    border-radius: 12px;
    border: 2px solid ${({ theme }) => theme.colors.primary || "#B648A0"};
    outline: none;
    background-color: ${({ theme }) => theme.colors.quarternary || "rgba(51, 38, 48, 0.95)"};
    color: white;
    font-size: 1rem;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);

    &::placeholder {
        color: rgba(255, 255, 255, 0.5);
    }

    &:focus {
        border-color: ${({ theme }) => theme.colors.primary || "#B648A0"};
        box-shadow: 0 0 0 4px rgba(182, 72, 160, 0.2);
        background-color: ${({ theme }) => theme.colors.quinary || "rgba(74, 58, 70, 0.95)"};
    }
`;

const ClearButton = styled.button`
    position: absolute;
    right: 12px;
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.7);
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s ease;
    z-index: 1;

    &:hover {
        background-color: rgba(255, 255, 255, 0.1);
        color: white;
    }
`;

const SearchButton = styled.button`
    padding: 14px 24px;
    border-radius: 12px;
    border: none;
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary || "#B648A0"} 0%, #a502b4 100%);
    color: white;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
    white-space: nowrap;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(182, 72, 160, 0.4);
    }

    &:active {
        transform: translateY(0);
    }

    @media (max-width: 768px) {
        width: 100%;
        justify-content: center;
    }
`;

