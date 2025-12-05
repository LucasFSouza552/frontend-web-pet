import { FaHeart } from "react-icons/fa";
import styled, { keyframes } from "styled-components";
import { useState, useEffect } from "react";
import { petService } from "@/features/pet/petService";
import { pictureService } from "@api/pictureService";
import type IPet from "@models/Pet";

export default function GallerySection() {
  const [pets, setPets] = useState<IPet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        const availablePets = await petService.availablePets();
        const sortedPets = availablePets
          .filter((pet: IPet) => !pet.adopted)
          .sort((a: IPet, b: IPet) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateA - dateB;
          })
          .slice(0, 4);
        setPets(sortedPets);
      } catch (error) {
        console.error("Erro ao buscar pets:", error);
        setPets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  if (loading) {
    return (
      <Section>
        <Title>Amigos esperando por um lar <FaHeart color="#B648A0" /></Title>
        <Grid>
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} $delay={i * 0.15} />
          ))}
        </Grid>
      </Section>
    );
  }

  if (pets.length === 0) {
    return null;
  }

  return (
    <Section>
      <Title>Amigos esperando por um lar <FaHeart color="#B648A0" /></Title>
      <Grid>
        {pets.map((pet, index) => {
          const firstImage = pictureService.fetchPicture(pet.images[0])

          return (
            <Card key={pet.id} $delay={index * 0.15} $index={index}>
              {firstImage && <img src={firstImage} alt={pet.name} />}
              <span>{pet.name}</span>
            </Card>
          );
        })}
      </Grid>
    </Section>
  );
}

const slideInFromRight = keyframes`
  from { 
    opacity: 0; 
    transform: translateX(100px) scale(0.8);
  }
  to { 
    opacity: 1; 
    transform: translateX(0) scale(1);
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Section = styled.section`
  padding: 100px 40px;
  background-color: #f7f7f7;
  text-align: center;
  animation: ${fadeIn} 1s ease-in-out;
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
  0%, 100% { 
    transform: translateX(-8px) translateY(0) scale(1.05); 
  }
  50% { 
    transform: translateX(-8px) translateY(-8px) scale(1.08); 
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const SkeletonCard = styled.div<{ $delay: number }>`
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  width: 240px;
  height: 240px;
  background: linear-gradient(
    90deg,
    #e9e9e9 0%,
    #f0f0f0 50%,
    #e9e9e9 100%
  );
  background-size: 2000px 100%;
  opacity: 0;
  animation: ${shimmer} 2s infinite linear, 
            ${slideInFromRight} 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  animation-delay: ${props => props.$delay}s, ${props => props.$delay}s;
`;

const Card = styled.div<{ $delay: number; $index: number }>`
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  width: 240px;
  height: 240px;
  cursor: pointer;
  background-color: #e9e9e9;
  opacity: 0;
  animation: ${slideInFromRight} 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  animation-delay: ${props => props.$delay}s;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), 
              box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), 
                filter 0.5s cubic-bezier(0.4, 0, 0.2, 1);
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
    transition: transform 0.3s ease, 
                text-shadow 0.3s ease,
                font-size 0.3s ease;
  }

  &:hover {
    transform: translateX(-8px) scale(1.05);
    box-shadow: 0 12px 30px rgba(182, 72, 160, 0.3);
    animation: ${floatUp} 2s ease-in-out infinite, 
               ${slideInFromRight} 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    animation-delay: 0s, ${props => props.$delay}s;
    
    img {
      transform: scale(1.1);
      filter: brightness(0.85);
    }

    span {
      transform: translateY(-5px);
      text-shadow: 0 0 12px rgba(0,0,0,1), 0 0 20px rgba(182, 72, 160, 0.5);
      font-size: 1.3rem;
    }
  }

  &:active {
    transform: translateX(-4px) scale(1.02);
  }
`;
