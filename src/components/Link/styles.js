import styled from "styled-components";

const getVariantStyles = (variant) => {
	switch (variant) {
		case "primary":
			return `
				color: #C1EE0F;
				
				&:hover {
					color: #95c555;
				}
			`;
		case "secondary":
			return `
				color: #1F1F1F;
				
				&:hover {
					color: #666;
				}
			`;
		default:
			return `
				color: #666;
				
				&:hover {
					color: #1F1F1F;
				}
			`;
	}
};

export const LinkContainer = styled.a`
	${props => getVariantStyles(props.variant)}
	
	text-decoration: none;
	font-weight: 500;
	cursor: pointer;
	transition: color 0.3s ease;
	
	&:focus {
		outline: 2px solid #C1EE0F;
		outline-offset: 2px;
		border-radius: 4px;
	}
`;
