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

export const ContentContainer = styled.div`
  flex: 1;
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1F1F1F;
  margin-bottom: 8px;
  text-align: center;
  text-transform: uppercase;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const Subtitle = styled.p`
  font-size: 1rem;
  color: #666;
  margin-bottom: 40px;
  text-align: center;
`;

export const ReservationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
`;

export const ReservationCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(6, 54, 212, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }
`;

export const ReservationInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

export const ReservationDetails = styled.div`
  flex: 1;

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1F1F1F;
    margin-bottom: 8px;
  }

  p {
    margin: 4px 0;
    color: #666;
    font-size: 0.95rem;

    strong {
      color: #1F1F1F;
      font-weight: 600;
    }
  }
`;

export const ReservationActions = styled.div`
  display: flex;
  gap: 12px;
`;

export const CancelButton = styled.button`
  padding: 10px 20px;
  background-color: ${props => props.disabled ? '#ccc' : '#dc3545'};
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: background-color 0.2s, transform 0.1s;
  font-size: 0.9rem;

  &:hover:not(:disabled) {
    background-color: #c82333;
    transform: scale(1.02);
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
  }
`;

export const NoReservations = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  h2, h3 {
    color: #1F1F1F;
    margin-bottom: 16px;
  }

  p {
    color: #666;
    margin-bottom: 24px;
    font-size: 1.1rem;
  }

  button {
    background: #C1EE0F;
    border: none;
    color: #1F1F1F;
    font-size: 16px;
    font-weight: 600;
    padding: 12px 24px;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s, transform 0.1s;

    &:hover {
      background: #a8d00a;
      transform: scale(1.05);
    }

    &:active {
      transform: scale(0.98);
    }
  }
`;

export const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 1.1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

export const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #f5c6cb;
  display: flex;
  justify-content: space-between;
  align-items: center;

  button {
    background: #dc3545;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;

    &:hover {
      background: #c82333;
    }
  }
`;

export const SuccessMessage = styled.div`
  background: #d4edda;
  color: #155724;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #c3e6cb;
  display: flex;
  justify-content: space-between;
  align-items: center;

  button {
    background: #28a745;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;

    &:hover {
      background: #218838;
    }
  }
`;

export const ConfirmModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => props.show ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

export const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 32px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);

  h3 {
    color: #1F1F1F;
    margin-bottom: 16px;
    font-size: 1.5rem;
  }

  p {
    color: #666;
    margin-bottom: 24px;
    line-height: 1.5;

    strong {
      color: #1F1F1F;
    }
  }
`;

export const ModalButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

export const ConfirmButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;

  &:hover {
    background: #c82333;
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const CancelModalButton = styled.button`
  background: #6c757d;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;

  &:hover {
    background: #5a6268;
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.98);
  }
`;
