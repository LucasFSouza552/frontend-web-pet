import { InputComponent } from "../../../shared/components/InputComponent";
import useRegisterController from "../controllers/useRegisterController";

export default function Step3() {
    const { credentials, handleChange } = useRegisterController();

    <>
        <InputComponent 
            label="Peso"
            type="number"
            placeholder="Digite o peso do animal"
            value={credentials.weight}
            onChange={handleChange}/>
        <InputComponent 
            label="Descrição"
            type="textarea"
            placeholder="Descreva mais sobre o animal!"
            value={credentials.description}
            onChange={handleChange}/>
    </>
}