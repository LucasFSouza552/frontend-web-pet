import styled from "styled-components";
import type IPet from "../../../shared/models/Pet";

export default function MatchCard({ Pet }: { Pet: IPet }) {
    return (
        <CardContainer>
            <CardDetails>

                <PetPictureContainer>
                    <PetDescription>

                    </PetDescription>
                </PetPictureContainer>
            </CardDetails>
            <CardOptions>

            </CardOptions>
        </CardContainer>
    );
}

const CardDetails = styled.div`
    
`;

const CardOptions = styled.div`
    
`;

const CardContainer = styled.div`
    width: 300px;
    height: 100%;
    background-color: ${({ theme }) => theme.colors.tertiary};
`;

const PetPictureContainer = styled.div`
    

`;

const PetDescription = styled.div`

`;