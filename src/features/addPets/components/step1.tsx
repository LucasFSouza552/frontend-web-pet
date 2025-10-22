import { InputComponent } from "../../../shared/components/InputComponent";

export default function Step1({ name, age, handleChange }: { name: string, age: number, handleChange: (key: string, value: string) => void }) {
    return (
        <>
            <InputComponent
                label="name"
                type="text"
                placeholder="Insira o nome do animal"
                value={name}
                onChange={handleChange} />
            <InputComponent
                label="age"
                type="number"
                placeholder="Insira a idade"
                value={age?.toString() ?? ''}
                onChange={handleChange} />
        </>

    );
}