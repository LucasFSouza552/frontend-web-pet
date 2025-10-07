import styled from "styled-components"
import { useNavigate } from "react-router-dom";

export const PrimaryButton = ({ text, type = "button", to, filled = true, width, height, onClick }: { text: string, type: "button" | "submit" | "reset", to?: string, filled: boolean, width?: string, height?: string, onClick?: () => void }) => {

    const navigate = useNavigate();

    const handleClick = () => {
        if (to) {
            navigate(to);
        }
    };

    return (
        <Button type={type} $filled={filled} value={text} width={width} height={height} onClick={onClick || handleClick} />
    );
}

const Button = styled.input<{ $filled: boolean }>`
    background-color:${({ theme, $filled }) => $filled ? theme.colors.primary : "#FFF"};
    border: ${({ $filled, theme }) =>
        $filled ? "none" : `2px solid ${theme.colors.primary}`};
    border-radius: 10px;
    width: ${({ width }) => width};
    height: ${({ height }) => height};
    
    font-size: 20px;
    padding: 5px 10px;
    font-weight: bolder;
    color: ${({ $filled, theme }) =>
        $filled ? "#FFF" : theme.colors.primary};
    cursor: pointer;
`;