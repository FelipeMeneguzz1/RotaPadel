import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import { Header } from "../../components/Header";
import { formatDateBR, createLocalDate } from "../../utils/dateUtils";
import {
  Container,
  ContentContainer,
  Title,
  Subtitle,
  ReservationsList,
  ReservationCard,
  ReservationInfo,
  ReservationDetails,
  ReservationActions,
  CancelButton,
  NoReservations,
  LoadingMessage,
  ErrorMessage,
  SuccessMessage,
  ConfirmModal,
  ModalContent,
  ModalButtons,
  ConfirmButton,
  CancelModalButton,
} from "./styles";

const API_BASE_URL = "http://localhost:4000/api";

function MyReservations() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [reservationToCancel, setReservationToCancel] = useState(null);

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

  const fetchReservations = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_BASE_URL}/reservations/${userId}`, {
        headers: {
          Authorization: `Bearer ${authService.getToken()}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setReservations(data);
      } else {
        setError(data.message || "Erro ao carregar reservas");
      }
    } catch (err) {
      setError("Erro ao carregar reservas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [userId]);


  const formatTime = (hour) => {
    return `${hour.toString().padStart(2, "0")}:00`;
  };

  const canCancelReservation = (reservation) => {
    const now = new Date();
    const reservationDateTime = createLocalDate(reservation.date);
    if (!reservationDateTime) {
      return { canCancel: false, reason: "Data inválida" };
    }
    
    reservationDateTime.setHours(reservation.start_hour, 0, 0, 0);

    // Verificar se não é do passado
    if (reservationDateTime <= now) {
      return { canCancel: false, reason: "Já passou" };
    }

    // Verificar se tem pelo menos 2 horas de antecedência
    const twoHoursFromNow = new Date(now.getTime() + (2 * 60 * 60 * 1000));
    if (reservationDateTime <= twoHoursFromNow) {
      return { canCancel: false, reason: "Muito próximo" };
    }

    return { canCancel: true, reason: "" };
  };

  const getTimeUntilReservation = (reservation) => {
    const now = new Date();
    const reservationDateTime = createLocalDate(reservation.date);
    if (!reservationDateTime) {
      return "Data inválida";
    }
    
    reservationDateTime.setHours(reservation.start_hour, 0, 0, 0);
    
    const diffMs = reservationDateTime - now;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}min`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes}min`;
    } else {
      return "Já passou";
    }
  };

  const handleCancelClick = (reservation) => {
    setReservationToCancel(reservation);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    if (!reservationToCancel) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/reservations/${reservationToCancel.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authService.getToken()}`,
          },
        }
      );

      const data = await res.json();
      if (res.ok) {
        setSuccess("Reserva cancelada com sucesso!");
        setShowCancelModal(false);
        setReservationToCancel(null);
        await fetchReservations(); // Recarregar lista
      } else {
        setError(data.message || "Erro ao cancelar reserva");
        setShowCancelModal(false);
        setReservationToCancel(null);
      }
    } catch (err) {
      setError("Erro ao cancelar reserva");
      setShowCancelModal(false);
      setReservationToCancel(null);
    }
  };

  const handleCloseModal = () => {
    setShowCancelModal(false);
    setReservationToCancel(null);
  };

  if (!userId) {
    return (
      <Container>
        <Header />
        <ContentContainer>
          <NoReservations>
            <h2>Faça login para ver suas reservas</h2>
            <button onClick={() => navigate("/login")}>Fazer Login</button>
          </NoReservations>
        </ContentContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header />
      <ContentContainer>
        <Title>Minhas Reservas</Title>
        <Subtitle>Gerencie suas reservas de quadra</Subtitle>
        
        <div style={{
          background: "#e7f3ff",
          border: "1px solid #b3d9ff",
          borderRadius: "8px",
          padding: "16px",
          marginBottom: "24px",
          fontSize: "0.9rem",
          color: "#0066cc"
        }}>
          <strong>Regras de Cancelamento:</strong>
          <ul style={{ margin: "8px 0 0 20px", padding: 0 }}>
            <li>Você pode cancelar reservas com pelo menos 2 horas de antecedência</li>
            <li>Reservas que já passaram não podem ser canceladas</li>
            <li>Apenas o dono da reserva pode cancelá-la</li>
          </ul>
        </div>

        {loading && <LoadingMessage>Carregando reservas...</LoadingMessage>}

        {error && (
          <ErrorMessage>
            {error}
            <button onClick={fetchReservations}>Tentar novamente</button>
          </ErrorMessage>
        )}

        {success && (
          <SuccessMessage>
            {success}
            <button onClick={() => setSuccess("")}>Fechar</button>
          </SuccessMessage>
        )}

        {!loading && !error && reservations.length === 0 && (
          <NoReservations>
            <h3>Nenhuma reserva encontrada</h3>
            <p>Você ainda não fez nenhuma reserva.</p>
            <button onClick={() => navigate("/schedules")}>
              Fazer uma reserva
            </button>
          </NoReservations>
        )}

        {!loading && !error && reservations.length > 0 && (
          <ReservationsList>
            {reservations.map((reservation) => {
              const cancelStatus = canCancelReservation(reservation);
              const timeUntil = getTimeUntilReservation(reservation);
              
              return (
                <ReservationCard key={reservation.id}>
                  <ReservationInfo>
                    <ReservationDetails>
                      <h3>{reservation.court_name}</h3>
                      <p>
                        <strong>Data:</strong> {formatDateBR(reservation.date)}
                      </p>
                      <p>
                        <strong>Horário:</strong> {formatTime(reservation.start_hour)} - {formatTime(reservation.end_hour)}
                      </p>
                      <p>
                        <strong>Tempo restante:</strong> {timeUntil}
                      </p>
                      {!cancelStatus.canCancel && (
                        <p style={{ color: "#dc3545", fontSize: "0.9rem", marginTop: "8px" }}>
                          <strong>Não pode cancelar:</strong> {cancelStatus.reason}
                        </p>
                      )}
                    </ReservationDetails>
                    <ReservationActions>
                      {cancelStatus.canCancel ? (
                        <CancelButton onClick={() => handleCancelClick(reservation)}>
                          Cancelar
                        </CancelButton>
                      ) : (
                        <CancelButton disabled>
                          {cancelStatus.reason}
                        </CancelButton>
                      )}
                    </ReservationActions>
                  </ReservationInfo>
                </ReservationCard>
              );
            })}
          </ReservationsList>
        )}

        <ConfirmModal show={showCancelModal}>
          <ModalContent>
            <h3>Confirmar Cancelamento</h3>
            {reservationToCancel && (
              <p>
                Tem certeza que deseja cancelar a reserva da quadra{" "}
                <strong>{reservationToCancel.court_name}</strong> no dia{" "}
                <strong>{formatDateBR(reservationToCancel.date)}</strong> às{" "}
                <strong>{formatTime(reservationToCancel.start_hour)}</strong>?
              </p>
            )}
            <ModalButtons>
              <ConfirmButton onClick={handleConfirmCancel}>
                Sim, cancelar
              </ConfirmButton>
              <CancelModalButton onClick={handleCloseModal}>
                Não, manter
              </CancelModalButton>
            </ModalButtons>
          </ModalContent>
        </ConfirmModal>
      </ContentContainer>
    </Container>
  );
}

export default MyReservations;
