import styled from "styled-components";

interface InputProps {
    label: string;
    placeholder: string;
    value: string;
    type: string;
    onChange: (key: string, value: string) => void;
}

export const InputComponent = ({ label, placeholder, value, onChange, type }: InputProps) => {
    return (
        <Input>
            {type === "textarea" ? (
                <textarea
                    id={label}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(label, e.target.value)} />
            ) : (
                <input
                    id={label}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(label, e.target.value)} />
            )}
        </Input>
    );
}


const Input = styled.div`
    margin-bottom: 5px;
    width: 100%;
    
    input, textarea { 
        padding: 12px 15px;
        border-radius: 8px;
        border: 2px solid ${({ theme }) => theme.colors.primary || "#B648A0"};
        outline: none;
        width: 100%;
        background-color: ${({ theme }) => theme.colors.quarternary || "#332630"};
        color: white;
        font-size: 0.95rem;
        transition: all 0.3s ease;

        &::placeholder {
            color: rgba(255, 255, 255, 0.5);
        }

        &:focus {
            border-color: ${({ theme }) => theme.colors.primary || "#B648A0"};
            box-shadow: 0 0 0 3px rgba(182, 72, 160, 0.2);
        }
    }

    textarea {
        min-height: 120px;
        resize: vertical;
        font-family: inherit;
    }
`;
