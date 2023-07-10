
import AuthPage from './pages/AuthPage'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import ProfilePage from './pages/ProfilePage';
import { Users } from './pages/Users';
import { Provider } from 'react-redux';
import store from "./store";
import { AuthProvider } from './components/AuthProvider';

export default function App() {
  return (
    <AuthProvider>
      <Provider store={store}>
        <BrowserRouter>
        <Routes>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="*" element={<AuthPage />} />
          <Route path="/users" element={<Users/>}/>
        </Routes>
        </BrowserRouter>
      </Provider>
    </AuthProvider>
  )
}
