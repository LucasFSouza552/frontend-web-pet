import { useState } from "react";

export default function useRegisterController() {
    const [credentials, setCredentials] = useState({
        name: "",
        age: 0,
        type: "",
        gender: "",
        weight: "",
        images: "",
        description: ""
    })

    const handleChange = (key: string, value: string) => {
        setCredentials(prev => ({ ...prev, [key]: value }));
        console.log(credentials);
    };

    return {
        credentials,
        handleChange
    }
}