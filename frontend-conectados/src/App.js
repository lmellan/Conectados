import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Servicios from './pages/Servicios';
import CrearServicio from './pages/CrearServicio';
import EditarServicio from './pages/EditarServicio';
import ServicioDetalle from './pages/ServicioDetalle';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NoEncontrado from './pages/NoEncontrado';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/servicios/crear" element={<CrearServicio />} />
          <Route path="/servicios/:id" element={<ServicioDetalle />} />
          <Route path="/servicios/:id/editar" element={<EditarServicio />} />
          <Route path="*" element={<NoEncontrado />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
