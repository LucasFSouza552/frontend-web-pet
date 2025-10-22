import { InputComponent } from "../../../shared/components/InputComponent";

export default function Step2({ type, gender, handleChange }: { type: string, gender: string, handleChange: (key: string, value: string) => void }) {
    return (
        <>
            <InputComponent
                label="Gato"
                type="checkbox"
                placeholder="Que tipo de animal?"
                value={type}
                onChange={handleChange} />
            <InputComponent
                label="Cão"
                type="checkbox"
                placeholder="Que tipo de animal?"
                value={type}
                onChange={handleChange} />
            <InputComponent
                label="Pássaro"
                type="checkbox"
                placeholder="Que tipo de animal?"
                value={type}
                onChange={handleChange} />
            <InputComponent
                label="Outro"
                type="checkbox"
                placeholder="Que tipo de animal?"
                value={type}
                onChange={handleChange} />
            <InputComponent
                label="M"
                type="checkbox"
                placeholder="Marque o gênero do animal"
                value={gender}
                onChange={handleChange} />
            <InputComponent
                label="F"
                type="checkbox"
                placeholder="Marque o gênero do animal"
                value={gender}
                onChange={handleChange} />
        </>
    );
}