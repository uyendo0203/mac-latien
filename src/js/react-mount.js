import React from "react";
import { createRoot } from "react-dom/client";
import { MiniGame, WinnerList } from "./react-sections";

const mount = (id, Component) => {
    const el = document.getElementById(id);
    if (el) createRoot(el).render(<Component />);
};

// mount("mini-game", MiniGame);
// mount("winner-list", WinnerList);