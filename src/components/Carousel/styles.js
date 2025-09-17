import styled from "styled-components"

export const CarrosselContainer = styled.div`
  display: grid;
  grid-auto-flow: column;
  scroll-snap-type: x mandatory;
  overflow-x: auto;
  scroll-behavior: smooth;
  width: 300px;
  height: 200px;
  border-radius: 12px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`

export const CarrosselImage = styled.img`
  width: 300px;
  height: 200px;
  object-fit: cover;
  scroll-snap-align: start;
`