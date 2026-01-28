import { Outlet } from "react-router-dom";

// Wrapper for authenticated pages, useful for adding sidebars or specific padding
const UserLayout = () => {
  return (
    <div>
      {/* Navbar is already in App.jsx, but we can add sub-headers here */}
      <Outlet />
    </div>
  );
};

export default UserLayout;