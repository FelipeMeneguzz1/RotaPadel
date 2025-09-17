import { useEffect, useRef } from "react";

const images = [
	{ src: "https://picsum.photos/id/1015/300/200", alt: "Imagem 1" },
	{ src: "https://picsum.photos/id/1016/300/200", alt: "Imagem 2" },
	{ src: "https://picsum.photos/id/1018/300/200", alt: "Imagem 3" },
	{ src: "https://picsum.photos/id/1020/300/200", alt: "Imagem 4" },
];

export default function CarrosselAutomatico() {
	const carrosselRef = useRef < HTMLDivElement > null;

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const carrossel = carrosselRef.current;
		if (!carrossel) return;

		let currentIndex = 0;
		const totalImages = images.length;
		const intervalTime = 2000; // 2 segundos por imagem

		const autoScroll = () => {
			currentIndex = (currentIndex + 1) % totalImages;
			const scrollPosition = currentIndex * 300; // 300px é a largura de cada imagem
			carrossel.scrollTo({
				left: scrollPosition,
				behavior: "smooth",
			});
		};

		const interval = setInterval(autoScroll, intervalTime);

		return () => clearInterval(interval);
	}, []);

	return (
		<CarrosselContainer ref={carrosselRef}>
			{images.map((image, index) => (
				<CarrosselImage key={index} src={image.src} alt={image.alt} />
			))}
		</CarrosselContainer>
	);
}
