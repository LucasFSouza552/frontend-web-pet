import styled from "styled-components";

const StickySidebar = styled.div`
    position: sticky;
    top: 5px;
    align-self: flex-start;
    height: fit-content;
    max-height: calc(100dvh - 30px);
    overflow-y: auto;
    z-index: 10;
    flex-shrink: 0;
    display: block;

    @media (max-width: 1024px) {
        display: none;
    }
    
    &::-webkit-scrollbar {
        width: 4px;
    }
    
    &::-webkit-scrollbar-track {
        background: transparent;
    }
    
    &::-webkit-scrollbar-thumb {
        background: ${({ theme }) => theme.colors.primary || "#B648A0"};
        border-radius: 2px;
    }
    
    @media (max-width: 1200px) {
        max-height: calc(100dvh - 20px);
        top: 10px;
    }
    
    @media (max-width: 1024px) {
        position: static;
        width: 100%;
        max-height: none;
        z-index: 1;
        top: 0;
    }
    
    @media (max-width: 768px) {
        width: 100%;
    }
`;

export default StickySidebar;