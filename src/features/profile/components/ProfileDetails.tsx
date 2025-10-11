import styled from "styled-components";
import type { IAccount } from "../../../shared/models/account";

export default function ProfileDetails({ account }: { account: IAccount | null }) {
  if (!account) { return null; }
  return (
    <Container>
      <Title>
        {account.name}
      </Title>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: center;
  margin-left: 20px;
`;

const Title = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  width: 100%;
  `;