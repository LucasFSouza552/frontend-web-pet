import { InputComponent } from "@/shared/components/InputComponent";
import { ProfileContext } from "@/shared/contexts/ProfileContext";
import { PrimaryButton } from "@/shared/components/PrimaryButton";
import { accountService } from "@/shared/api/accountService";
import { pictureService } from "@/shared/api/pictureService";
import { useContext, useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Section from "@/shared/styles/SectionStyle";
import SideBar from "@/shared/components/Sidebar";
import backgroundPage from "@/shared/assets/images/background-page.jpg";
import { FaArrowLeft, FaCamera, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import type { IAccount } from "@/shared/models/Account";
import type IAddress from "@/shared/interfaces/IAddress";
import { authService } from "@/shared/api/authService";

export default function ProfileEditionPage() {
    const { account, loadProfile } = useContext(ProfileContext);
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<IAccount | null>(null);
    const [address, setAddress] = useState<IAddress>({
        street: "",
        number: "",
        complement: "",
        city: "",
        cep: "",
        state: "",
        neighborhood: ""
    });
    const [password, setPassword] = useState({ current: "", new: "", confirm: "" });
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        if (account) {
            setFormData({ ...account });
            setAddress(account.address || {
                street: "",
                number: "",
                complement: "",
                city: "",
                cep: "",
                state: "",
                neighborhood: ""
            });
            setAvatarPreview(pictureService.fetchPicture(account.avatar));
        }
    }, [account]);

    const handleInputChange = (key: string, value: string) => {
        if (!formData) return;

        if (key.startsWith("address.")) {
            const addressKey = key.split(".")[1] as keyof IAddress;
            setAddress(prev => ({ ...prev, [addressKey]: value }));
        } else {
            setFormData(prev => prev ? { ...prev, [key]: value } : null);
        }
    };

    const handlePasswordChange = (field: "current" | "new" | "confirm", value: string) => {
        setPassword(prev => ({ ...prev, [field]: value }));
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData) return;

        setLoading(true);
        setMessage(null);

        try {
            if (password.new || password.current || password.confirm) {
                if (!password.current) {
                    throw new Error("Digite sua senha atual para alterar a senha");
                }
                if (password.new !== password.confirm) {
                    throw new Error("As senhas não coincidem");
                }
                if (password.new.length < 6) {
                    throw new Error("A nova senha deve ter pelo menos 6 caracteres");
                }

                await authService.changePassword(password.current, password.new);
            }

            if (fileInputRef.current?.files?.[0]) {
                const formDataAvatar = new FormData();
                console.log("Chegou aqui")
                formDataAvatar.append("avatar", fileInputRef.current.files[0]);
                await accountService.uploadAvatar(formDataAvatar as any);
            }

            const updateData: Partial<IAccount> = {
                name: formData.name,
                email: formData.email,
                phone_number: formData.phone_number,
                address: address
            };

            await accountService.updateAccount(updateData as IAccount);

            await loadProfile();

            setMessage({ type: "success", text: "Perfil atualizado com sucesso!" });

            setTimeout(() => {
                navigate(`/profile/${account?.id}`);
            }, 1500);
        } catch (error: any) {
            setMessage({
                type: "error",
                text: error.response?.data?.message || error.message || "Erro ao atualizar perfil"
            });
        } finally {
            setLoading(false);
        }
    };

    if (!account || !formData) {
        return (
            <LoadingContainer>
                <LoadingText>Carregando...</LoadingText>
            </LoadingContainer>
        );
    }

    return (
        <ProfileEditionContainer>
            <SectionContent>
                <StickySidebar>
                    <SideBar account={account} />
                </StickySidebar>
                <MainContent>
                    <FormContainer>
                        <HeaderContainer>
                            <BackButton onClick={() => navigate(`/profile/${account.id}`)}>
                                <FaArrowLeft /> Voltar
                            </BackButton>
                            <Title>Editar Perfil</Title>
                        </HeaderContainer>

                        <Form onSubmit={handleSubmit}>
                            <AvatarSection>
                                <AvatarContainer>
                                    <AvatarImage
                                        src={avatarPreview || pictureService.fetchPicture(account.avatar)}
                                        alt="Avatar"
                                    />
                                    <AvatarOverlay onClick={() => fileInputRef.current?.click()}>
                                        <FaCamera />
                                        <span>Alterar foto</span>
                                    </AvatarOverlay>
                                </AvatarContainer>
                                <HiddenInput
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                />
                            </AvatarSection>

                            <FormSection>
                                <SectionTitle>Informações Pessoais</SectionTitle>
                                <InputWrapper>
                                    <InputLabel>Nome</InputLabel>
                                    <InputComponent
                                        label="name"
                                        placeholder="Seu nome completo"
                                        value={formData.name || ""}
                                        type="text"
                                        onChange={handleInputChange}
                                    />
                                </InputWrapper>
                                <InputWrapper>
                                    <InputLabel>E-mail</InputLabel>
                                    <InputComponent
                                        label="email"
                                        placeholder="seu@email.com"
                                        value={formData.email || ""}
                                        type="email"
                                        onChange={handleInputChange}
                                    />
                                </InputWrapper>
                                <InputWrapper>
                                    <InputLabel>Telefone</InputLabel>
                                    <InputComponent
                                        label="phone_number"
                                        placeholder="(00) 00000-0000"
                                        value={formData.phone_number || ""}
                                        type="tel"
                                        onChange={handleInputChange}
                                    />
                                </InputWrapper>
                            </FormSection>

                            <FormSection>
                                <SectionTitle>Endereço</SectionTitle>
                                <Row>
                                    <InputWrapper>
                                        <InputLabel>CEP</InputLabel>
                                        <InputComponent
                                            label="address.cep"
                                            placeholder="00000-000"
                                            value={address.cep || ""}
                                            type="text"
                                            onChange={handleInputChange}
                                        />
                                    </InputWrapper>
                                    <InputWrapper>
                                        <InputLabel>Estado</InputLabel>
                                        <InputComponent
                                            label="address.state"
                                            placeholder="UF"
                                            value={address.state || ""}
                                            type="text"
                                            onChange={handleInputChange}
                                        />
                                    </InputWrapper>
                                </Row>
                                <InputWrapper>
                                    <InputLabel>Cidade</InputLabel>
                                    <InputComponent
                                        label="address.city"
                                        placeholder="Sua cidade"
                                        value={address.city || ""}
                                        type="text"
                                        onChange={handleInputChange}
                                    />
                                </InputWrapper>
                                <InputWrapper>
                                    <InputLabel>Bairro</InputLabel>
                                    <InputComponent
                                        label="address.neighborhood"
                                        placeholder="Seu bairro"
                                        value={address.neighborhood || ""}
                                        type="text"
                                        onChange={handleInputChange}
                                    />
                                </InputWrapper>
                                <Row>
                                    <InputWrapper>
                                        <InputLabel>Rua</InputLabel>
                                        <InputComponent
                                            label="address.street"
                                            placeholder="Nome da rua"
                                            value={address.street || ""}
                                            type="text"
                                            onChange={handleInputChange}
                                        />
                                    </InputWrapper>
                                    <InputWrapper>
                                        <InputLabel>Número</InputLabel>
                                        <InputComponent
                                            label="address.number"
                                            placeholder="000"
                                            value={address.number || ""}
                                            type="text"
                                            onChange={handleInputChange}
                                        />
                                    </InputWrapper>
                                </Row>
                                <InputWrapper>
                                    <InputLabel>Complemento</InputLabel>
                                    <InputComponent
                                        label="address.complement"
                                        placeholder="Apartamento, bloco, etc. (opcional)"
                                        value={address.complement || ""}
                                        type="text"
                                        onChange={handleInputChange}
                                    />
                                </InputWrapper>
                            </FormSection>

                            <FormSection>
                                <SectionTitle>Alterar Senha (opcional)</SectionTitle>
                                <InputWrapper>
                                    <InputLabel>Senha Atual</InputLabel>
                                    <InputComponent
                                        label="password.current"
                                        placeholder="Digite sua senha atual"
                                        value={password.current}
                                        type="password"
                                        onChange={(_key, value) => handlePasswordChange("current", value)}
                                    />
                                </InputWrapper>
                                <InputWrapper>
                                    <InputLabel>Nova Senha</InputLabel>
                                    <InputComponent
                                        label="password.new"
                                        placeholder="Digite sua nova senha"
                                        value={password.new}
                                        type="password"
                                        onChange={(_key, value) => handlePasswordChange("new", value)}
                                    />
                                </InputWrapper>
                                <InputWrapper>
                                    <InputLabel>Confirmar Nova Senha</InputLabel>
                                    <InputComponent
                                        label="password.confirm"
                                        placeholder="Confirme sua nova senha"
                                        value={password.confirm}
                                        type="password"
                                        onChange={(_key, value) => handlePasswordChange("confirm", value)}
                                    />
                                </InputWrapper>
                            </FormSection>
                            {message && (
                                <MessageContainer $type={message.type}>
                                    {message.type === "success" ? <FaCheckCircle /> : <FaExclamationCircle />}
                                    <span>{message.text}</span>
                                </MessageContainer>
                            )}
                            <ButtonContainer>
                                <PrimaryButton
                                    text={loading ? "Salvando..." : "Salvar Alterações"}
                                    type="submit"
                                    filled={true}
                                    width="100%"
                                    height="50px"

                                />
                                <CancelButton
                                    type="button"
                                    onClick={() => navigate(`/profile/${account.id}`)}
                                    disabled={loading}
                                >
                                    Cancelar
                                </CancelButton>
                            </ButtonContainer>
                        </Form>
                    </FormContainer>
                </MainContent>
            </SectionContent>
        </ProfileEditionContainer>
    );
}

const ProfileEditionContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100dvh;
    width: 100%;
`;

const StickySidebar = styled.div`
    position: sticky;
    top: 0;
    align-self: flex-start;
    height: fit-content;
    max-height: calc(100dvh - 30px);
    overflow-y: auto;
    z-index: 10;
    flex-shrink: 0;
    
    &::-webkit-scrollbar {
        width: 4px;
    }
    
    &::-webkit-scrollbar-track {
        background: transparent;
    }
    
    &::-webkit-scrollbar-thumb {
        background: ${({ theme }) => theme.colors.primary || "#B648A0"};
        border-radius: 2px;
    }
    
    @media (max-width: 1024px) {
        position: static;
        width: 100%;
        max-height: none;
        z-index: 1;
    }
`;

const SectionContent = styled(Section)`
    display: flex;
    width: 100%;
    flex-direction: row;
    background-image: url(${backgroundPage});
    background-size: cover;
    background-repeat: repeat;
    padding: 1.25rem;
    gap: 1.25rem;
    box-sizing: border-box;
`;

const MainContent = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    overflow-y: auto;
`;

const FormContainer = styled.div`
    background: ${({ theme }) => theme.colors.quarternary || "#332630"};
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
    border: 2px solid ${({ theme }) => theme.colors.primary || "#B648A0"}40;

    @media (max-width: 768px) {
        padding: 1.5rem;
    }
`;

const HeaderContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
`;

const BackButton = styled.button`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: transparent;
    border: 2px solid ${({ theme }) => theme.colors.primary || "#B648A0"};
    color: ${({ theme }) => theme.colors.primary || "#B648A0"};
    padding: 0.5rem 1rem;
    border-radius: 10px;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.3s ease;

    &:hover {
        background: ${({ theme }) => theme.colors.primary || "#B648A0"};
        color: white;
    }
`;

const Title = styled.h1`
    font-size: 2rem;
    font-weight: bold;
    color: white;
    margin: 0;
`;

const MessageContainer = styled.div<{ $type: "success" | "error" }>`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    border-radius: 10px;
    margin-bottom: 1.5rem;
    background: ${({ $type }) =>
        $type === "success"
            ? "rgba(0, 200, 0, 0.2)"
            : "rgba(200, 0, 0, 0.2)"};
    border: 2px solid ${({ $type }) =>
        $type === "success" ? "#00C800" : "#C80000"};
    color: ${({ $type }) => $type === "success" ? "#00C800" : "#C80000"};

    svg {
        font-size: 1.25rem;
    }
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 2rem;
`;

const AvatarSection = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 1rem;
`;

const AvatarContainer = styled.div`
    position: relative;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    overflow: hidden;
    border: 5px solid ${({ theme }) => theme.colors.primary || "#B648A0"};
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        transform: scale(1.05);
        box-shadow: 0 0 20px ${({ theme }) => theme.colors.primary || "#B648A0"}80;
    }
`;

const AvatarImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    background-color: white;
    padding: 10px;
`;

const AvatarOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    opacity: 0;
    transition: opacity 0.3s ease;
    color: white;

    ${AvatarContainer}:hover & {
        opacity: 1;
    }

    svg {
        font-size: 2rem;
    }

    span {
        font-size: 0.875rem;
        font-weight: 500;
    }
`;

const HiddenInput = styled.input`
    display: none;
`;

const FormSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
    background: ${({ theme }) => theme.colors.tertiary || "#61475C"}40;
    border-radius: 15px;
    border: 1px solid ${({ theme }) => theme.colors.primary || "#B648A0"}30;
`;

const SectionTitle = styled.h2`
    font-size: 1.5rem;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.primary || "#B648A0"};
    margin: 0 0 1rem 0;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid ${({ theme }) => theme.colors.primary || "#B648A0"}40;
`;

const Row = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
`;

const CancelButton = styled.button`
    background: transparent;
    border: 2px solid ${({ theme }) => theme.colors.primary || "#B648A0"};
    color: ${({ theme }) => theme.colors.primary || "#B648A0"};
    padding: 0.75rem 1.5rem;
    border-radius: 10px;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 100%;

    &:hover:not(:disabled) {
        background: ${({ theme }) => theme.colors.primary || "#B648A0"};
        color: white;
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const LoadingContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100dvh;
    width: 100%;
`;

const LoadingText = styled.p`
    color: white;
    font-size: 1.5rem;
`;

const InputWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
`;

const InputLabel = styled.label`
    font-size: 1rem;
    font-weight: 600;
    color: white;
    margin-bottom: 0.25rem;
`;