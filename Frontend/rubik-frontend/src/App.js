import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import LoginForm from './Components/LoginForm/LoginForm';
import RegisterForm from './Components/RegisterForm/RegisterForm';
import ForgotForm from './Components/ForgotForm/ForgotForm'
import HomePage from "./Components/HomePage/HomePage";
import SettingsPage from "./Components/SettingsPage/SettingsPage";
import ChangePwPage from "./Components/ChangePwPage/ChangePwPage";

import Game1Page from "./Components/Game1Page/Game1Page";
import Game2Page from "./Components/Game2Page/Game2Page";
import Game3Page from "./Components/Game3Page/Game3Page";
import Game4Page from "./Components/Game4Page/Game4Page";

import Game1 from "./Games/Game1/tictactoe";
import Game2 from "./Games/Game2/snake";
import Game3 from "./Games/Game3/rock";
import Game4 from "./Games/Game4/jumpy";




function App() {
  return (
    <div className="container">
    <Router>
        <Routes>
          <Route exact path="/" element={<LoginForm />}/>
          <Route path="/register" element={<RegisterForm />}/>
          <Route path="/forgot" element={<ForgotForm />}/>
          <Route path="/home" element={<HomePage />}/>
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/change" element={<ChangePwPage />}/>

          <Route path="/game1" element={<Game1Page />}/>
          <Route path="/game2" element={<Game2Page />}/>
          <Route path="/game3" element={<Game3Page />}/>
          <Route path="/game4" element={<Game4Page />}/>

          <Route path="/game1/1" element={<Game1/>}/>
          <Route path="/game2/2" element={<Game2/>}/>
          <Route path="/game3/3" element={<Game3/>}/>
          <Route path="/game4/4" element={<Game4/>}/>
          
        </Routes>
    </Router>
    </div>
  );
}

export default App;
