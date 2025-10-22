import { InputComponent } from "../../../shared/components/InputComponent";
import useRegisterController from "../controllers/useRegisterController";

export default function Step1() {
    const { credentials, handleChange } = useRegisterController();

    return (
        <>
            <InputComponent
                label="Nome"
                type="text"
                placeholder="Insira o nome do animal"
                value={credentials.name}
                onChange={handleChange} />
            <InputComponent
                label="Idade"
                type="number"
                placeholder="Insira a idade"
                value={credentials.age?.toString() ?? ''}
                onChange={handleChange} />
        </>

    );
}