import Carousel from "react-multi-carousel";
import { Header } from "../../components/Header";
import { Container } from "./styles";

export function Home() {
	return (
		<Container>
			<Header />
			<Carousel />
			<h1> Tela de Home </h1>
		</Container>
	);
}
