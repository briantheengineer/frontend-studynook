import { Outlet, Navigate } from "react-router-dom";

export default function PrivateLayout() {
  const token = localStorage.getItem("token");

  if (!token || token === "undefined") {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <main>
        <Outlet />
      </main>
    </>
  );
}
