import styled from "styled-components";
import Background from "../../assets/background.png";

export const Container = styled.div`
	background-image: url('${Background}');
	background-size: cover;
	background-position: center;
	min-height: 100vh;
	width: 100%;
	display: flex;
	flex-direction: column;
`;

export const Content = styled.div`
 display: flex;
 align-items: center;
 justify-content: center;
 margin-left: 100px;
`;

export const FormContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	flex: 1;
	padding: 40px 20px;
	gap: 60px;
	min-height: calc(100vh - 80px);

	@media (max-width: 768px) {
		flex-direction: column;
		gap: 40px;
	}
`;

export const ModalContainer = styled.div`
	background: white;
	border-radius: 20px;
	padding: 40px;
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
	border: 1px solid rgba(6, 54, 212, 0.1);
	max-width: 450px;
	width: 100%;
	margin: 20px;
`;

export const FormTitle = styled.h1`
	font-size: 2.5rem;
	font-weight: 700;
	color: #1F1F1F;
	margin-bottom: 8px;
	text-align: center;
	text-transform: uppercase;
`;

export const FormSubtitle = styled.p`
	font-size: 1rem;
	color: #666;
	margin-bottom: 40px;
	text-align: center;
	max-width: 400px;
`;

export const Form = styled.form`
	width: 100%;
	max-width: 400px;
	display: flex;
	flex-direction: column;
	gap: 20px;
`;

export const FormGroup = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

export const SignInLink = styled.div`
	text-align: center;
	margin-top: 20px;
	font-size: 0.9rem;
	color: #666;
`;

export const ErrorMessage = styled.span`
	color: #e74c3c;
	font-size: 0.8rem;
	margin-top: 4px;
`;

export const PasswordRequirements = styled.span`
	color: #666;
	font-size: 0.8rem;
	margin-top: 4px;
`;

export const ImageContainer = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 20px;
	flex: 1;
	max-width: 1000px;

	@media (max-width: 768px) {
		max-width: 100%;
	}
`;

export const PlayerImage = styled.img`
	width: 100%;
	max-width: 700px;
	height: auto;
	object-fit: contain;
`;
