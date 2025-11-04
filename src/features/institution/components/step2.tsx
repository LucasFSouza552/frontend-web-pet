import styled from "styled-components";
import { LabelDiv } from "./LabelStyles";

export default function Step2({ type, gender, handleChange }: { type: string, gender: string, handleChange: (key: string, value: string) => void }) {
    return (
        <Step2Container>
            <LabelDiv>
                <label>Qual tipo de animal?</label>
                <SelectMenu
                    value={type}
                    onChange={(e) => handleChange("type", e.target.value)}
                >
                    <option value="">Selecione...</option>
                    <option value="cat">Gato</option>
                    <option value="dog">Cão</option>
                    <option value="bird">Pássaro</option>
                    <option value="other">Outro</option>
                </SelectMenu>
            </LabelDiv>
            <LabelDiv>
                <label>Sexo</label>
                <SelectMenu
                    value={gender}
                    onChange={(e) => handleChange("gender", e.target.value)}
                >
                    <option value="">Selecione...</option>
                    <option value="male">Macho</option>
                    <option value="female">Fêmea</option>
                </SelectMenu>
            </LabelDiv>
        </Step2Container>
    );
}

const Step2Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
`;

const SelectMenu = styled.select`
    padding: 12px 15px;
    border-radius: 8px;
    border: 2px solid ${({ theme }) => theme.colors.primary || "#B648A0"};
    background-color: ${({ theme }) => theme.colors.quarternary || "#332630"};
    color: white;
    font-size: 0.95rem;
    width: 100%;
    cursor: pointer;
    transition: all 0.3s ease;
    outline: none;

    &:focus {
        border-color: ${({ theme }) => theme.colors.primary || "#B648A0"};
        box-shadow: 0 0 0 3px rgba(182, 72, 160, 0.2);
    }

    option {
        background-color: ${({ theme }) => theme.colors.quarternary || "#332630"};
        color: white;
    }
`;