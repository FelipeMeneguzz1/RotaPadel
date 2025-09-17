import logo from "../../assets/logo.png";
import {
	HeaderContainer,
	LoginButton,
	Logo,
	NavButtons,
	ScheduleButton,
} from "./styles";

export function Header() {
	return (
		<HeaderContainer>
			<Logo src={logo}></Logo>
			<NavButtons>
				<ScheduleButton>AGENDE UM HORÁRIO</ScheduleButton>
				<LoginButton>LOGIN</LoginButton>
			</NavButtons>
		</HeaderContainer>
	);
}
