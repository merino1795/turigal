import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPanel from './pages/turisgal_login_panel';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPanel/>} />
      </Routes>
    </Router>
  );
}

export default App;
