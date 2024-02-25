import { Navigate, useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import Spinner from "../ui/Spinner";

function ProtectedRoute({ children }) {
  const { userInfo, isLoading } = useUser();
  const navigate = useNavigate();
  if (isLoading) return <Spinner />;

  if (!userInfo) {
    return <Navigate to="/signin" replace />;
  }
  return children;
}

export default ProtectedRoute;
