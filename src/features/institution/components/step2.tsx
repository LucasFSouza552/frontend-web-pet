import { styled } from "styled-components";
import { LabelDiv } from "./LabelStyles";

export default function Step2({ type, gender, handleChange }: { type: string, gender: string, handleChange: (key: string, value: string) => void }) {
    return (
        <>
            <LabelDiv>
                <label>Qual tipo de animal?</label>
                <SelectMenu>
                    <option value={type}>Gato</option>
                    <option value={type}>Cão</option>
                    <option value={type}>Pássaro</option>
                    <option value={type}>Outro</option>
                </SelectMenu>
            </LabelDiv>
            <LabelDiv>
                <label>Qual o gênero do animal?</label>
                <SelectMenu>
                    <option value={gender}>Macho</option>
                    <option value={gender}>Fêmea</option>
                </SelectMenu>
            </LabelDiv>
        </>
    );
}

const SelectMenu = styled.select`
    padding: 15px;
    border-radius: 10px;
    margin-top: 10px;
`;