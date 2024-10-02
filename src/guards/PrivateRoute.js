import PropTypes from 'prop-types';
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PrivateRoute = ({ children, allowedUserType }) => {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    } else if (allowedUserType && user.userType !== allowedUserType) {
      navigate("/login", { replace: true });
    }
  }, [user, allowedUserType, navigate]);

  if (!user || (allowedUserType && user.userType !== allowedUserType)) {
    return null;
  }

  return children;
};

export default PrivateRoute;

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedUserType: PropTypes.string,
};
