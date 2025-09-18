import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import { Header } from "../../components/Header";
import { FormInput } from "../../components/FormInput";
import { getTodayDateString } from "../../utils/dateUtils";
import {
  Container,
  FormContainer,
  ModalContainer,
  FormTitle,
  FormSubtitle,
  Form,
  FormGroup,
  Select,
  Label,
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

export function Shedules() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [courts, setCourts] = useState([]);
  const [availableHours, setAvailableHours] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalHour, setModalHour] = useState("");
  const [modalCourt, setModalCourt] = useState("");
  const [modalStatus, setModalStatus] = useState("");

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

  const fetchCourts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/courts`, {
        headers: {
          Authorization: `Bearer ${authService.getToken()}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setCourts(data);
      }
    } catch (err) {
      console.error("Erro ao buscar quadras:", err);
    }
  };

  const fetchAvailableHours = async () => {
    if (!selectedDate || !selectedCourt) {
      setAvailableHours([]);
      return;
    }
    try {
      const res = await fetch(
        `${API_BASE_URL}/schedule/${selectedCourt.id}/${selectedDate}`,
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
    fetchCourts();
  }, []);

  useEffect(() => {
    fetchAvailableHours();
  }, [selectedDate, selectedCourt]);

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

  // Função para verificar se um horário já passou
  const isPastTime = (hour) => {
    if (!selectedDate) return false;
    
    const now = new Date();
    const selectedDateObj = new Date(selectedDate + 'T00:00:00'); // Forçar timezone local
    
    // Verificar se é o dia atual
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDateObj.setHours(0, 0, 0, 0);
    
    const isToday = selectedDateObj.getTime() === today.getTime();
    
    if (!isToday) return false;
    
    // Verificar se o horário já passou (considerando minutos também)
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Se for o mesmo horário, verificar se já passou considerando os minutos
    let isPast = false;
    if (hour < currentHour) {
      isPast = true;
    } else if (hour === currentHour) {
      // Se for o mesmo horário, considerar que já passou se já passou mais de 30 minutos
      isPast = currentMinute > 30;
    }
    
    // Debug log
    console.log('Debug isPastTime:', {
      hour,
      currentHour,
      currentMinute,
      isToday,
      isPast,
      selectedDate,
      now: now.toISOString(),
      selectedDateObj: selectedDateObj.toISOString(),
      today: today.toISOString()
    });
    
    return isPast;
  };

  const buttonStyle = (reserved, hour) => {
    const isPast = isPastTime(hour);
    const isDisabled = reserved || isPast;
    
    return {
      padding: "8px 16px",
      border: isDisabled ? "1px solid #ccc" : "2px solid #74ff00",
      borderRadius: "6px",
      backgroundColor: isDisabled ? "#f5f5f5" : "#FFF",
      color: isDisabled ? "#999" : "#1F1F1F",
      cursor: isDisabled ? "not-allowed" : "pointer",
      transition: "all 0.2s",
      opacity: isDisabled ? 0.6 : 1,
    };
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleCourtChange = (e) => {
    const courtId = parseInt(e.target.value);
    const court = courts.find(c => c.id === courtId);
    setSelectedCourt(court);
    setAvailableHours([]); // Limpar horários quando trocar de quadra
  };

  const handleOpenModal = (hora, reserved) => {
    if (reserved) return;
    
    const hour = parseInt(hora.split(":")[0], 10);
    if (isPastTime(hour)) {
      setModalStatus("Não é possível reservar horários que já passaram.");
      setModalOpen(true);
      return;
    }
    
    setModalHour(hora);
    setModalCourt(selectedCourt?.name || "Quadra");
    setModalOpen(true);
  };

  const handleConfirmReserve = async () => {
    if (!selectedDate) {
      setModalStatus("Selecione uma data.");
      return;
    }
    if (!selectedCourt) {
      setModalStatus("Selecione uma quadra.");
      return;
    }
    if (!userId) {
      setModalStatus("Você precisa estar logado.");
      return;
    }
    
    // Validação adicional para horários passados
    const hour = parseInt(modalHour.split(":")[0], 10);
    if (isPastTime(hour)) {
      setModalStatus("Não é possível reservar horários que já passaram.");
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
          courtId: selectedCourt.id,
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
      slots.map((slot) => {
        const isPast = isPastTime(slot.startHour);
        const isDisabled = slot.reserved || isPast;
        
        let buttonText = `${slot.startHour}:00`;
        let tooltipText = "Clique para reservar";
        
        if (slot.reserved) {
          buttonText += " (Reservado)";
          tooltipText = "Horário já reservado";
        } else if (isPast) {
          buttonText += " (Passou)";
          tooltipText = "Horário já passou - não disponível";
        }
        
        return (
          <button
            key={slot.startHour}
            type="button" 
            style={buttonStyle(slot.reserved, slot.startHour)}
            onClick={(e) => {
              e.preventDefault();
              handleOpenModal(`${slot.startHour}:00`, slot.reserved);
            }}
            disabled={isDisabled}
            title={tooltipText}
          >
            {buttonText}
          </button>
        );
      })
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
            Escolha uma quadra, data e selecione o horário desejado
          </FormSubtitle>
          <Form>
            <FormGroup>
              <Label>Quadra</Label>
              <Select
                value={selectedCourt?.id || ""}
                onChange={handleCourtChange}
              >
                <option value="">Selecione uma quadra</option>
                {courts.map((court) => (
                  <option key={court.id} value={court.id}>
                    {court.name} - {court.location}
                  </option>
                ))}
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>Data</Label>
              <FormInput
                type="date"
                name="date"
                value={selectedDate}
                onChange={handleDateChange}
              />
            </FormGroup>
            {selectedDate && (
              <div style={{ 
                marginTop: "20px", 
                padding: "12px", 
                backgroundColor: "#e7f3ff", 
                border: "1px solid #b3d9ff", 
                borderRadius: "8px",
                fontSize: "0.9rem",
                color: "#0066cc"
              }}>
                <strong>Legenda dos horários:</strong>
                <ul style={{ margin: "8px 0 0 20px", padding: 0 }}>
                  <li><span style={{ color: "#1F1F1F" }}>Verde</span> - Disponível para reserva</li>
                  <li><span style={{ color: "#999" }}>Cinza (Reservado)</span> - Já ocupado por outro usuário</li>
                  <li><span style={{ color: "#999" }}>Cinza (Passou)</span> - Horário já passou no dia atual</li>
                </ul>
                <div style={{ marginTop: "8px", fontSize: "0.8rem" }}>
                  <strong>Debug:</strong> Hora atual: {new Date().getHours()}:{new Date().getMinutes().toString().padStart(2, '0')} | 
                  Data selecionada: {selectedDate} | 
                  É hoje: {new Date(selectedDate + 'T00:00:00').toDateString() === new Date().toDateString() ? 'Sim' : 'Não'}
                </div>
              </div>
            )}
            {selectedCourt && selectedDate && (
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
            )}
          {!userId && (
            <div
              style={{
                marginTop: "24px",
                padding: "16px",
                background: "#f8f9fa",
                border: "1px solid #e9ecef",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
              }}
            >
              <span style={{ color: "#495057" }}>
                É necessário estar logado para reservar um horário.
              </span>
              <button
                type="button"
                onClick={() => navigate("/login")}
                style={{
                  background: "#C1EE0F",
                  border: "none",
                  color: "#1F1F1F",
                  fontSize: "14px",
                  fontWeight: 600,
                  padding: "10px 20px",
                  borderRadius: "15px",
                  cursor: "pointer",
                  textTransform: "uppercase",
                }}
              >
                Fazer login
              </button>
            </div>
          )}
          </Form>
        </ModalContainer>
        <ImageContainer>
          <PlayerImage
            src="/src/assets/LoginImg.png"
            alt="Jogador de Padel"
          />
          
        </ImageContainer>
      </FormContainer>
      <ConfirmModal
        open={modalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmReserve}
        hora={modalHour}
        courtName={modalCourt}
        status={modalStatus}
      />
    </Container>
  );
}
