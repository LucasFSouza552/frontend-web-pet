import { useState } from "react";
import styled from "styled-components";
import { FaSearch, FaChevronDown } from "react-icons/fa";

export type AccountTypeFilter = "all" | "institution" | "user" | "admin";

interface SearchBarProps {
    onSearch: (query: string) => void;
    placeholder?: string;
    accountTypeFilter?: AccountTypeFilter;
    onAccountTypeFilterChange?: (filter: AccountTypeFilter) => void;
}

export default function SearchBar({ 
    onSearch, 
    placeholder = "Pesquisar posts...",
    accountTypeFilter = "all",
    onAccountTypeFilterChange
}: SearchBarProps) {
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

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (onAccountTypeFilterChange) {
            onAccountTypeFilterChange(e.target.value as AccountTypeFilter);
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
                {onAccountTypeFilterChange && (
                    <FilterDropdownWrapper>
                        <FilterDropdown
                            value={accountTypeFilter}
                            onChange={handleFilterChange}
                        >
                            <option value="all">Todos</option>
                            <option value="institution">Instituições</option>
                            <option value="user">Usuários</option>
                            <option value="admin">Administradores</option>
                        </FilterDropdown>
                        <FilterDropdownIcon>
                            <FaChevronDown size={12} />
                        </FilterDropdownIcon>
                    </FilterDropdownWrapper>
                )}
                <SearchButton type="submit">
                    <FaSearch size={20} />
                    <ButtonText>Pesquisar</ButtonText>
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
    flex-wrap: nowrap;

    @media (max-width: 768px) {
        flex-direction: row;
        gap: 0.75rem;
    }
`;

const SearchInputWrapper = styled.div`
    position: relative;
    flex: 3;
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

    @media (max-width: 480px) {
        padding: 12px 12px 12px 40px;
        
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
    width: fit-content;
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

    @media (max-width: 480px) {
        width: auto;
        min-width: 48px;
        padding: 14px;
        justify-content: center;
    }
`;

const ButtonText = styled.span`
    @media (max-width:  768px) {
        display: none;
    }
`;

const FilterDropdownWrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    min-width: 160px;

    @media (max-width: 768px) {
        min-width: 140px;
    }

    @media (max-width: 480px) {
        min-width: 120px;
    }
`;

const FilterDropdown = styled.select`
    width: 100%;
    padding: 14px 40px 14px 16px;
    border-radius: 12px;
    border: 2px solid ${({ theme }) => theme.colors.primary || "#B648A0"};
    outline: none;
    background-color: ${({ theme }) => theme.colors.quarternary || "rgba(51, 38, 48, 0.95)"};
    color: white;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;

    &:focus {
        border-color: ${({ theme }) => theme.colors.primary || "#B648A0"};
        box-shadow: 0 0 0 4px rgba(182, 72, 160, 0.2);
        background-color: ${({ theme }) => theme.colors.quinary || "rgba(74, 58, 70, 0.95)"};
    }

    option {
        background-color: ${({ theme }) => theme.colors.quarternary || "#332630"};
        color: white;
        padding: 0.5rem;
    }

    @media (max-width: 480px) {
        padding: 12px 36px 12px 12px;
        font-size: 0.875rem;
    }
`;

const FilterDropdownIcon = styled.div`
    position: absolute;
    right: 12px;
    color: ${({ theme }) => theme.colors.primary || "#B648A0"};
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
`;

