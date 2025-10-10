import { styled } from "styled-components";

export default function FAQList() {
    return (
        <UnorderedList>
            <li>
                <h3>1. Como funciona o processo de adoção?</h3>
                <p>
                    Basta criar uma conta, escolher o animal que deseja adotar e
                    preencher o formulário de interesse. Nossa equipe entrará em
                    contato para validar as informações e agendar uma visita.
                </p>
            </li>
            <li>
                <h3>2. Há algum custo para adotar?</h3>
                <p>
                    Não! A adoção é gratuita. Porém, pedimos uma pequena contribuição opcional
                    para ajudar a manter o projeto e cuidar de outros animais.
                </p>
            </li>
            <li>
                <h3>3. Como posso ajudar sem adotar?</h3>
                <p>
                    Você pode contribuir com doações de ração, medicamentos,
                    itens de limpeza ou apoio financeiro. Toda ajuda faz diferença
                </p>
            </li>
            <li>
                <h3>4. Posso visitar os animais antes da adoção?</h3>
                <p>
                    Sim! Agende uma visita presencial para conhecer os animais
                    disponíveis e conversar com nossa equipe de voluntários.
                </p>
            </li>
            <li>
                <h3>5. Como entro em contato com o suporte?</h3>
                <p>
                    Você pode enviar uma mensagem pelo formulário abaixo
                    ou entrar em contato via e-mail e WhatsApp. Nossa equipe responde em até 24h úteis.
                </p>
            </li>
        </UnorderedList>
    );
}

const UnorderedList = styled.ul`
    display: flex;
    flex-direction: column;
    background-color: #61475C;
    color: white;
    padding: 50px;
    justify-content: space-between;
`;