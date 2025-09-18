import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/Header";
import { FormInput } from "../../components/FormInput";
import { Button } from "../../components/Button";
import { Link } from "../../components/Link";
import authService from "../../services/authService";
import {
	Container,
	FormContainer,
	ModalContainer,
	FormTitle,
	FormSubtitle,
	Form,
	FormGroup,
	SignInLink,
	ErrorMessage,
	ImageContainer,
	PlayerImage,
	BeAProText,
} from "./styles";

export function ForgotPassword() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		email: "",
	});
	const [errors, setErrors] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [apiError, setApiError] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value,
		}));
		// Limpar erros quando usuário começar a digitar
		if (errors[name]) {
			setErrors(prev => ({
				...prev,
				[name]: "",
			}));
		}
		if (apiError) {
			setApiError("");
		}
		if (successMessage) {
			setSuccessMessage("");
		}
	};

	const validateForm = () => {
		const newErrors = {};

		if (!formData.email) {
			newErrors.email = "Email é obrigatório";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Email inválido";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		if (!validateForm()) {
			return;
		}

		setIsLoading(true);
		setApiError("");
		setSuccessMessage("");
		
		try {
			const response = await authService.forgotPassword(formData.email);
			console.log("Código enviado com sucesso:", response);
			setSuccessMessage("Código de recuperação enviado por e-mail!");
			
			// Redirecionar para a página de redefinir senha após 2 segundos
			setTimeout(() => {
				navigate("/reset-password", { state: { email: formData.email } });
			}, 2000);
		} catch (error) {
			console.error("Erro ao enviar código:", error);
			setApiError(error.message || "Erro ao enviar código de recuperação. Tente novamente.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Container>
			<Header />
			<FormContainer>
				<ModalContainer>
					<FormTitle>RECUPERAR SENHA</FormTitle>
					<FormSubtitle>
						Digite seu email para receber o código de recuperação
					</FormSubtitle>
					
					<Form onSubmit={handleSubmit}>
						{apiError && (
							<FormGroup>
								<ErrorMessage>{apiError}</ErrorMessage>
							</FormGroup>
						)}
						
						{successMessage && (
							<FormGroup>
								<div style={{ color: "#28a745", fontSize: "0.9rem", textAlign: "center" }}>
									{successMessage}
								</div>
							</FormGroup>
						)}
						
						<FormGroup>
							<FormInput
								type="email"
								name="email"
								placeholder="Digite seu email"
								value={formData.email}
								onChange={handleInputChange}
								error={errors.email}
							/>
							{errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
						</FormGroup>

						<Button 
							type="submit" 
							disabled={isLoading}
						>
							{isLoading ? "Enviando..." : "ENVIAR CÓDIGO"}
						</Button>

						<SignInLink>
							Lembrou da senha? <Link href="/login">Voltar ao login</Link>
						</SignInLink>
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
