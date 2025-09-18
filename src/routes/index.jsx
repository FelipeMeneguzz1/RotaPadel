import { Route, Routes } from "react-router-dom";

import { Home } from "../containers/Home";
import { Login } from "../containers/Login";
import { Register } from "../containers/Register";
import { ForgotPassword } from "../containers/ForgotPassword";
import { ResetPassword } from "../containers/ResetPassword";
import { Shedules } from "../containers/Shedules";

export function Router() {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/horarios" element={<Shedules />} />
			<Route path="/login" element={<Login />} />
			<Route path="/register" element={<Register />} />
			<Route path="/forgot-password" element={<ForgotPassword />} />
			<Route path="/reset-password" element={<ResetPassword />} />
		</Routes>
	);
}
