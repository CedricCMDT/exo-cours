import Header from './components/Header/Header.jsx'
import Footer from './components/Footer/Footer.jsx'

export default function App({ children, showHeader = true }) {
  return (
    <>
      {showHeader && <Header />}
      {children}
      <Footer />
    </>
  )
}
