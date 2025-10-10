import { InputComponent } from "../../../shared/components/InputComponent";
import { useState } from "react";
import { styled } from "styled-components";

const [formData, setFormData] = useState({ nome: "", sobrenome: "", email: "", endereço: "" });

const handleInputChange = (type: string, value: string) => {
    setFormData((prev) => ({ ...prev, [type]: value }));
}

export default function Forms() {
    return (
        <FormContainer>
            <Container>
                <InputComponent
                    label="Nome"
                    type="text"
                    placeholder="Digite seu nome"
                    value={formData.nome}
                    onChange={handleInputChange} />
                <InputComponent
                    label="Sobrenome"
                    type="text"
                    placeholder="Digite seu sobrenome"
                    value={formData.sobrenome}
                    onChange={handleInputChange} />
            </Container>
            <Container>
                <InputComponent
                    label="Email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange} />
                <InputComponent
                    label="Endereço"
                    type="text"
                    placeholder="Endereço"
                    value={formData.endereço}
                    onChange={handleInputChange} />
            </Container>
        </FormContainer>
    );
}

const Container = styled.div`
    display: flex;
`;

const FormContainer = styled.form`
    background-color: #61475C;
`;