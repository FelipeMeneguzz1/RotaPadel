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

function ConfirmModal({ open, onClose, onConfirm, hora, courtName, status }) {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "8px",
          padding: "32px",
          minWidth: "320px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
          textAlign: "center",
        }}
      >
        <h3>Confirmar reserva</h3>
        <p>
          Deseja reservar o horário <b>{hora}</b> na quadra <b>{courtName}</b>?
        </p>
        {status && (
          <div
            style={{
              margin: "16px 0",
              color: status === "success" ? "#198754" : "#dc3545",
              fontWeight: "bold",
            }}
          >
            {status === "success"
              ? "Reserva criada com sucesso!"
              : status}
          </div>
        )}
        <div
          style={{ marginTop: "24px", display: "flex", justifyContent: "center", gap: "16px" }}
        >
          {status === "success" ? (
            <button
              onClick={onClose}
              style={{
                background: "#0d6efd",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "8px 20px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Fechar
            </button>
          ) : (
            <>
              <button
                onClick={onConfirm}
                style={{
                  background: "#0d6efd",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "8px 20px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Confirmar
              </button>
              <button
                onClick={onClose}
                style={{
                  background: "#eee",
                  color: "#333",
                  border: "none",
                  borderRadius: "6px",
                  padding: "8px 20px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const API_BASE_URL = "http://localhost:4000/api";

function getTodayDate() {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

export function Shedules() {
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [availableHours, setAvailableHours] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalHour, setModalHour] = useState("");
  const [modalCourt, setModalCourt] = useState("");
  const [modalStatus, setModalStatus] = useState(""); 
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

  const fetchAvailableHours = async () => {
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
  };

  useEffect(() => {
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

  const handleOpenModal = (hora, courtName, reserved) => {
    if (reserved) return;
    setModalHour(hora);
    setModalCourt(courtName);
    setModalOpen(true);
  };

  const handleConfirmReserve = async () => {
    if (!selectedDate) {
      setModalStatus("Selecione uma data.");
      return;
    }
    if (!userId) {
      setModalStatus("Você precisa estar logado.");
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
          startHour: parseInt(modalHour.split(":")[0], 10),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setModalStatus("success");
      } else {
        setModalStatus(data.message || "Erro ao reservar.");
      }
    } catch (err) {
      setModalStatus("Erro ao reservar.");
    }
  };

  const handleCloseModal = async () => {
    setModalOpen(false);
    setModalStatus("");
    await fetchAvailableHours(); 
  };

  const renderButtons = (slots) =>
    slots.length > 0 ? (
      slots.map((slot) => (
        <button
          key={slot.startHour}
          type="button" 
          style={buttonStyle(slot.reserved)}
          onClick={(e) => {
            e.preventDefault();
            handleOpenModal(`${slot.startHour}:00`, slot.court_name, slot.reserved);
          }}
          disabled={slot.reserved}
        >
          {slot.startHour}:00
        </button>
      ))
    ) : (
      <span style={{ color: "#999" }}>Nenhum horário disponível</span>
    );

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
                {renderButtons(manha)}
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
                {renderButtons(tarde)}
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
                {renderButtons(noite)}
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
      <ConfirmModal
        open={modalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmReserve}
        hora={modalHour}
        courtName={modalCourt || "Quadra"}
        status={modalStatus}
      />
    </Container>
  );
}
