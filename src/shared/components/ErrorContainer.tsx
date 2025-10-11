import styled from "styled-components";
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


export const ErrorCard = styled.div`
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  width: 320px;
  padding: 12px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: start;
  background: #fce8db;
  border-radius: 8px;
  border: 1px solid #ef665b;
  box-shadow: 0px 0px 5px -3px #111;
  gap: 5px;
  z-index: 99999;
`;

export const ErrorMessage = styled.span`
  font-weight: 500;
  font-size: 14px;
  color: #71192f;
`;
