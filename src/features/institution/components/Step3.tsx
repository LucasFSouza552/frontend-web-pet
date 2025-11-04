import styled from "styled-components";
import { InputComponent } from "../../../shared/components/InputComponent";
import { LabelDiv } from "./LabelStyles";

export default function Step3({ weight, description, handleChange }: { weight: string, description: string, handleChange: (key: string, value: string) => void }) {
    return (
        <Step3Container>
            <LabelDiv>
                <label>Peso</label>
                <InputComponent 
                    label="weight"
                    type="number"
                    placeholder="Digite o peso do animal"
                    value={weight}
                    onChange={handleChange}/>
            </LabelDiv>
            <LabelDiv>
                <label>Descrição</label>
                <InputComponent 
                    label="description"
                    type="textarea"
                    placeholder="Descreva mais sobre o animal!"
                    value={description}
                    onChange={handleChange}/>
            </LabelDiv>
        </Step3Container>
    );
}

const Step3Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
`;