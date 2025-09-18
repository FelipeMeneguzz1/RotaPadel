import { useState } from "react";
import { Header } from "../../components/Header";
import { FormInput } from "../../components/FormInput";
import {
	Container,
	FormContainer,
	ModalContainer,
	FormTitle,
	FormSubtitle,
	Form,
	FormGroup,
	ImageContainer,
	PlayerImage,
	BeAProText,
} from "./styles";

export function Shedules() {
	const [selectedDate, setSelectedDate] = useState("");

	const schedule = {
		Manhã: ["08:00", "09:00", "10:00"],
		Tarde: [ "13:00", "15:00", "16:00", "17:00"],
		Noite: [ "19:00", "20:00"],
	};

	return (
		<Container>
			<Header />
			<FormContainer>
				<ModalContainer>
					<FormTitle>Agendamento</FormTitle>
					<FormSubtitle>Escolha uma data e selecione o horário desejado</FormSubtitle>

					<Form>
						<FormGroup>
							<FormInput
								type="date"
								name="date"
								value={selectedDate}
								onChange={(e) => setSelectedDate(e.target.value)}
							/>
						</FormGroup>

						{Object.entries(schedule).map(([dia, horarios]) => (
							<div key={dia}>
								<strong style={{ marginTop: '20px', display: 'block', color: '#1F1F1F' }}>
									{dia}
								</strong>
								<div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '8px' }}>
									{horarios.length > 0 ? (
										horarios.map((hora) => (
											<button
												key={hora}
												style={{
													padding: '8px 16px',
													border: '1px solid #ccc',
													borderRadius: '6px',
													backgroundColor: '#f5f5f5',
													cursor: 'pointer',
													transition: 'all 0.2s',
												}}
												onClick={() => alert(`Horário selecionado: ${hora}`)}
											>
												{hora}
											</button>
										))
									) : (
										<span style={{ color: "#999" }}>Sem horários</span>
									)}
								</div>
							</div>
						))}
					</Form>
				</ModalContainer>

				<ImageContainer>
					<PlayerImage
						src="/src/assets/jogadorTelaLoginRegister.png"
						alt="Jogador de Padel"
					/>
					<BeAProText>
						BE A<br />PRO
					</BeAProText>
				</ImageContainer>
			</FormContainer>
		</Container>
	);
}
