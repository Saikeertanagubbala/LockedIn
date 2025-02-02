import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import Matches from './Matches';
import Users from './Users';
import Settings from './Settings';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="logo">LockedIn</div>
           <ul className="nav-links">
            <li><Link to="/matches">Matches</Link></li>
            <li><Link to="/users">Users</Link></li>
            <li><Link to="/settings">Settings</Link></li>
          </ul>  
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/users" element={<Users />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
