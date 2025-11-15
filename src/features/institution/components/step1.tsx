import styled from "styled-components";
import { InputComponent } from "@components/InputComponent";
import { LabelDiv } from "./LabelStyles";

export default function Step1({ name, age, handleChange }: { name: string, age: number, handleChange: (key: string, value: string) => void }) {
    return (
        <Step1Container>
            <LabelDiv>
                <label>Nome</label>
                <InputComponent
                    label="name"
                    type="text"
                    placeholder="Insira o nome do animal"
                    value={name}
                    onChange={handleChange} />
            </LabelDiv>
            <RowContainer>
                <LabelDiv style={{ flex: 1 }}>
                    <label>Idade</label>
                    <InputComponent
                        label="age"
                        type="number"
                        placeholder="Insira a idade"
                        value={age?.toString() ?? ''}
                        onChange={handleChange} />
                </LabelDiv>
            </RowContainer>
        </Step1Container>
    );
}

const Step1Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
`;

const RowContainer = styled.div`
    display: flex;
    gap: 1rem;
    width: 100%;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;