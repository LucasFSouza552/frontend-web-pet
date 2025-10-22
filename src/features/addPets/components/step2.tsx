import { InputComponent } from "../../../shared/components/InputComponent";
import useRegisterController from "../controllers/useRegisterController";

export default function Step2() {
    const { credentials, handleChange } = useRegisterController();
    return (
        <>
            <InputComponent
                label="Gato"
                type="checkbox"
                placeholder="Que tipo de animal?"
                value={credentials.type}
                onChange={handleChange} />
            <InputComponent
                label="Cão"
                type="checkbox"
                placeholder="Que tipo de animal?"
                value={credentials.type}
                onChange={handleChange} />
            <InputComponent
                label="Pássaro"
                type="checkbox"
                placeholder="Que tipo de animal?"
                value={credentials.type}
                onChange={handleChange} />
            <InputComponent
                label="Outro"
                type="checkbox"
                placeholder="Que tipo de animal?"
                value={credentials.type}
                onChange={handleChange} />
            <InputComponent
                label="M"
                type="checkbox"
                placeholder="Marque o gênero do animal"
                value={credentials.gender}
                onChange={handleChange} />
            <InputComponent
                label="F"
                type="checkbox"
                placeholder="Marque o gênero do animal"
                value={credentials.gender}
                onChange={handleChange} />
        </>
    );
}