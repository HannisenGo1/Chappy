import { Navigate } from "react-router-dom";
import { useStore } from "../storage/storage";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isLoggedIn } = useStore();

  if (!isLoggedIn) {
   
    return <Navigate to="/public" />;
  }

  
  return children;
};

export default ProtectedRoute;