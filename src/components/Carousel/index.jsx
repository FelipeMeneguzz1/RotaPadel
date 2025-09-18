import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import BannerB from "../../assets/bannerhome1.jpeg";
import BannerC from "../../assets/bannerhome2.jpeg";
import Banner from "../../assets/bannert.png";
import { CarouselItem, CarouselWrapper } from "./styles";

const images = [
	{ id: 1, src: Banner, alt: "Banner 1" },
	{ id: 2, src: BannerB, alt: "Banner 2" },
	{ id: 3, src: BannerC, alt: "Banner 3" },
];

export function BannerCarousel() {
	const responsive = {
		desktop: { breakpoint: { max: 3000, min: 1024 }, items: 1 },
		tablet: { breakpoint: { max: 1024, min: 464 }, items: 1 },
		mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
	};

	return (
		<CarouselWrapper>
			<Carousel
				responsive={responsive}
				showDots
				infinite
				autoPlay
				partialVisbile
				autoPlaySpeed={4000}
				arrows={false}
			>
				{images.map((image) => (
					<CarouselItem key={image.id}>
						<img src={image.src} alt={image.alt} />
					</CarouselItem>
				))}
			</Carousel>
		</CarouselWrapper>
	);
}
