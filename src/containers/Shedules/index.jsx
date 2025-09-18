import { useEffect, useState } from "react";
import authService from "../../services/authService";
import { Header } from "../../components/Header";
import { FormInput } from "../../components/FormInput";
import {
  Container,
  FormContainer,
  ModalContainer,
  FormTitle,
  FormSubtitle,
  Form,
  FormGroup,
  ImageContainer,
  PlayerImage,
  BeAProText,
} from "./styles";

const API_BASE_URL = "http://localhost:4000/api";

function getTodayDate() {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

export function Shedules() {
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [availableHours, setAvailableHours] = useState([]);
  const courtId = 1;

  function getUserIdFromToken() {
    const token = authService.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.userId || payload.id || null;
    } catch {
      return null;
    }
  }

  const userId = getUserIdFromToken();

  useEffect(() => {
    async function fetchAvailableHours() {
      if (!selectedDate) {
        setAvailableHours([]);
        return;
      }
      try {
        const res = await fetch(
          `${API_BASE_URL}/schedule/${courtId}/${selectedDate}`,
          {
            headers: {
              Authorization: `Bearer ${authService.getToken()}`,
            },
          }
        );
        const data = await res.json();
        if (res.ok && data.schedule) {
          setAvailableHours(data.schedule);
        } else {
          setAvailableHours([]);
        }
      } catch {
        setAvailableHours([]);
      }
    }
    fetchAvailableHours();
  }, [selectedDate, courtId]);

  function separarHorariosPorPeriodo(slots) {
    const manha = [];
    const tarde = [];
    const noite = [];
    slots.forEach((slot) => {
      const hora = slot.startHour;
      if (hora < 12) {
        manha.push(slot);
      } else if (hora < 18) {
        tarde.push(slot);
      } else {
        noite.push(slot);
      }
    });
    return { manha, tarde, noite };
  }

  const { manha, tarde, noite } = separarHorariosPorPeriodo(availableHours);

  const buttonStyle = (reserved) => ({
    padding: "8px 16px",
    border: reserved ? "1px solid #ccc" : "2px solid #74ff00",
    borderRadius: "6px",
    backgroundColor: "#FFF",
    color: reserved ? "#999" : "#1F1F1F",
    cursor: reserved ? "not-allowed" : "pointer",
    transition: "all 0.2s",
    opacity: reserved ? 0.6 : 1,
  });

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleReserve = async (hora) => {
    if (!selectedDate) {
      console.log("Selecione uma data.");
      return;
    }
    if (!userId) {
      console.log("Você precisa estar logado.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authService.getToken()}`,
        },
        body: JSON.stringify({
          userId,
          courtId,
          date: selectedDate,
          startHour: parseInt(hora.split(":")[0], 10),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        console.log("Reserva criada com sucesso!");
      } else {
        console.log(data.message || "Erro ao reservar.");
      }
    } catch (err) {
      console.log("Erro ao reservar.");
    }
  };

  return (
    <Container>
      <Header />
      <FormContainer>
        <ModalContainer>
          <FormTitle>Agendamento</FormTitle>
          <FormSubtitle>
            Escolha uma data e selecione o horário desejado
          </FormSubtitle>
          <Form>
            <FormGroup>
              <FormInput
                type="date"
                name="date"
                value={selectedDate}
                onChange={handleDateChange}
              />
            </FormGroup>
            <div style={{ marginTop: "20px" }}>
              <strong style={{ color: "#1F1F1F" }}>Manhã</strong>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  marginTop: "8px",
                }}
              >
                {manha.length > 0 ? (
                  manha.map((slot) => (
                    <button
                      key={slot.startHour}
                      style={buttonStyle(slot.reserved)}
                      onClick={() => handleReserve(`${slot.startHour}:00`)}
                      disabled={slot.reserved}
                    >
                      {slot.startHour}:00
                    </button>
                  ))
                ) : (
                  <span style={{ color: "#999" }}>Nenhum horário disponível</span>
                )}
              </div>
              <strong
                style={{
                  color: "#1F1F1F",
                  marginTop: "20px",
                  display: "block",
                }}
              >
                Tarde
              </strong>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  marginTop: "8px",
                }}
              >
                {tarde.length > 0 ? (
                  tarde.map((slot) => (
                    <button
                      key={slot.startHour}
                      style={buttonStyle(slot.reserved)}
                      onClick={() => handleReserve(`${slot.startHour}:00`)}
                      disabled={slot.reserved}
                    >
                      {slot.startHour}:00
                    </button>
                  ))
                ) : (
                  <span style={{ color: "#999" }}>Nenhum horário disponível</span>
                )}
              </div>
              <strong
                style={{
                  color: "#1F1F1F",
                  marginTop: "20px",
                  display: "block",
                }}
              >
                Noite
              </strong>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  marginTop: "8px",
                }}
              >
                {noite.length > 0 ? (
                  noite.map((slot) => (
                    <button
                      key={slot.startHour}
                      style={buttonStyle(slot.reserved)}
                      onClick={() => handleReserve(`${slot.startHour}:00`)}
                      disabled={slot.reserved}
                    >
                      {slot.startHour}:00
                    </button>
                  ))
                ) : (
                  <span style={{ color: "#999" }}>Nenhum horário disponível</span>
                )}
              </div>
            </div>
          </Form>
        </ModalContainer>
        <ImageContainer>
          <PlayerImage
            src="/src/assets/jogadorTelaLoginRegister.png"
            alt="Jogador de Padel"
          />
          <BeAProText>
            BE A
            <br />PRO
          </BeAProText>
        </ImageContainer>
      </FormContainer>
    </Container>
  );
}
