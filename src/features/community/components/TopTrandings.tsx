import { styled } from "styled-components"

import { FaPaw } from 'react-icons/fa';

export default function TopTrandings() {
    return (<RightSideContainer>
        <div className="active-communities">
            <h3>Comunidades ativas</h3>
            <ul>
                <li>
                    <div className="community-icon">
                        <FaPaw />
                    </div>
                    <span>Amicao</span>
                </li>
                <li>
                    <div className="community-icon">
                        <FaPaw />
                    </div>
                    <span>Amicao</span>
                </li>
                <li>
                    <div className="community-icon">
                        <FaPaw />
                    </div>
                    <span>Amicao</span>
                </li>
            </ul>
        </div>
    </RightSideContainer>)
}


const RightSideContainer = styled.aside`
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 30px;
    flex: 1;
    height: max-content;
    color: white;
    border: solid 1px white;
    position: sticky;
    background-color: #363135;
    top: 0;

     @media (max-width: 900px) {
        display: none;
    }
`
