import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { LinkContainer } from "./styles";

export function Link({ 
	children, 
	href, 
	onClick,
	variant = "default",
	...props 
}) {
	const navigate = useNavigate();

	const handleClick = (e) => {
		e.preventDefault();
		
		if (onClick) {
			onClick();
		} else if (href) {
			navigate(href);
		}
	};

	return (
		<LinkContainer
			href={href || "#"}
			onClick={handleClick}
			variant={variant}
			{...props}
		>
			{children}
		</LinkContainer>
	);
}

Link.propTypes = {
	children: PropTypes.node.isRequired,
	href: PropTypes.string,
	onClick: PropTypes.func,
	variant: PropTypes.string,
};
