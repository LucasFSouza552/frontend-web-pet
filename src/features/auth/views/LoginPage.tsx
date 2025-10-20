import AuthForm from "../components/AuthForm";
import { HeaderComponent } from "../../../shared/components/HeaderComponent";

export default function LoginSection() {
    return (
        <>
            <HeaderComponent />
            <main>
                <AuthForm />
            </main>
        </>
    );
}