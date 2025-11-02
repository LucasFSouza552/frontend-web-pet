import styled from "styled-components";
import { FaTimes } from "react-icons/fa";
import { useState } from "react";

interface DonationModalProps {
    visible: boolean;
    onClose: () => void;
    onDonate: (petId: string, amount: number) => Promise<void>;
    petId: string
}

export default function DonationModal({ visible, onClose, onDonate, petId }: DonationModalProps) {
    const [amount, setAmount] = useState<number | "">("");

    if (!visible) return null;

    const handleDonate = () => {
        if (amount && amount > 0) {
            onDonate(petId, Number(amount));
            setAmount("");
            onClose();

        } else {
            alert("Insira um valor válido!");
        }
    };

    return (
        <Overlay>
            <ModalContainer>
                <CloseButton onClick={onClose}>
                    <FaTimes size={20} />
                </CloseButton>
                <h2>Faça sua Doação</h2>
                <p>Digite a quantia que deseja doar:</p>
                <Input
                    type="number"
                    min={1}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="R$ 0,00"
                    required
                />
                <DonateButton onClick={handleDonate}>Doar</DonateButton>
            </ModalContainer>
        </Overlay>
    );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContainer = styled.div`
  background-color: #1f1b1e;
  padding: 30px;
  border-radius: 12px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 0 20px rgba(182, 72, 160, 0.5);
  color: white;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
`;

const Input = styled.input`
  padding: 12px;
  border-radius: 8px;
  border: none;
  background-color: #2c272b;
  color: white;
  font-size: 16px;
  width: 100%;
  overflow: hidden;
`;

const DonateButton = styled.button`
  padding: 12px;
  border-radius: 8px;
  border: none;
  background-color: #b648a0;
  color: white;
  font-weight: bold;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s;

  &:hover {
    background-color: #d060c2;
  }
`;
