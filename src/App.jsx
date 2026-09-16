import { Navigate, Route, Routes } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import MyColorings from './pages/MyColorings';
import ColoringEditor from './pages/ColoringEditor';
import Gallery from './pages/Gallery';
import GalleryArtwork from './pages/GalleryArtwork';
import ProtectedRoute from './components/ProtectedRoute';
import NewColoring from './pages/NewColoring';

function Home() {
  return (
    <main className="home-page">
      <div className="home-card">
        <h1>Moje kolorowanki</h1>

        <p>
          Koloruj, zapisuj i dziel się swoimi pracami.
        </p>

        <div className="home-actions">
          <a href="/kolorowanki">
            Moje kolorowanki
          </a>

          <a href="/galeria">
            Galeria
          </a>
        </div>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/kolorowanki"
        element={
          <ProtectedRoute>
            <MyColorings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/kolorowanka/nowa"
        element={
          <ProtectedRoute>
            <NewColoring />
          </ProtectedRoute>
        }
      />

      <Route
        path="/kolorowanka/:id"
        element={
          <ProtectedRoute>
            <ColoringEditor />
          </ProtectedRoute>
        }
      />

      <Route
        path="/galeria"
        element={<Gallery />}
      />

      <Route
  path="/galeria/:id"
  element={<GalleryArtwork />}
/>

      <Route
        path="/panel"
        element={
          <Navigate
            to="/kolorowanki"
            replace
          />
        }
      />

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />
    </Routes>
  );
}