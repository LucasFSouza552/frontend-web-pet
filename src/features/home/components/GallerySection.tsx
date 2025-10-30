import { FaHeart } from "react-icons/fa";
import styled, { keyframes } from "styled-components";

const pets = [
  { name: "Rex", img: "/dog1.png" },
  { name: "Luna", img: "/dog2.png" },
  { name: "Bolt", img: "/dog3.png" },
  { name: "Mimi", img: "/dog4.png" },
];

export default function GallerySection() {
  return (
    <Section>
      <Title>Amigos esperando por um lar <FaHeart color="#B648A0" /></Title>
      <Grid>
        {pets.map((p, i) => (
          <Card key={i}>
            <img src={p.img} alt={p.name} />
            <span>{p.name}</span>
          </Card>
        ))}
      </Grid>
    </Section>
  );
}

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Section = styled.section`
  padding: 100px 40px;
  background-color: #f7f7f7;
  text-align: center;
  animation: ${fadeIn} 1s ease forwards;
`;

const Title = styled.h2`
  color: #B648A0;
  margin-bottom: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 2rem;
`;

const Grid = styled.div`
  display: flex;
  justify-content: center;
  gap: 35px;
  flex-wrap: wrap;
  animation: ${fadeIn} 1.3s ease forwards;
`;

const floatUp = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
`;

const Card = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  width: 240px;
  height: 240px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background-color: #e9e9e9;
  animation: ${fadeIn} 1s ease forwards;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease, filter 0.4s ease;
  }

  span {
    position: absolute;
    bottom: 15px;
    left: 0;
    right: 0;
    text-align: center;
    color: #fff;
    font-weight: bold;
    font-size: 1.2rem;
    text-shadow: 0 0 8px rgba(0,0,0,0.8);
  }

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    animation: ${floatUp} 2s ease-in-out infinite;
    img {
      transform: scale(1.1);
      filter: brightness(0.8);
    }
  }
`;
