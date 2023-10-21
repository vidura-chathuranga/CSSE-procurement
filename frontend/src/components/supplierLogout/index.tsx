const logout = () => {
    localStorage.removeItem("supplier");
    window.location.href = "/supplier/login";
  };
  
  // user logout function, when user clicks logout button, This function will trigger
  const SupplierLogout: React.FC = () => {
    logout();
    return <div />;
  };
  
  export default SupplierLogout;