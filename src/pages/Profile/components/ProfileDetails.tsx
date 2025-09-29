import type { IAccount } from "../../../models/account";

export default function ProfileDetails({ account }: { account: IAccount | null }) {
    return (
        <div>
            <p>{account?.email}</p>
            <p>{account?.phone_number}</p>
            <p>{account?.cpf ? account.cpf : account?.cnpj}</p>
        </div>
    );
}