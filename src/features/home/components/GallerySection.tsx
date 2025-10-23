import styled from "styled-components";

const pets = [
  { name: "Rex", img: "/dog1.png" },
  { name: "Luna", img: "/dog2.png" },
  { name: "Bolt", img: "/dog3.png" },
  { name: "Mimi", img: "/dog4.png" }, 
];

export default function GallerySection() {
  return (
    <Section>
      <Title>Amigos esperando por um lar ❤️</Title>
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

const Section = styled.section`
  padding: 80px 40px;
  background-color: #f7f7f7;
  text-align: center;
`;

const Title = styled.h2`
  color: #b84ba0;
  margin-bottom: 40px;
`;

const Grid = styled.div`
  display: flex;
  justify-content: center;
  gap: 25px;
  flex-wrap: wrap;
`;

const Card = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  width: 220px;
  height: 220px;
  cursor: pointer;
  transition: transform 0.3s ease;
  background-color: #eee;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: scale 0.3s;
  }

  span {
    position: absolute;
    bottom: 10px;
    left: 0;
    right: 0;
    text-align: center;
    color: #fff;
    font-weight: bold;
    text-shadow: 0 0 6px rgba(0,0,0,0.7);
  }

  &:hover {
    transform: scale(1.05);
    img {
      filter: brightness(0.8);
    }
  }
`;
