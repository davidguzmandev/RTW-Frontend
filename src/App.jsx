import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Time from './pages/Time';
import Account from './pages/Account';
import { UserProvider } from './utils/UserContext.jsx';

const App = () => {
  return (
    <UserProvider>
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/time" element={<Time />} />
                <Route path="/account" element={<Account />} />
            </Routes>
        </Router>
    </UserProvider>
  );
};

export default App
