import PropTypes from "prop-types";
import { ContainerButton } from "./styles";

export function Button({ children, type = "button", onClick, ...props }) {
	// Se for um botão de formulário, usar button, senão usar link
	const Component = type === "submit" || type === "button" ? "button" : "a";
	
	return (
		<ContainerButton as={Component} type={type} onClick={onClick} {...props}>
			{children}
		</ContainerButton>
	);
}

Button.propTypes = {
	children: PropTypes.node.isRequired,
	type: PropTypes.oneOf(["button", "submit", "link"]),
	onClick: PropTypes.func,
};
