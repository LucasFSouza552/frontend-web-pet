import { ErrorCard, ErrorMessage } from './styles.tsx';
import { ImWarning } from 'react-icons/im';

export default function ErrorContainer({ message }: { message: string }) {
    if (!message) return null;
    return (
        <ErrorCard>
            <ImWarning color='red' />
            <ErrorMessage>{message}</ErrorMessage>
        </ErrorCard>
    );
}
