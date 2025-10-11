import { useContext } from "react";
import { AuthContext } from "../../features/auth/authContext";

export function bufferToBase64(buffer: number[]): string {
    const binary = String.fromCharCode(...buffer);
    return window.btoa(binary);
}

export default function AccountMenu() {
    const { account } = useContext(AuthContext);
    if (!account || !account.avatar) {
        return null;
    }

    const base64String = bufferToBase64((account.avatar as any).data);
    const avatarUrl = `data:image/jpeg;base64,${base64String}`;
    return (
        <div>
            <img src={avatarUrl} className="avatar" alt="" />
        </div>
    )
}