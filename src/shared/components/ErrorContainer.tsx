import styled from "styled-components";
import { ImWarning } from 'react-icons/im';
import { useToast } from "@contexts/ToastContext";
import { useEffect } from "react";

export default function ErrorContainer({ message }: { message: string }) {
  const { showError } = useToast();

  useEffect(() => {
    if (message) {
      showError(message);
    }
  }, [message, showError]);

  return null;
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
