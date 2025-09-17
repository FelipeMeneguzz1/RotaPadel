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
	return (
		<HeaderContainer>
			<Logo>ROTA PADEL</Logo>
			<NavButtons>
				<ScheduleButton onClick={handleNavigate}>
					AGENDE UM HORÁRIO
				</ScheduleButton>
				<LoginButton onClick={handleNaviLogin}>LOGIN</LoginButton>
			</NavButtons>
		</HeaderContainer>
	);
}
