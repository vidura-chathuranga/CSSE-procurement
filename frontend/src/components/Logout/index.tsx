const logout = () => {
  localStorage.removeItem("manager");
  window.location.href = "/";
};

// user logout function, when user clicks logout button, This function will trigger
const Logout: React.FC = () => {
  logout();
  return <div />;
};

export default Logout;
