import styled from "styled-components";

export const InputContainer = styled.div`
	position: relative;
	width: 100%;
`;

export const InputField = styled.input`
	width: 100%;
	padding: 16px 20px;
	border: 2px solid ${props => props.error ? '#e74c3c' : '#e0e0e0'};
	border-radius: 12px;
	font-size: 16px;
	background-color: white;
	transition: all 0.3s ease;
	outline: none;

	&:focus {
		border-color: ${props => props.error ? '#e74c3c' : '#C1EE0F'};
		box-shadow: 0 0 0 3px ${props => props.error ? 'rgba(231, 76, 60, 0.1)' : 'rgba(193, 238, 15, 0.1)'};
	}

	&::placeholder {
		color: #999;
		font-size: 14px;
	}

	&:disabled {
		background-color: #f5f5f5;
		cursor: not-allowed;
	}
`;

export const InputIcon = styled.div`
	position: absolute;
	right: 16px;
	top: 50%;
	transform: translateY(-50%);
	color: #666;
	font-size: 18px;
	pointer-events: none;
`;
