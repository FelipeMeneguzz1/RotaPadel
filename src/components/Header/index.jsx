import { useNavigate } from "react-router-dom";
import {
  HeaderContainer,
  LoginButton,
  Logo,
  NavButtons,
  ScheduleButton,
} from "./styles";
import { useState, useEffect } from "react";
import authService from "../../services/authService";
import { formatDateBR, createLocalDate } from "../../utils/dateUtils"; 

const API_BASE_URL = "http://localhost:4000/api";

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


export function Header() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(!!authService.getToken());
  const [showMenu, setShowMenu] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [reservationToCancel, setReservationToCancel] = useState(null);

  const userId = getUserIdFromToken();

  const fetchReservations = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`${API_BASE_URL}/reservations/${userId}`, {
        headers: { Authorization: `Bearer ${authService.getToken()}` },
      });
      if (!res.ok) throw new Error("Erro ao buscar reservas");
      const data = await res.json();
      setReservations(data);
    } catch (err) {
      setReservations([]);
    }
  };

  const handleNavigate = () => {
    navigate("/horarios");
  };

  const handleNaviLogin = () => {
    navigate("/login");
  };

  const handleNaviHome = () => {
    navigate("/");
  };

  const handleNaviReservations = () => {
    navigate("/minhas-reservas");
  };

  const handleLogout = () => {
    authService.logout();
    setLoggedIn(false);
    setShowMenu(false);
    navigate("/");
  };

  const handleCancelClick = (reservation) => {
    setReservationToCancel(reservation);
    setShowCancelModal(true);
    setShowMenu(false); // Fechar o menu dropdown
  };

  const handleConfirmCancel = async () => {
    if (!reservationToCancel) return;

    try {
      const res = await fetch(`${API_BASE_URL}/reservations/${reservationToCancel.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authService.getToken()}`,
        },
      });
      
      if (res.ok) {
        setReservations((prev) => prev.filter((r) => r.id !== reservationToCancel.id));
        setShowCancelModal(false);
        setReservationToCancel(null);
      } else {
        const data = await res.json();
        alert(data.message || "Erro ao cancelar reserva");
      }
    } catch (err) {
      alert("Erro ao cancelar reserva");
    }
  };

  const handleCloseCancelModal = () => {
    setShowCancelModal(false);
    setReservationToCancel(null);
  };

  const canCancelReservation = (reservation) => {
    const now = new Date();
    const reservationDateTime = createLocalDate(reservation.date);
    if (!reservationDateTime) return false;
    
    reservationDateTime.setHours(reservation.start_hour, 0, 0, 0);

    // Verificar se não é do passado
    if (reservationDateTime <= now) {
      return false;
    }

    // Verificar se tem pelo menos 2 horas de antecedência
    const twoHoursFromNow = new Date(now.getTime() + (2 * 60 * 60 * 1000));
    return reservationDateTime > twoHoursFromNow;
  };

  return (
    <HeaderContainer>
      <Logo onClick={handleNaviHome}>ROTA PADEL</Logo>
      <NavButtons>
        <ScheduleButton onClick={handleNavigate}>
          AGENDE UM HORÁRIO
        </ScheduleButton>
        {!loggedIn ? (
          <LoginButton onClick={handleNaviLogin}>ENTRAR</LoginButton>
        ) : (
          <div style={{ position: "relative", display: "inline-block" }}>
            <LoginButton onClick={handleNaviReservations} style={{ marginRight: "10px" }}>
              MINHAS RESERVAS
            </LoginButton>
            <LoginButton
              onClick={() => {
                setShowMenu(!showMenu);
                fetchReservations();
              }}
            >
              MENU
            </LoginButton>
            <LoginButton onClick={handleLogout} style={{ marginLeft: "10px" }}>
              SAIR
            </LoginButton>
            {showMenu && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: "0",
                  background: "#fff",
                  border: "1px solid #dee2e6",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  padding: "8px 0",
                  marginTop: "8px",
                  minWidth: "400px",
                  maxWidth: "500px",
                  zIndex: 1000,
                  maxHeight: "400px",
                  overflowY: "auto",
                }}
              >
                <div
                  style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid #f1f1f1",
                    backgroundColor: "#f8f9fa",
                    fontWeight: "600",
                    color: "#495057",
                    fontSize: "14px",
                  }}
                >
                  Minhas Reservas
                </div>
                
                {reservations.length === 0 ? (
                  <div
                    style={{
                      color: "#888",
                      padding: "20px 16px",
                      fontStyle: "italic",
                      textAlign: "center",
                    }}
                  >
                    Sem jogos marcados
                  </div>
                ) : (
                  reservations.map((r) => {
                    const canCancel = canCancelReservation(r);
                    return (
                      <div
                        key={r.id}
                        style={{
                          padding: "12px 16px",
                          borderBottom: "1px solid #f1f1f1",
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: "600", color: "#0d6efd", fontSize: "14px" }}>
                              {formatDateBR(r.date)}
                            </div>
                            <div style={{ color: "#212529", fontSize: "13px", marginTop: "2px" }}>
                              {r.court_name}
                            </div>
                            <div style={{ color: "#6c757d", fontSize: "12px" }}>
                              {r.start_hour}:00 às {r.end_hour}:00
                            </div>
                          </div>
                          <button
                            onClick={() => handleCancelClick(r)}
                            disabled={!canCancel}
                            style={{
                              background: canCancel ? "#dc3545" : "#6c757d",
                              border: "none",
                              color: "white",
                              fontSize: "12px",
                              padding: "6px 12px",
                              borderRadius: "4px",
                              cursor: canCancel ? "pointer" : "not-allowed",
                              opacity: canCancel ? 1 : 0.6,
                              fontWeight: "500",
                            }}
                            title={canCancel ? "Cancelar reserva" : "Não é possível cancelar"}
                          >
                            {canCancel ? "Cancelar" : "Indisponível"}
                          </button>
                        </div>
                        {!canCancel && (
                          <div style={{ fontSize: "11px", color: "#dc3545", fontStyle: "italic" }}>
                            {new Date(r.date).setHours(r.start_hour, 0, 0, 0) <= new Date()
                              ? "Reserva já passou"
                              : "Muito próximo para cancelar"}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
                
                <div
                  style={{
                    padding: "12px 16px",
                    borderTop: "1px solid #f1f1f1",
                    backgroundColor: "#f8f9fa",
                  }}
                >
                  <button
                    onClick={handleNaviReservations}
                    style={{
                      background: "#0d6efd",
                      border: "none",
                      color: "white",
                      fontSize: "12px",
                      padding: "8px 16px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontWeight: "500",
                      width: "100%",
                    }}
                  >
                    Ver Todas as Reservas
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </NavButtons>
      
      {/* Modal de Confirmação de Cancelamento */}
      {showCancelModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "24px",
              maxWidth: "400px",
              width: "90%",
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
            }}
          >
            <h3 style={{ color: "#1F1F1F", marginBottom: "16px", fontSize: "18px" }}>
              Confirmar Cancelamento
            </h3>
            {reservationToCancel && (
              <div style={{ marginBottom: "20px" }}>
                <p style={{ color: "#666", marginBottom: "8px" }}>
                  Tem certeza que deseja cancelar a reserva?
                </p>
                <div style={{ background: "#f8f9fa", padding: "12px", borderRadius: "6px", textAlign: "left" }}>
                  <div style={{ fontWeight: "600", color: "#0d6efd" }}>
                    {formatDateBR(reservationToCancel.date)}
                  </div>
                  <div style={{ color: "#212529", fontSize: "14px" }}>
                    {reservationToCancel.court_name}
                  </div>
                  <div style={{ color: "#6c757d", fontSize: "13px" }}>
                    {reservationToCancel.start_hour}:00 às {reservationToCancel.end_hour}:00
                  </div>
                </div>
              </div>
            )}
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button
                onClick={handleConfirmCancel}
                style={{
                  background: "#dc3545",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "6px",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Sim, Cancelar
              </button>
              <button
                onClick={handleCloseCancelModal}
                style={{
                  background: "#6c757d",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "6px",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Não, Manter
              </button>
            </div>
          </div>
        </div>
      )}
    </HeaderContainer>
  );
}
