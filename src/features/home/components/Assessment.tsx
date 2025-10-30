import styled, { keyframes, css } from "styled-components";
import { useEffect, useRef, useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";

export default function FamousStoriesSection() {
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const [visibleCards, setVisibleCards] = useState<number[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-index"));
          if (entry.isIntersecting) {
            setVisibleCards((prev) =>
              prev.includes(index) ? prev : [...prev, index]
            );
          }
        });
      },
      { threshold: 0.3 }
    );

    cardsRef.current.forEach((el) => el && observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const cards = [
    {
      nome: "Lucas",
      adotou: "Adotou Rex",
      estrelas: 5,
      texto: "A adoção me ensinou sobre responsabilidade, paciência e, acima de tudo, amor incondicional."
    },
    {
      nome: "Pedro Caçador",
      adotou: "Adotou Thor",
      estrelas: 3,
      texto: "A adaptação foi rápida e agora temos um novo membro da família que todos amam."
    },
    {
      nome: "Thiago",
      adotou: "Adotou Pipoca",
      estrelas: 4,
      texto: "O amor que recebo todos os dias é muito maior do que eu poderia oferecer, ele realmente mudou minha vida."
    },
    {
      nome: "Gabriel",
      adotou: "Adotou Mel",
      estrelas: 5,
      texto: "Adotar meu cachorro foi a melhor decisão da minha vida, ele trouxe alegria e amor para minha casa."
    }
  ];

  return (
    <Section>
      <Titulo>Histórias famosas</Titulo>
      <ContainerCards>
        {cards.map((c, i) => (
          <Card
            key={i}
            ref={(el) => {
              if (el) cardsRef.current[i] = el;
            }}
            data-index={i}
            $visible={visibleCards.includes(i)}
          >
            <Cabecalho>
              <Avatar />
              <div>
                <Nome>{c.nome}</Nome>
                <Adotou>{c.adotou}</Adotou>
              </div>
            </Cabecalho>

            <Estrelas>
              {Array.from({ length: 5 }).map((_, idx) =>
                idx < c.estrelas ? <FaStar key={idx} /> : <FaRegStar key={idx} />
              )}
            </Estrelas>

            <Texto>{c.texto}</Texto>
          </Card>
        ))}
      </ContainerCards>
    </Section>
  );
}

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(60px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Section = styled.section`
  width: 100%;
  background-color: white;
  text-align: center;
  padding: 100px 40px;
`;

const Titulo = styled.h2`
  color: #B648A0;
  font-size: 34px;
  margin-bottom: 60px;
`;

const ContainerCards = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 40px;
`;

const Card = styled.div<{ $visible: boolean }>`
  background-color: #3B343A;
  color: white;
  width: 280px;
  min-height: 230px;
  border-radius: 20px;
  padding: 35px;
  text-align: left;
  border-top: 4px solid #B648A0;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  opacity: 0;
  transform: translateY(60px);
  transition: opacity 0.6s ease, transform 0.6s ease;
  ${({ $visible }) =>
    $visible &&
    css`
      opacity: 1;
      transform: translateY(0);
      animation: ${fadeUp} 0.8s ease;
    `}

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  }
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
