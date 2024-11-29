import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Time from './pages/Time';
import Account from './pages/Account';
import RecordDetail from './pages/RecordDetail';
import { UserProvider } from './utils/UserContext.jsx';
import { History } from './pages/History.jsx';

const App = () => {
  return (
    <UserProvider>
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/time" element={<Time />} />
                <Route path="/history" element={<History />} />
                <Route path="/account" element={<Account />} />
                <Route path="/record/:id" element={<RecordDetail />} />
            </Routes>
        </Router>
    </UserProvider>
  );
};

export default App
