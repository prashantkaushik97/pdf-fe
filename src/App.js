import logo from './logo.svg';
import './App.css';
import Login from './Views/Login';
import LandingPage from './Views/LandingPage';
import { BrowserRouter as Router, Route, Link, Routes, Navigate } from 'react-router-dom';
import ChatBox from './Views/ChatBox';
import { useSelector } from 'react-redux';
import { selectUserName } from './Redux/userSelectors';

function App() {
  const isLoggedIn = !!useSelector(selectUserName);
console.log(">>>>>", isLoggedIn)

  return (
    <Router>
      <Routes>
        <Route path="/login"
        element={!isLoggedIn ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/"
          element={isLoggedIn ? <LandingPage /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
