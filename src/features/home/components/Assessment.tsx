import styled from "styled-components";
import { FaStar, FaRegStar } from "react-icons/fa";

export default function FamousStoriesSection() {
  return (
    <Section>
      <Titulo>Histórias famosas</Titulo>

      <ContainerCards>
        {}
        <Card>
          <Cabecalho>
            <Avatar />
            <div>
              <Nome>Lucas</Nome>
              <Adotou>Adotou Rex</Adotou>
            </div>
          </Cabecalho>

          <Estrelas>
            <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
          </Estrelas>

          <Texto>
            A adoção me ensinou sobre responsabilidade, paciência e, acima de tudo, amor incondicional.
          </Texto>
        </Card>

        {}
        <Card>
          <Cabecalho>
            <Avatar />
            <div>
              <Nome>Pedro Caçador</Nome>
              <Adotou>Adotou Thor</Adotou>
            </div>
          </Cabecalho>

          <Estrelas>
            <FaStar /><FaStar /><FaStar /><FaRegStar /><FaRegStar />
          </Estrelas>

          <Texto>
            A adaptação foi rápida e agora temos um novo membro da família que todos amam.
          </Texto>
        </Card>

        {}
        <Card>
          <Cabecalho>
            <Avatar />
            <div>
              <Nome>Thiago</Nome>
              <Adotou>Adotou Pipoca</Adotou>
            </div>
          </Cabecalho>

          <Estrelas>
            <FaStar /><FaStar /><FaStar /><FaStar /><FaRegStar />
          </Estrelas>

          <Texto>
            O amor que recebo todos os dias é muito maior do que eu poderia oferecer, ele realmente mudou minha vida.
          </Texto>
        </Card>

        {}
        <Card>
          <Cabecalho>
            <Avatar />
            <div>
              <Nome>Gabriel</Nome>
              <Adotou>Adotou Mel</Adotou>
            </div>
          </Cabecalho>

          <Estrelas>
            <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
          </Estrelas>

          <Texto>
            Adotar meu cachorro foi a melhor decisão da minha vida, ele trouxe alegria e amor para minha casa.
          </Texto>
        </Card>
      </ContainerCards>
    </Section>
  );
}

const Section = styled.section`
  width: 100%;
  background-color: white;
  text-align: center;
  padding: 100px 40px; 
`;

const Titulo = styled.h2`
  color: #b84ba0;
  font-size: 32px;
  margin-bottom: 60px; 
`;

const ContainerCards = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 40px; 
`;

const Card = styled.div`
  background-color: #3b343a;
  color: white;
  width: 280px;
  min-height: 230px;
  border-radius: 20px;
  padding: 35px;
  text-align: left;
  border-top: 4px solid #b84ba0;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
`;

const Cabecalho = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
`;

const Avatar = styled.div`
  width: 50px;
  height: 50px;
  background-color: white;
  border-radius: 50%;
`;

const Nome = styled.h3`
  font-size: 18px;
  margin: 0;
`;

const Adotou = styled.p`
  font-size: 14px;
  color: #ccc;
  margin: 0;
`;

const Estrelas = styled.div`
  display: flex;
  color: #f7c944;
  margin: 15px 0 20px 0;
  font-size: 18px;
`;

const Texto = styled.p`
  font-size: 15px;
  color: #eaeaea;
  line-height: 1.5; 
`;
