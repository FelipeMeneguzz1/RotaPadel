import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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

export function ResetPassword() {
	const navigate = useNavigate();
	const location = useLocation();
	const [formData, setFormData] = useState({
		email: "",
		code: "",
		newPassword: "",
		confirmPassword: "",
	});
	const [errors, setErrors] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [apiError, setApiError] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	useEffect(() => {
		// Pegar o email da navegação anterior
		if (location.state?.email) {
			setFormData(prev => ({
				...prev,
				email: location.state.email,
			}));
		}
	}, [location.state]);

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

		if (!formData.code.trim()) {
			newErrors.code = "Código é obrigatório";
		} else if (formData.code.length !== 6) {
			newErrors.code = "Código deve ter 6 dígitos";
		}

		if (!formData.newPassword) {
			newErrors.newPassword = "Nova senha é obrigatória";
		} else if (formData.newPassword.length < 6) {
			newErrors.newPassword = "Senha deve ter pelo menos 6 caracteres";
		}

		if (!formData.confirmPassword) {
			newErrors.confirmPassword = "Confirmação de senha é obrigatória";
		} else if (formData.newPassword !== formData.confirmPassword) {
			newErrors.confirmPassword = "Senhas não coincidem";
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
			const response = await authService.resetPassword(
				formData.email,
				formData.code,
				formData.newPassword,
				formData.confirmPassword
			);
			console.log("Senha redefinida com sucesso:", response);
			setSuccessMessage("Senha redefinida com sucesso!");
			
			// Redirecionar para a página de login após 2 segundos
			setTimeout(() => {
				navigate("/login");
			}, 2000);
		} catch (error) {
			console.error("Erro ao redefinir senha:", error);
			setApiError(error.message || "Erro ao redefinir senha. Tente novamente.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Container>
			<Header />
			<FormContainer>
				<ModalContainer>
					<FormTitle>REDEFINIR SENHA</FormTitle>
					<FormSubtitle>
						Digite o código recebido por email e sua nova senha
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
								disabled={!!location.state?.email}
							/>
							{errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
						</FormGroup>

						<FormGroup>
							<FormInput
								type="text"
								name="code"
								placeholder="Digite o código de 6 dígitos"
								value={formData.code}
								onChange={handleInputChange}
								error={errors.code}
								maxLength="6"
							/>
							{errors.code && <ErrorMessage>{errors.code}</ErrorMessage>}
						</FormGroup>

						<FormGroup>
							<FormInput
								type="password"
								name="newPassword"
								placeholder="Digite sua nova senha"
								value={formData.newPassword}
								onChange={handleInputChange}
								error={errors.newPassword}
							/>
							{errors.newPassword && <ErrorMessage>{errors.newPassword}</ErrorMessage>}
						</FormGroup>

						<FormGroup>
							<FormInput
								type="password"
								name="confirmPassword"
								placeholder="Confirme sua nova senha"
								value={formData.confirmPassword}
								onChange={handleInputChange}
								error={errors.confirmPassword}
							/>
							{errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}
						</FormGroup>

						<Button 
							type="submit" 
							disabled={isLoading}
						>
							{isLoading ? "Redefinindo..." : "REDEFINIR SENHA"}
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
