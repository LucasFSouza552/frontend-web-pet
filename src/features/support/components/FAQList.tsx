import { styled } from "styled-components";
import Section from "../../../shared/styles/SectionStyle";

export default function FAQList() {
    return (
        <Section height="auto">
            <UnorderedList>
                <ListItem>
                    <ListItemTitle>1. Como funciona o processo de adoção?</ListItemTitle>
                    <Paragraph>
                        Basta criar uma conta, escolher o animal que deseja adotar e
                        preencher o formulário de interesse. Nossa equipe entrará em
                        contato para validar as informações e agendar uma visita.
                    </Paragraph>
                </ListItem>
                <ListItem>
                    <ListItemTitle>2. Há algum custo para adotar?</ListItemTitle>
                    <Paragraph>
                        Não! A adoção é gratuita. Porém, pedimos uma pequena contribuição opcional
                        para ajudar a manter o projeto e cuidar de outros animais.
                    </Paragraph>
                </ListItem>
                <ListItem>
                    <ListItemTitle>3. Como posso ajudar sem adotar?</ListItemTitle>
                    <Paragraph>
                        Você pode contribuir com doações de ração, medicamentos,
                        itens de limpeza ou apoio financeiro. Toda ajuda faz diferença
                    </Paragraph>
                </ListItem>
                <ListItem>
                    <ListItemTitle>4. Posso visitar os animais antes da adoção?</ListItemTitle>
                    <Paragraph>
                        Sim! Agende uma visita presencial para conhecer os animais
                        disponíveis e conversar com nossa equipe de voluntários.
                    </Paragraph>
                </ListItem>
                <ListItem>
                    <ListItemTitle>5. Como entro em contato com o suporte?</ListItemTitle>
                    <Paragraph>
                        Você pode enviar uma mensagem pelo formulário abaixo
                        ou entrar em contato via e-mail e WhatsApp. Nossa equipe responde em até 24h úteis.
                    </Paragraph>
                </ListItem>
            </UnorderedList>
        </Section>
    );
}

const UnorderedList = styled.ul`
    display: flex;
    flex-direction: column;
    background-color: #61475C;
    color: white;
    align-items: center;
    margin: 30px 205px;
    border-radius: 50px;
    padding: 10px;
    text-align: center;
`;

const Paragraph = styled.p`
    width: 700px;
    padding-top: 20px
`;

const ListItem = styled.li`
    padding: 20px;
`;

const ListItemTitle = styled.h3`
    background-color: #B648A0;
    border-radius: 5px;
    padding: 5px;
`;