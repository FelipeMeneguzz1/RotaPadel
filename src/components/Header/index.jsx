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

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export function Header() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(!!authService.getToken());
  const [showMenu, setShowMenu] = useState(false);
  const [reservations, setReservations] = useState([]);

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

  const handleLogout = () => {
    authService.logout();
    setLoggedIn(false);
    setShowMenu(false);
    navigate("/");
  };

  const handleCancelReservation = async (reservationId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/reservations/${reservationId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.ok) {
        setReservations((prev) => prev.filter((r) => r.id !== reservationId));
      }
    } catch {

    }
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
              <ul
                style={{
                  position: "absolute",
                  top: "100%",
                  transform: "translateX(-300px)",
                  background: "#fff",
                  border: "1px solid #dee2e6",
                  borderRadius: "0.25rem",
                  boxShadow: "0 0.5rem 1rem rgba(0,0,0,0.15)",
                  padding: "0.5rem 0",
                  marginTop: "0.25rem",
                  minWidth: "360px",
                  zIndex: 100,
                  listStyle: "none",
                }}
              >
                {reservations.length === 0 ? (
                  <li
                    style={{
                      color: "#888",
                      padding: "0.75rem 1.25rem",
                      fontStyle: "italic",
                    }}
                  >
                    Sem jogos marcados
                  </li>
                ) : (
                  reservations.map((r) => (
                    <li
                      key={r.id}
                      style={{
                        padding: "0.75rem 1.25rem",
                        borderBottom: "1px solid #f1f1f1",
                        fontSize: "0.97rem",
                        background: "#FFFF",
                        marginBottom: "2px",
                        borderRadius: "0.25rem",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontWeight: "500", color: "#0d6efd" }}>
                          {formatDate(r.date)}
                        </span>
                        <span style={{ color: "#212529" }}>
                          {r.court_name} — {r.start_hour}:00 às {r.end_hour}:00
                        </span>
                      </div>
                      <button
                        onClick={() => handleCancelReservation(r.id)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#dc3545",
                          fontSize: "1.2rem",
                          cursor: "pointer",
                          marginLeft: "12px",
                        }}
                        title="Cancelar reserva"
                      >
                        &#10005;
                      </button>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        )}
      </NavButtons>
    </HeaderContainer>
  );
}
