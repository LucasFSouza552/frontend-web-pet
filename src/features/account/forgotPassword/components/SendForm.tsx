import styled, { useTheme } from "styled-components";
import { FaEnvelopeOpenText } from "react-icons/fa";

interface RecoveryPassProps {
    email: string;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
}

export default function RecoveryPasswordForm({ email, handleChange, handleSubmit }: RecoveryPassProps) {
    const theme = useTheme();

    return (
        <FormWrapper onSubmit={handleSubmit}>
            <IconCircle>
                <FaEnvelopeOpenText size={36} color={theme.colors.primary} />
            </IconCircle>
            <FormTitle>Recuperar acesso</FormTitle>
            <FormDescription>
                Receba um link de redefinição no e-mail associado à sua conta e escolha uma nova senha segura.
            </FormDescription>
            <InputFieldContainer>
                <label htmlFor="email">E-mail cadastrado</label>
                <InputField
                    id="email"
                    name="email"
                    type="email"
                    placeholder="exemplo@email.com"
                    value={email}
                    onChange={handleChange}
                    required
                />
            </InputFieldContainer>
            <SubmitButton type="submit">Enviar link seguro</SubmitButton>
            <HelperText>
                Caso não receba o e-mail, verifique a caixa de spam ou tente novamente em alguns minutos.
            </HelperText>
        </FormWrapper>
    );
}

const FormWrapper = styled.form`
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 12px 6px;
`;

const IconCircle = styled.div`
    width: 70px;
    height: 70px;
    border-radius: 50%;
    align-self: center;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.2);
`;

const FormTitle = styled.h2`
    margin: 0;
    color: #fff;
    font-size: 32px;
    text-align: center;
`;

const FormDescription = styled.p`
    margin: 0;
    color: rgba(255, 255, 255, 0.8);
    text-align: center;
    line-height: 1.5;
`;

const InputFieldContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
    label {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.9);
    }
`;

const InputField = styled.input`
    border: none;
    border-radius: 14px;
    padding: 12px 14px;
    background: rgba(255, 255, 255, 0.06);
    color: #fff;
    font-size: 16px;
    outline: none;
    transition: border 0.2s;

    &:focus {
        border: 1px solid rgba(255, 255, 255, 0.7);
        background: rgba(255, 255, 255, 0.1);
    }

    &::placeholder {
        color: rgba(255, 255, 255, 0.5);
    }
`;

const SubmitButton = styled.button`
    border: none;
    border-radius: 16px;
    padding: 14px;
    font-size: 16px;
    font-weight: 700;
    background: linear-gradient(180deg, #eeb5ff, #b648a0);
    color: #120211;
    cursor: pointer;
    transition: transform 0.2s, opacity 0.2s;

    &:hover {
        transform: translateY(-1px);
        opacity: 0.95;
    }
`;

const HelperText = styled.small`
    display: block;
    text-align: center;
    color: rgba(255, 255, 255, 0.6);
    font-size: 13px;
`;