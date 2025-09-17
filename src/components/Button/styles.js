import styled from "styled-components";

export const ContainerButton = styled.a`
  margin-top: 1rem;
  padding: 12px 24px;
  background: #d4ff00; /* verde neon do layout */
  color: #000;
  font-style: italic;
  font-weight: 700;
  border-radius: 8px;
  text-decoration: none;
  transition: 0.3s;

  &:hover {
    background: #b0e600;
  }
`;
