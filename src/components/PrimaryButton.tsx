import styled from "styled-components"
import { useNavigate } from "react-router-dom";

export const PrimaryButton = ({ text, type = "button", to, filled = true }: { text: string, type: "button" | "submit" | "reset", to?: string, filled: boolean }) => {

    const navigate = useNavigate();

    const handleClick = () => {
        if (to)
            navigate(to);
    };

    return (
        <Button type={type} $filled={filled} value={text} onClick={handleClick} />
    )
}

const Button = styled.input<{ $filled: boolean }>`
    background-color:${({ theme, $filled }) => $filled ? theme.colors.primary : "#FFF"};
    border: ${({ $filled, theme }) =>
            $filled ? "none" : `2px solid ${theme.colors.primary}`};
    border-radius: 10px;
    font-size: 20px;
    padding: 5px 10px;
    font-weight: bolder;
    color: ${({ $filled, theme }) =>
            $filled ? "#FFF" : theme.colors.primary};
    cursor: pointer;
`;