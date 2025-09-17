import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { BannerCarousel } from "../../components/Carousel";
import { Header } from "../../components/Header";
import { BannerWrapper, Container, Content, Overlay } from "./styles";

export function Home() {
	const navigate = useNavigate();

	const handleNavigate = () => {
		navigate("/horarios");
	};

	return (
		<Container>
			<Header />
			<BannerCarousel />
			<BannerWrapper>
				<Overlay />
				<Content>
					<Button onClick={handleNavigate}>CLIQUE AQUI</Button>
				</Content>
			</BannerWrapper>
		</Container>
	);
}
