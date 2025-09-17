import { Route, Routes } from "react-router-dom";

import { Home } from "../containers/Home";
import { Login } from "../containers/Login";
import { Shedules } from "../containers/Shedules";

export function Router() {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/horarios" element={<Shedules />} />
			<Route path="/login" element={<Login />} />
		</Routes>
	);
}
