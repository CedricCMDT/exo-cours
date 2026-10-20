import { Route, Routes } from 'react-router'
import Header from './components/Header/Header.jsx'
import Footer from './components/Footer/Footer.jsx'
import Home from './pages/Home/Home.jsx'
import Book from './pages/Book/Book.jsx'

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books/:id" element={<Book />} />
        <Route path="*" element={<main style={{ padding: 32 }}><p>Page introuvable.</p></main>} />
      </Routes>
      <Footer />
    </>
  )
}
