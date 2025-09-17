import React from "react";
import ReactDom from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { Router } from "./routes";
import GlobalStyles from "./styles/globalStyles";

ReactDom.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<BrowserRouter>
			<Router />
		</BrowserRouter>
		<GlobalStyles />
	</React.StrictMode>,
);
