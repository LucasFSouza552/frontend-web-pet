import { InputComponent } from "../../../shared/components/InputComponent";

export default function Step4({ images, handleChange }: { images: string, handleChange: (key: string, value: string) => void }) {
    return (
        <>
            <InputComponent
                label="Adicione a foto desta criaturinha!"
                placeholder="Adicione a foto deste"
                type="file"
                value={images}
                onChange={handleChange} />

        </>
    );
}