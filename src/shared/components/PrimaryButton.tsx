import styled from "styled-components"
import { useNavigate } from "react-router-dom";

export const PrimaryButton = ({ text, type = "button", to, filled = true, width, height, onClick, disabled = false }: { text: string, type?: "button" | "submit" | "reset", to?: string, filled: boolean, width?: string, height?: string, onClick?: () => void, disabled?: boolean }) => {

    const navigate = useNavigate();

    const handleClick = () => {
        if (to) {
            navigate(to);
        }
    };

    return (
        <Button type={type} $filled={filled} value={text} width={width} height={height} onClick={onClick || handleClick} disabled={disabled} />
    );
}

const Button = styled.input<{ $filled: boolean, disabled: boolean }>`
    background-color:${({ theme, $filled, disabled }) => 
        disabled 
            ? theme.colors.tertiary || "#cccccc" 
            : $filled 
                ? theme.colors.primary 
                : "transparent"};
    border: ${({ $filled, theme, disabled }) =>
        disabled
            ? `2px solid ${theme.colors.tertiary || "#cccccc"}`
            : $filled 
                ? `2px solid #FFF` 
                : `2px solid ${theme.colors.primary}`};
    border-radius: 10px;
    width: ${({ width }) => width};
    height: ${({ height }) => height};
    
    font-size: 20px;
    padding: 5px 10px;
    font-weight: bolder;
    
    transition: all 0.3s;
    color: ${({ $filled, theme, disabled }) => 
        disabled 
            ? theme.colors.text || "#999999" 
            : $filled 
                ? "#FFF" 
                : theme.colors.primary};
    cursor: ${({ disabled }) => disabled ? "not-allowed" : "pointer"};
    opacity: ${({ disabled }) => disabled ? 0.6 : 1};

    &:hover {
        background-color: ${({ $filled, theme, disabled }) => 
            disabled 
                ? theme.colors.tertiary || "#cccccc"
                : $filled 
                    ? "none" 
                    : theme.colors.primary};
        border: ${({ $filled, theme, disabled }) => 
            disabled
                ? `2px solid ${theme.colors.tertiary || "#cccccc"}`
                : !$filled 
                    ? "2px solid transparent" 
                    : `2px solid ${theme.colors.primary}`};
        color: ${({ $filled, disabled }) => 
            disabled 
                ? undefined
                : $filled 
                    ? "#FFF" 
                    : "#FFF"};
    }

    &:active {
        transform: ${({ disabled }) => disabled ? "none" : "scale(0.98)"};
    }
`;