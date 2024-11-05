import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Time from './pages/Time';
import { UserProvider } from './utils/UserContext.jsx';

const App = () => {
  return (
    <UserProvider>
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/time" element={<Time />} />
            </Routes>
        </Router>
    </UserProvider>
  );
};

export default App
