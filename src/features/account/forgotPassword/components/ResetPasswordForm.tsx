import styled, { useTheme } from "styled-components";
import { FaLock } from "react-icons/fa";

interface ResetPasswordFormProps {
    password: string;
    confirmPassword: string;
    error: string | null;
    loading: boolean;
    success: boolean;
    handlePasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleConfirmPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
}

export default function ResetPasswordForm({
    password,
    confirmPassword,
    error,
    loading,
    success,
    handlePasswordChange,
    handleConfirmPasswordChange,
    handleSubmit,
}: ResetPasswordFormProps) {
    const theme = useTheme();

    if (success) {
        return (
            <FormWrapper>
                <IconCircle>
                    <FaLock size={36} color={theme.colors.primary} />
                </IconCircle>
                <FormTitle>Senha redefinida com sucesso!</FormTitle>
                <FormDescription>
                    Sua senha foi alterada com sucesso. Você será redirecionado para a página de login.
                </FormDescription>
            </FormWrapper>
        );
    }

    return (
        <FormWrapper onSubmit={handleSubmit}>
            <IconCircle>
                <FaLock size={36} color={theme.colors.primary} />
            </IconCircle>
            <FormTitle>Redefinir senha</FormTitle>
            <FormDescription>
                Digite sua nova senha abaixo. Certifique-se de que ela tenha pelo menos 6 caracteres.
            </FormDescription>
            <InputFieldContainer>
                <label htmlFor="password">Nova senha</label>
                <InputField
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Digite sua nova senha"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                    disabled={loading}
                />
            </InputFieldContainer>
            <InputFieldContainer>
                <label htmlFor="confirmPassword">Confirmar senha</label>
                <InputField
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirme sua nova senha"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    required
                    disabled={loading}
                />
            </InputFieldContainer>
            <SubmitButton type="submit" disabled={loading}>
                {loading ? "Redefinindo..." : "Redefinir senha"}
            </SubmitButton>
            <HelperText>
                Use uma combinação única de letras, números e símbolos para maior segurança.
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

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
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
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.bg};
    cursor: pointer;
    transition: transform 0.2s, opacity 0.2s;

    &:hover:not(:disabled) {
        transform: translateY(-1px);
        opacity: 0.95;
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const HelperText = styled.small`
    display: block;
    text-align: center;
    color: rgba(255, 255, 255, 0.6);
    font-size: 13px;
`;

