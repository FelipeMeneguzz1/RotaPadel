import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { FormInput } from "../../components/FormInput";
import { Header } from "../../components/Header";
import { Link } from "../../components/Link";
import authService from "../../services/authService";
import {
	BeAProText,
	Container,
	ErrorMessage,
	ForgotPassword,
	Form,
	FormContainer,
	FormGroup,
	FormSubtitle,
	FormTitle,
	ImageContainer,
	ModalContainer,
	PlayerImage,
	SignUpLink,
} from "./styles";

export function Login() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [errors, setErrors] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [apiError, setApiError] = useState("");

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		// Limpar erros quando usuário começar a digitar
		if (errors[name]) {
			setErrors((prev) => ({
				...prev,
				[name]: "",
			}));
		}
		if (apiError) {
			setApiError("");
		}
	};

	const validateForm = () => {
		const newErrors = {};

		if (!formData.email) {
			newErrors.email = "Email é obrigatório";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Email inválido";
		}

		if (!formData.password) {
			newErrors.password = "Senha é obrigatória";
		} else if (formData.password.length < 6) {
			newErrors.password = "Senha deve ter pelo menos 6 caracteres";
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

		try {
			const response = await authService.login(
				formData.email,
				formData.password,
			);
			console.log("Login realizado com sucesso:", response);

			// Redirecionar para a página inicial após login bem-sucedido
			navigate("/");
		} catch (error) {
			console.error("Erro no login:", error);
			setApiError(error.message || "Erro ao fazer login. Tente novamente.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Container>
			<Header />
			<FormContainer>
				<ModalContainer>
					<FormTitle>LOGIN</FormTitle>
					<FormSubtitle>Entre com sua conta para continuar</FormSubtitle>

					<Form onSubmit={handleSubmit}>
						{apiError && (
							<FormGroup>
								<ErrorMessage>{apiError}</ErrorMessage>
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

						<FormGroup>
							<FormInput
								type="password"
								name="password"
								placeholder="Digite sua senha"
								value={formData.password}
								onChange={handleInputChange}
								error={errors.password}
							/>
							{errors.password && (
								<ErrorMessage>{errors.password}</ErrorMessage>
							)}
						</FormGroup>

						<ForgotPassword>
							<Link href="/forgot-password">Esqueci minha senha</Link>
						</ForgotPassword>

						<Button type="submit" disabled={isLoading}>
							{isLoading ? "Entrando..." : "ENTRAR"}
						</Button>

						<SignUpLink>
							Não tem uma conta? <Link href="/register">Cadastre-se</Link>
						</SignUpLink>
					</Form>
				</ModalContainer>

				<ImageContainer>
					<PlayerImage
						src="/src/assets/jogadorTelaLoginRegister.png"
						alt="Jogador de Padel"
					/>
					<BeAProText>BE A PRO</BeAProText>
				</ImageContainer>
			</FormContainer>
		</Container>
	);
}
