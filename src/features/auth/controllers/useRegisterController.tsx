import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface IRegisterData {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    password: string; 
}

const INITIAL_DATA: IRegisterData = {
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    password: '',
};

export const useRegisterController = () => {
    const [data, setData] = useState(INITIAL_DATA);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData(prevData => ({ ...prevData, [name]: value }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        console.log("Enviando dados para registro:", data);

        alert("Conta criada com sucesso!");
        navigate('/login');
    };

    return {
        data,
        handleChange,
        handleSubmit,
    };
};