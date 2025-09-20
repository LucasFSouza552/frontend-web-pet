import styled from "styled-components";

interface InputProps {
    label: string;
    placeholder: string;
    value: string;
    type: string;
    onChange: (key: string, value: string) => void;
}

const InputComponent = ({ label, placeholder, value, onChange, type }: InputProps) => {
    return (
        <Input>
            <input
                id={label}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(type, e.target.value)} />
        </Input>
    );
}


export default InputComponent;


const Input = styled.div`
    margin-bottom: 5px;
    width: clamp(300px, 50%, 600px);
    
    input { 
        padding: 10px;
        border-radius: 10px;
        border: none;
        outline: none;
        width: 100%;
    }
`;
