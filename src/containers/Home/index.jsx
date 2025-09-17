import { useNavigate } from "react-router-dom";
import { ButtonHome } from "../../components/ButtonHome";
import { BannerCarousel } from "../../components/Carousel";
import { Header } from "../../components/Header";
import {
	BannerWrapper,
	Container,
	ContainerBottom,
	ContainerTop,
	Content,
	Overlay,
} from "./styles";

export function Home() {
	const navigate = useNavigate();

	const handleNavigate = () => {
		navigate("/horarios");
	};

	return (
		<Container>
			<ContainerTop>
				<Header />
				<BannerCarousel />
			</ContainerTop>
			<ContainerBottom>
				<BannerWrapper>
					<Overlay />
					<Content>
						<ButtonHome type="button" onClick={handleNavigate}>
							CLIQUE AQUI
						</ButtonHome>
					</Content>
				</BannerWrapper>
			</ContainerBottom>
		</Container>
	);
}
