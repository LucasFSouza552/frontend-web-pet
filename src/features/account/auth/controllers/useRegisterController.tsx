import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@api/authService';

export interface IRegisterData {
    firstName: string;
    phone: string;
    email: string;
    cpfCnpj: string;
    password: string;
    confirmPassword: string;
}

interface IRegisterPayload {
    name: string;
    email: string;
    phone_number: string;
    password: string;
    cpf?: string;
    cnpj?: string;
    role?: 'user' | 'admin' | 'institution';
    verified?: boolean;
}

const INITIAL_DATA: IRegisterData = {
    firstName: '',
    phone: '',
    email: '',
    cpfCnpj: '',
    password: '',
    confirmPassword: '',
};

export const useRegisterController = () => {
    const [data, setData] = useState<IRegisterData>(INITIAL_DATA);
    const [currentStep, setCurrentStep] = useState(1);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const formatPhone = (value: string): string => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 10) {
            if (numbers.length <= 2) return numbers;
            if (numbers.length <= 6) return numbers.replace(/(\d{2})(\d+)/, '($1) $2');
            return numbers.replace(/(\d{2})(\d{4})(\d+)/, '($1) $2-$3');
        } else {
            if (numbers.length <= 2) return numbers;
            if (numbers.length <= 7) return numbers.replace(/(\d{2})(\d+)/, '($1) $2');
            return numbers.replace(/(\d{2})(\d{5})(\d+)/, '($1) $2-$3');
        }
    };

    const formatCPFOrCNPJ = (value: string): string => {
        const numbers = value.replace(/\D/g, '');
        
        if (numbers.length <= 11) {
            if (numbers.length <= 3) return numbers;
            if (numbers.length <= 6) return numbers.replace(/(\d{3})(\d+)/, '$1.$2');
            if (numbers.length <= 9) return numbers.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
            return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d+)/, '$1.$2.$3-$4');
        }
        else if (numbers.length <= 14) {
            if (numbers.length <= 2) return numbers;
            if (numbers.length <= 5) return numbers.replace(/(\d{2})(\d+)/, '$1.$2');
            if (numbers.length <= 8) return numbers.replace(/(\d{2})(\d{3})(\d+)/, '$1.$2.$3');
            if (numbers.length <= 12) return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d+)/, '$1.$2.$3/$4');
            return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d+)/, '$1.$2.$3/$4-$5');
        }
        
        return value;
    };

    const detectType = (value: string): 'cpf' | 'cnpj' | null => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length === 11) return 'cpf';
        if (numbers.length === 14) return 'cnpj';
        return null;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === 'phone') {
            formattedValue = formatPhone(value);
        } else if (name === 'cpfCnpj') {
            formattedValue = formatCPFOrCNPJ(value);
        }

        setData(prevData => ({ ...prevData, [name]: formattedValue }));
        if (error) setError('');
    };

    const validateCPF = (cpf: string): boolean => {
        const cleanCPF = cpf.replace(/\D/g, '');
        if (cleanCPF.length !== 11) return false;
        
        if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
        
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
        }
        let digit = 11 - (sum % 11);
        if (digit >= 10) digit = 0;
        if (digit !== parseInt(cleanCPF.charAt(9))) return false;
        
        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
        }
        digit = 11 - (sum % 11);
        if (digit >= 10) digit = 0;
        if (digit !== parseInt(cleanCPF.charAt(10))) return false;
        
        return true;
    };

    const validateCNPJ = (cnpj: string): boolean => {
        const cleanCNPJ = cnpj.replace(/\D/g, '');
        if (cleanCNPJ.length !== 14) return false;
        
        if (/^(\d)\1{13}$/.test(cleanCNPJ)) return false;
        
        let length = cleanCNPJ.length - 2;
        let numbers = cleanCNPJ.substring(0, length);
        const digits = cleanCNPJ.substring(length);
        let sum = 0;
        let pos = length - 7;
        
        for (let i = length; i >= 1; i--) {
            sum += parseInt(numbers.charAt(length - i)) * pos--;
            if (pos < 2) pos = 9;
        }
        
        let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
        if (result !== parseInt(digits.charAt(0))) return false;
        
        length = length + 1;
        numbers = cleanCNPJ.substring(0, length);
        sum = 0;
        pos = length - 7;
        
        for (let i = length; i >= 1; i--) {
            sum += parseInt(numbers.charAt(length - i)) * pos--;
            if (pos < 2) pos = 9;
        }
        
        result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
        if (result !== parseInt(digits.charAt(1))) return false;
        
        return true;
    };

    const nextStep = () => {
        if (currentStep === 1) {
            if (!data.firstName || !data.cpfCnpj) {
                setError('Por favor, preencha todos os campos obrigatórios');
                return;
            }

            const type = detectType(data.cpfCnpj);
            const cleanValue = data.cpfCnpj.replace(/\D/g, '');
            
            if (cleanValue.length !== 11 && cleanValue.length !== 14) {
                setError('CPF deve ter 11 dígitos ou CNPJ deve ter 14 dígitos');
                return;
            }

            if (type === 'cpf' && !validateCPF(data.cpfCnpj)) {
                setError('CPF inválido');
                return;
            }

            if (type === 'cnpj' && !validateCNPJ(data.cpfCnpj)) {
                setError('CNPJ inválido');
                return;
            }

            if (!type) {
                setError('CPF deve ter 11 dígitos ou CNPJ deve ter 14 dígitos');
                return;
            }

            setCurrentStep(2);
        } else if (currentStep === 2) {
            if (!data.phone || !data.email) {
                setError('Por favor, preencha todos os campos obrigatórios');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                setError('Por favor, insira um e-mail válido');
                return;
            }

            const cleanPhone = data.phone.replace(/\D/g, '');
            if (cleanPhone.length < 10 || cleanPhone.length > 11) {
                setError('Telefone deve ter 10 ou 11 dígitos');
                return;
            }

            setCurrentStep(3);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            setError('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (data.password !== data.confirmPassword) {
            setError('As senhas não coincidem');
            return;
        }

        if (data.password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres');
            return;
        }

        if (!data.cpfCnpj) {
            setError('CPF ou CNPJ é obrigatório');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const type = detectType(data.cpfCnpj);
            const cleanValue = data.cpfCnpj.replace(/\D/g, '');
            
            const registerData: IRegisterPayload = {
                name: data.firstName,
                email: data.email,
                phone_number: data.phone.replace(/\D/g, ''),
                password: data.password,
                role: 'user',
                verified: false,
            };

            if (type === 'cpf') {
                registerData.cpf = cleanValue;
            } else if (type === 'cnpj') {
                registerData.cnpj = cleanValue;
            } else {
                setLoading(false);
                setError('CPF deve ter 11 dígitos ou CNPJ deve ter 14 dígitos');
                return;
            }

            await authService.register(registerData as any);
            
            setLoading(false);
            navigate('/login');
        } catch (error: unknown) {
            setLoading(false);
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Erro inesperado ao criar conta. Tente novamente.');
            }
        }
    };

    return {
        data,
        currentStep,
        error,
        loading,
        handleChange,
        nextStep,
        prevStep,
        handleSubmit,
    };
};