import styled from "styled-components";

export const ContainerButton = styled.button`
  margin-top: 1rem;
  padding: 12px 24px;
  background: #0636D4; /* azul escuro conforme solicitado */
  color: white;
  font-style: italic;
  font-weight: 700;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: 0.3s;
  text-decoration: none;
  display: inline-block;
  text-transform: uppercase;

  &:hover {
    background: #0528a8;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: #e0e0e0;
  }
`;
