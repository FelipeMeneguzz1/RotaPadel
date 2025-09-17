import { useNavigate } from "react-router-dom";
import {
	HeaderContainer,
	LoginButton,
	Logo,
	NavButtons,
	ScheduleButton,
} from "./styles";

export function Header() {
	const navigate = useNavigate();

	const handleNavigate = () => {
		navigate("/horarios");
	};

	const handleNaviLogin = () => {
		navigate("/login");
	};

	const handleNaviHome = () => {
		navigate("/");
	};
	return (
		<HeaderContainer>
			<Logo onClick={handleNaviHome}>ROTA PADEL</Logo>
			<NavButtons>
				<ScheduleButton onClick={handleNavigate}>
					AGENDE UM HORÁRIO
				</ScheduleButton>
				<LoginButton onClick={handleNaviLogin}>ENTRAR</LoginButton>
			</NavButtons>
		</HeaderContainer>
	);
}
