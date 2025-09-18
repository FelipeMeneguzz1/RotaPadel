import styled from "styled-components";
import Background from "../../assets/background.png";
import BannerHome from "../../assets/bannerhome.png";

export const Container = styled.div`
    background-image: url('${Background}');
    background-size: cover;
    background-position: center;
    
    
    height: 100vh;
    width: 100%;
`;

export const ContainerTop = styled.div`
  margin-bottom: 40px;
`;

export const ContainerBottom = styled.div`
 display: flex;
 align-items: center;
 justify-content: center;
`;

export const BannerWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 350px;
  background: url(${BannerHome}) center/cover no-repeat; 
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  align-items: center;
  color: #fff;
  padding: 2rem;
  max-width: 1270px;
  border-radius: 25px;
`;

export const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 70%;
  height: 100%;
  
  
`;

export const Content = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  margin-top: 100px;
  margin-left: 30px;
  z-index: 2;
  max-width: 300px;
`;
