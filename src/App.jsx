
import AuthPage from './pages/AuthPage'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import ProfilePage from './pages/ProfilePage';
import { Users } from './pages/Users';
import { Provider } from 'react-redux';
import store from "./store";

export default function App() {
  return (
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
  )
}
