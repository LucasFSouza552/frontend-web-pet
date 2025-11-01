import { InputComponent } from "../../../shared/components/InputComponent";

export default function Step3({ weight, description, handleChange }: { weight: string, description: string, handleChange: (key: string, value: string) => void }) {
    return (
        <>
            <InputComponent 
                label="Peso"
                type="number"
                placeholder="Digite o peso do animal"
                value={weight}
                onChange={handleChange}/>
            <InputComponent 
                label="Descrição"
                type="textarea"
                placeholder="Descreva mais sobre o animal!"
                value={description}
                onChange={handleChange}/>
        </>
    );
}