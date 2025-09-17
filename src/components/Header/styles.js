import styled from "styled-components"

export const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`

export const Logo = styled.img`
  width: 200px;
  height: 40px;
`

export const NavButtons = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`

export const ScheduleButton = styled.button`
  background: transparent;
  border: none;
  color: #333;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 8px 12px;
  
  &:hover {
    color: #666;
  }
`

export const LoginButton = styled.button`
  background: #C1EE0F;
  border: none;
  color: #1F1F1F;
  font-size: 14px;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 15px;
  cursor: pointer;
  text-transform: uppercase;
  
  &:hover {
    background: #95c555;
  }
`


