import logo from './logo.svg';
import './App.css';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null); 
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setError('');
    } catch (err) {
      setError('Error signing up: ' + err.message);
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError('');
    } catch (err) {
      setError('Error signing in: ' + err.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      setError('Error signing out: ' + err.message);
    }
  };

  auth.onAuthStateChanged((authUser) => {
    if (authUser) {
      setUser(authUser);
    } else {
      setUser(null);
    }
  });

  return (
    <Router>
    <div className="App">
      <header className="App-header">
        <h1>LockedIn.</h1>
        <button>Sign In</button>
        <button>Create Account</button>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  const navigate = useNavigate();

  const handleSignInClick = () => {
    navigate('/login');
  };

  const handleCreateAccountClick = () => {
    navigate('/login');
  };

  return (
    <div>
      <h2>Welcome to LockedIn</h2>
      <button className="header-buttons" onClick={handleSignInClick}>Sign In</button>
      <button className="header-buttons" onClick={handleCreateAccountClick}>Create Account</button>
    </div>
  );
}

export default App;