import {Routes, Route, Navigate} from 'react-router'

import Login from './components/Login'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './components/Home'
import Search from './components/Search'
import Popular from './components/Popular'
import MovieItemDetails from './components/MovieItemDetails'
import NotFound from './components/NotFound'
import Account from './components/Account'

import './App.css'

const App = () => (
  <Routes>
    <Route path="/login" element={<Login />} />

    <Route
      path="/"
      element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      }
    />

    <Route
      path="/popular"
      element={
        <ProtectedRoute>
          <Popular />
        </ProtectedRoute>
      }
    />

    <Route
      path="/search"
      element={
        <ProtectedRoute>
          <Search />
        </ProtectedRoute>
      }
    />

    <Route
      path="/movies/:id"
      element={
        <ProtectedRoute>
          <MovieItemDetails />
        </ProtectedRoute>
      }
    />

    <Route
      path="/account"
      element={
        <ProtectedRoute>
          <Account />
        </ProtectedRoute>
      }
    />

    <Route path="/not-found" element={<NotFound />} />

    <Route path="*" element={<Navigate to="/not-found" replace />} />
  </Routes>
)

export default App
