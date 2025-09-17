import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  padding: 20px;
  
`;

export const CarouselWrapper = styled.div`
  margin-bottom: 30px;

  .react-multi-carousel-dot--active button {
    background: #0636D4 !important;
    border-color: #0636D4 !important;
  }
`;

export const CarouselItem = styled.div`
  display: flex;
  justify-content: center; /* centraliza horizontalmente */
  align-items: center;     /* centraliza verticalmente (se tiver altura fixa) */
  padding: 20px;           /* opcional, cria um "respiro" ao redor */

  img {
    max-width: 80%;  /* controla o tamanho (diminui a largura) */
    height: auto;
    border-radius: 18px;
    object-fit: cover;
  }
`;
