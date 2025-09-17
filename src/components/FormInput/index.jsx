import PropTypes from "prop-types";
import { InputContainer, InputField, InputIcon } from "./styles";

export function FormInput({ 
	type = "text", 
	placeholder, 
	value, 
	onChange, 
	error, 
	icon, 
	...props 
}) {
	return (
		<InputContainer>
			<InputField
				type={type}
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				error={error}
				{...props}
			/>
			{icon && <InputIcon>{icon}</InputIcon>}
		</InputContainer>
	);
}

FormInput.propTypes = {
	type: PropTypes.string,
	placeholder: PropTypes.string,
	value: PropTypes.string,
	onChange: PropTypes.func,
	error: PropTypes.string,
	icon: PropTypes.node,
};
