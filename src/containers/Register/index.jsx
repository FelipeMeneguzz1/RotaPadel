import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { FormInput } from "../../components/FormInput";
import { Header } from "../../components/Header";
import { Link } from "../../components/Link";
import authService from "../../services/authService";
import {
	Container,
	Content,
	ErrorMessage,
	Form,
	FormContainer,
	FormGroup,
	FormSubtitle,
	FormTitle,
	ImageContainer,
	ModalContainer,
	PasswordRequirements,
	PlayerImage,
	SignInLink,
} from "./styles";

export function Register() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		confirmPassword: "",
		cpf: "",
		birthDate: "",
		phone: "",
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

		if (!formData.confirmPassword) {
			newErrors.confirmPassword = "Confirmação de senha é obrigatória";
		} else if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = "Senhas não coincidem";
		}

		if (!formData.cpf.trim()) {
			newErrors.cpf = "CPF é obrigatório";
		} else if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formData.cpf)) {
			newErrors.cpf = "Formato inválido. Use: 000.000.000-00";
		}

		if (!formData.birthDate) {
			newErrors.birthDate = "Data de nascimento é obrigatória";
		}

		if (!formData.phone.trim()) {
			newErrors.phone = "Telefone é obrigatório";
		} else if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(formData.phone)) {
			newErrors.phone = "Formato inválido. Use: (11) 99999-9999";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const formatPhone = (value) => {
		const numbers = value.replace(/\D/g, "");
		if (numbers.length <= 2) return numbers;
		if (numbers.length <= 6)
			return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
		if (numbers.length <= 10)
			return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
		return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
	};

	const formatCPF = (value) => {
		const numbers = value.replace(/\D/g, "");
		if (numbers.length <= 3) return numbers;
		if (numbers.length <= 6)
			return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
		if (numbers.length <= 9)
			return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
		return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
	};

	const handlePhoneChange = (e) => {
		const formatted = formatPhone(e.target.value);
		setFormData((prev) => ({
			...prev,
			phone: formatted,
		}));
	};

	const handleCPFChange = (e) => {
		const formatted = formatCPF(e.target.value);
		setFormData((prev) => ({
			...prev,
			cpf: formatted,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setIsLoading(true);
		setApiError("");

		try {
			const response = await authService.register(formData);
			console.log("Cadastro realizado com sucesso:", response);

			// Redirecionar para a página de login após cadastro bem-sucedido
			navigate("/login");
		} catch (error) {
			console.error("Erro no cadastro:", error);
			setApiError(error.message || "Erro ao fazer cadastro. Tente novamente.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Container>
			<Header />
			<Content>
				<FormContainer>
					<ModalContainer>
						<FormTitle>CADASTRO</FormTitle>
						<FormSubtitle>Crie sua conta para começar a jogar</FormSubtitle>

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
									type="text"
									name="cpf"
									placeholder="000.000.000-00"
									value={formData.cpf}
									onChange={handleCPFChange}
									error={errors.cpf}
								/>
								{errors.cpf && <ErrorMessage>{errors.cpf}</ErrorMessage>}
							</FormGroup>

							<FormGroup>
								<FormInput
									type="date"
									name="birthDate"
									placeholder="Data de nascimento"
									value={formData.birthDate}
									onChange={handleInputChange}
									error={errors.birthDate}
								/>
								{errors.birthDate && (
									<ErrorMessage>{errors.birthDate}</ErrorMessage>
								)}
							</FormGroup>

							<FormGroup>
								<FormInput
									type="text"
									name="phone"
									placeholder="(11) 99999-9999"
									value={formData.phone}
									onChange={handlePhoneChange}
									error={errors.phone}
								/>
								{errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
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
								<PasswordRequirements>
									Senha deve ter pelo menos 6 caracteres
								</PasswordRequirements>
							</FormGroup>

							<FormGroup>
								<FormInput
									type="password"
									name="confirmPassword"
									placeholder="Confirme sua senha"
									value={formData.confirmPassword}
									onChange={handleInputChange}
									error={errors.confirmPassword}
								/>
								{errors.confirmPassword && (
									<ErrorMessage>{errors.confirmPassword}</ErrorMessage>
								)}
							</FormGroup>

							<Button type="submit" disabled={isLoading}>
								{isLoading ? "Cadastrando..." : "CADASTRAR"}
							</Button>

							<SignInLink>
								Já tem uma conta? <Link href="/login">Entre aqui</Link>
							</SignInLink>
						</Form>
					</ModalContainer>

					<ImageContainer>
						<PlayerImage
							src="/src/assets/LoginImg.png"
							alt="Jogador de Padel"
						/>
					</ImageContainer>
				</FormContainer>
			</Content>
		</Container>
	);
}
