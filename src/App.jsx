import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ThesisHubHome from './pages/Home'
import SearchResult from './pages/SearchResult'
import Login from './pages/Login';
import AdminPage from './pages/AdminHomePage';
import AddThesisPage from './pages/AddThesisPage';
import BorrowedThesis from './pages/BorrowedThesis';


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ThesisHubHome />} />
        <Route path="/results" element={<SearchResult />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-homepage" element={<AdminPage />} />
        <Route path="/add-thesis-page" element={<AddThesisPage />} />
        <Route path="/borrowed-thesis" element={<BorrowedThesis />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
