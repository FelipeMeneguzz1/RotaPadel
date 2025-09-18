import styled from "styled-components";
import Background from "../../assets/background.png";

export const Container = styled.div`
  background-image: url('${Background}');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const FormContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 40px 20px;
  gap: 60px;
  min-height: calc(100vh - 80px); // considerando header com altura de 80px

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 40px;
  }
`;

export const ModalContainer = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(6, 54, 212, 0.1);
  max-width: 600px;
  width: 100%;
  margin: 20px;
`;

export const FormTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1F1F1F;
  margin-bottom: 8px;
  text-align: center;
  text-transform: uppercase;
`;

export const FormSubtitle = styled.p`
  font-size: 1rem;
  color: #666;
  margin-bottom: 40px;
  text-align: center;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
`;

export const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  background-color: #fff;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: #74ff00;
  }
  
  @media (max-width: 768px) {
    padding: 10px;
    font-size: 14px;
  }
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #1F1F1F;
  
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

export const DaySection = styled.div`
  margin-top: 16px;
`;

export const DayTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #1F1F1F;
  margin-bottom: 8px;
`;

export const TimeList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

export const TimeButton = styled.button`
  padding: 8px 16px;
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
  font-weight: 500;
  color: #1F1F1F;

  &:hover {
    background-color: #e0e0e0;
    transform: scale(1.02);
  }

  &:active {
    background-color: #d0d0d0;
    transform: scale(0.98);
  }
`;

export const ReserveButton = styled.button`
  padding: 12px 20px;
  background-color: #74ff00;
  border: none;
  border-radius: 8px;
  color: #1f1f1f;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;

  &:hover {
    background-color: #66e600;
    transform: scale(1.05);
  }

  &:active {
    background-color: #5acc00;
    transform: scale(0.98);
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

export const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  flex: 1;
  max-width: 600px;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

export const PlayerImage = styled.img`
  width: 100%;
  max-width: 500px;
  height: auto;
  object-fit: contain;
`;

export const BeAProText = styled.div`
  font-size: 4rem;
  font-weight: 900;
  color: #1F1F1F;
  text-align: center;
  line-height: 0.9;
  letter-spacing: -2px;

  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;
