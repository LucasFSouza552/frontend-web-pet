import styled from "styled-components";
import { FaSadTear } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function NoMorePetsCard() {
  const navigate = useNavigate();

  const goToCommunity = () => {
    navigate("/community");
  };

  return (
    <CardContainer>
      <CardDetails>
        <EmptyIconContainer>
          <FaSadTear size={80} color="#888" />
        </EmptyIconContainer>
        <Message>No momento não há mais pets disponíveis 😿</Message>
        <Button onClick={goToCommunity}>Ir para a Comunidade</Button>
      </CardDetails>
    </CardContainer>
  );
}

const CardContainer = styled.div`
  width: 460px;
  display: flex;
  justify-content: center;
  overflow: hidden;
  max-height: 80%;
  min-height: 80%;
  color: white;
`;

const CardDetails = styled.div`
  background-color: ${({ theme }) => theme.colors.quarternary || "#333"};
  width: 400px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const EmptyIconContainer = styled.div`
  margin-bottom: 20px;
`;

const Message = styled.p`
  font-size: 20px;
  color: #ccc;
  text-align: center;
  margin-bottom: 20px;
`;

const Button = styled.button`
  background-color: ${({ theme }) => theme.colors.primary || "#008CFF"};
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;
