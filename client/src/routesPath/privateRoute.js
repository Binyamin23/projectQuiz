import { useContext } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/createContext';

const PrivateRoute = ({ path, element }) => {
  const { user, admin } = useContext(AuthContext);

  return user && admin ? (
    <Route path={path} element={element} />
  ) : (
    <Route to="/login" replace />
  );
};

export default PrivateRoute;
