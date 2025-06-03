import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import GameRoom from "./pages/gameRoom/GameRoom";
import PWAInstallPrompt from "./components/PWAInstall/PWAInstall";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:roomId" element={<GameRoom />} />
      </Routes>
      <PWAInstallPrompt />
    </BrowserRouter>
  );
}

export default App;
