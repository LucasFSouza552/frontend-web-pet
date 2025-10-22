import { InputComponent } from "../../../shared/components/InputComponent";
import useRegisterController from "../controllers/useRegisterController";

export default function Step4() {
    const { credentials, handleChange } = useRegisterController();
    return (
        <>
            <InputComponent
                label="Adicione a foto desta criaturinha!"
                placeholder="Adicione a foto deste"
                type="file"
                value={credentials.images}
                onChange={handleChange} />

        </>
    );
}