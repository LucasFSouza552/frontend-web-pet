import React from 'react';
import { FaChevronDown, FaPaw, FaHeart, FaComment, FaShare, FaSearch } from 'react-icons/fa';

interface PostCardProps {
  userName: string;
  tag: string;
  caption: string;
}

const PostCard: React.FC<PostCardProps> = ({ userName, tag, caption }) => {
  return (

    <article className="post-card">
      <header className="post-header">
        {}
        <div className="avatar"></div> {}
        <div className="user-info">
          <span className="user-name">{userName}</span>
          <span className="post-tag">{tag}</span>
        </div>
      </header>
      <div className="post-body">
        <p className="post-caption">{caption}</p>
        {}
        <div className="post-image"></div> {}
      </div>
      <footer className="post-footer">
        <button className="action-button">
          <FaHeart />
          Curtir
        </button>
        <button className="action-button">
          <FaComment />
          Comentar
        </button>
        <button className="action-button">
          <FaShare />
          Compartilhar
        </button>
      </footer>
    </article>
  );
};

const LeftSidebar: React.FC = () => {
  return (
    <aside className="sidebar-left">
      <div className="logo">
        <a href="#">Página Inicial</a>
      </div>
      <nav className="menu">
        <div className="menu-section">
          <h2 className="menu-title">ASSUNTOS</h2>
          <ul>
            <li className="menu-item has-submenu">
              <a href="#">
                Adoção e resgate
                <FaChevronDown />
              </a>
              <ul className="submenu">
                <li><a href="#">Cuidados veterinários básicos</a></li>
                <li><a href="#">Vacinação e vermifugação</a></li>
                <li><a href="#">Alimentação saudável</a></li>
                <li><a href="#">Prevenção de doenças comuns</a></li>
              </ul>
            </li>
            <li className="menu-item">
              <a href="#">
                Saúde e bem-estar
                <FaChevronDown />
              </a>
            </li>
            <li className="menu-item">
              <a href="#">
                Adestramento
                <FaChevronDown />
              </a>
            </li>
            <li className="menu-item">
              <a href="#">
                Cuidados diários
                <FaChevronDown />
              </a>
            </li>
            <li className="menu-item">
              <a href="#">
                Produtos e serviços
                <FaChevronDown />
              </a>
            </li>
          </ul>
        </div>
        <div className="menu-section">
          <h2 className="menu-title">INFORMAÇÕES</h2>
          <ul>
            <li className="menu-item">
              <a href="#">
                Regras
                <FaChevronDown />
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
};

const RightSidebar: React.FC = () => {
  return (
    <aside className="sidebar-right">
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
    </aside>
  );
};

const CommunityPage: React.FC = () => {
  return (
    <>
      <GlobalStyles />
      <div className="page-container">
        <LeftSidebar />
        <main className="main-content">
          <div className="search-bar-container">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Buscar na comunidade" />
          </div>
          <div className="feed">
            <PostCard
              userName="Elisa Delfino"
              tag="#Primeira vez aqui"
              caption="Esse é Thor meu novo amigo"
            />
          </div>
        </main>
        <RightSidebar />
      </div>
    </>
  );
};

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        background-color: #332630;
        color: #e0e0e0;
        font-family: 'Inter', sans-serif;
    }

    .page-container {
        display: flex;
        max-width: 1400px;
        margin: 0 auto;
        padding: 20px;
        gap: 20px;
    }

    .sidebar-left {
        flex: 0 0 260px;
        background-color: #363135;
        border-radius: 10px;
        padding: 20px;
        height: fit-content;
    }

    .logo a {
        font-size: 1.2rem;
        font-weight: bold;
        color: #e0e0e0;
        text-decoration: none;
        display: block;
        margin-bottom: 30px;
    }

    .menu-section {
        margin-bottom: 20px;
    }

    .menu-title {
        font-size: 0.8rem;
        color: #a0a0a0;
        text-transform: uppercase;
        margin-bottom: 15px;
        font-weight: 500;
    }

    .menu ul {
        list-style: none;
    }

    .menu-item a {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0;
        color: #e0e0e0;
        text-decoration: none;
        font-size: 0.9rem;
    }

    .menu-item a svg {
        font-size: 0.7rem;
        transition: transform 0.2s ease-in-out;
    }

    .submenu {
        list-style: none;
        padding-left: 15px;
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease-out;
    }

    .menu-item:hover .submenu {
        max-height: 200px;
    }

    .menu-item:hover a svg {
        transform: rotate(180deg);
    }

    .submenu li a {
        color: #b0b0b0;
        font-size: 0.85rem;
    }

    .main-content {
        flex: 1;
        max-width: 600px;
    }

    .search-bar-container {
        position: relative;
        margin-bottom: 20px;
    }

    .search-bar-container .search-icon {
        position: absolute;
        top: 50%;
        left: 20px;
        transform: translateY(-50%);
        color: #a0a0a0;
    }

    .search-bar-container input {
        width: 100%;
        padding: 15px 15px 15px 50px;
        border-radius: 8px;
        border: none;
        background-color: #363135;
        color: #e0e0e0;
        font-size: 1rem;
    }

    .search-bar-container input::placeholder {
        color: #a0a0a0;
    }

    .post-card {
        background-color: #61475C;
        border-radius: 10px;
        margin-bottom: 20px;
        overflow: hidden;
    }

    .post-header {
        display: flex;
        align-items: center;
        padding: 15px;
    }

    .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 15px;
        /* Estilo para placeholder de avatar, se desejar */
        background-color: #999;
    }

    .user-info .user-name {
        display: block;
        font-weight: bold;
        color: #fff;
    }

    .user-info .post-tag {
        font-size: 0.8rem;
        color: #e0e0e0;
    }

    .post-body {
        padding: 0 15px 15px;
    }

    .post-caption {
        margin-bottom: 15px;
        color: #e0e0e0;
    }

    .post-image {
        width: 100%;
        border-radius: 8px;
        display: block;
        /* Estilo para placeholder de imagem do post, se desejar */
        background-color: #777;
        min-height: 200px; /* Garante que o espaço seja visível */
    }

    .post-footer {
        display: flex;
        justify-content: space-around;
        padding: 10px 15px;
        border-top: 1px solid #363135;
    }

    .action-button {
        background: none;
        border: none;
        color: #e0e0e0;
        cursor: pointer;
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 5px;
    }

    .action-button:hover {
        color: #fff;
    }

    .sidebar-right {
        flex: 0 0 260px;
    }

    .active-communities {
        background-color: #363135;
        border-radius: 10px;
        padding: 20px;
    }

    .active-communities h3 {
        font-size: 1rem;
        margin-bottom: 15px;
    }

    .active-communities ul {
        list-style: none;
    }

    .active-communities li {
        display: flex;
        align-items: center;
        gap: 15px;
        background-color: #61475C;
        padding: 10px;
        border-radius: 8px;
        margin-bottom: 10px;
    }

    .community-icon {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #332630;
    }
  `}</style>
);

export default CommunityPage;