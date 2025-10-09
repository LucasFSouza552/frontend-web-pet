import styled from "styled-components";
import type { IAccount } from "../../../shared/models/account";

import { FaTag } from "react-icons/fa6";
import { BsTelephoneFill } from "react-icons/bs";


export default function ProfileDetails({ account }: { account: IAccount | null }) {
    if (!account) { return null; }
    return (
        <Container>
            <Title>
                <FaTag /> {account.name}
            </Title>
            <DetailContainer>
                <BsTelephoneFill /> {account.phone_number}
            </DetailContainer>
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
  background-color: red;
  `;

const DetailContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: red;
  margin-bottom: 5px;
`;  