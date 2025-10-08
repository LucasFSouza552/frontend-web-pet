import React from "react";
import styled from "styled-components";


export default function CommunityPage() {
    return (
        <PageContainer>
            <SidebarLeft>
                <SidebarTitle>Assuntos</SidebarTitle>
                <MenuItem>Adoção e resgate</MenuItem>
                <SubMenuItem>Cuidados veterinários básicos</SubMenuItem>
                <SubMenuItem>Vacinação e vermifugação</SubMenuItem>
                <SubMenuItem>Alimentação saudável</SubMenuItem>
                <SubMenuItem>Prevenção de doenças comuns</SubMenuItem>

                <MenuItem>Saúde e bem-estar</MenuItem>
                <MenuItem>Adestramento</MenuItem>
                <MenuItem>Cuidados diários</MenuItem>
                <MenuItem>Produtos e serviços</MenuItem>

                <SidebarTitle>Informações</SidebarTitle>
                <MenuItem>Regras</MenuItem>
            </SidebarLeft>

            <Content>
                <SearchBar placeholder="Buscar na comunidade" />
                {/* Aqui você pode adicionar outros conteúdos se necessário */}
            </Content>

            <SidebarRight>
                <SidebarTitle>Comunidades ativas</SidebarTitle>
                <CommunityItem>Amicao</CommunityItem>
                <CommunityItem>Amicao</CommunityItem>
                <CommunityItem>Amicao</CommunityItem>
            </SidebarRight>
        </PageContainer>
    );
}


const PageContainer = styled.div`
  display: flex;
  background-color: #2b2b2b;
  min-height: 100vh;
  color: #fff;
`;

const SidebarLeft = styled.div`
  width: 250px;
  background-color: #333;
  padding: 20px;
`;

const SidebarTitle = styled.h3`
  margin-bottom: 10px;
  font-size: 16px;
  text-transform: uppercase;
  color: #fff;
`;

const MenuItem = styled.div`
  margin-bottom: 10px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    color: #e29fff;
  }
`;

const SubMenuItem = styled.div`
  margin-left: 15px;
  font-size: 13px;
  color: #ccc;
  cursor: pointer;

  &:hover {
    color: #e29fff;
  }
`;


const Content = styled.div`
  flex: 1;
  padding: 20px;
`;

const SearchBar = styled.input`
  width: 100%;
  padding: 10px 15px;
  border-radius: 8px;
  border: none;
  outline: none;
  margin-bottom: 20px;
  background-color: #3a3a3a;
  color: #fff;
`;


const SidebarRight = styled.div`
  width: 200px;
  background-color: #333;
  padding: 20px;
  margin-left: 10px;
`;

const CommunityItem = styled.div`
  padding: 10px;
  margin-bottom: 10px;
  background-color: #444;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #5e2a77;
  }
`;