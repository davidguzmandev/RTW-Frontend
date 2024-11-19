import { useContext, useEffect } from "react";
import { IconUserCircle, IconHome, IconHistory } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../utils/UserContext";

export function NavListMobile() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // Redirige a SignIn si no hay token
      return;
    }
  }, [navigate, user]);

  return (
    <div className="fixed bottom-0 w-full bg-gray-100 shadow-lg">
      <ul className="flex justify-around items-center py-2">
        <li className="flex items-center rounded-full active:bg-white text-gray-600 transition-colors px-6 py-2 text-sm font-semibold text-center active:text-indigo-800">
          <Link
            to="/"
            className="flex flex-col items-center active:text-indigo-800 active:bg-white">
            <IconHome stroke={2} />
            <p>Home</p>
          </Link>
        </li>
        <li className="flex items-center rounded-full hover:bg-white text-gray-600 hover:text-blue-500 transition-colors px-6 py-2 text-sm font-semibold">
          <Link
            to="/time"
            className="flex flex-col items-center active:text-indigo-800 active:bg-white">
            <IconHistory stroke={2} />
            <p>History</p>
          </Link>
        </li>
        {/* Contenido para Admin y editores */}
        {(user?.role === "admin" || user?.role === "editor") && (
          <>
            <li className="flex items-center rounded-full hover:bg-white text-gray-600 hover:text-blue-500 transition-colors px-6 py-2 text-sm font-semibold">
              <Link to="https://rtw-backend.onrender.com/api/exportExcel">
                Export Data
              </Link>
            </li>
            <li className="flex items-center rounded-full hover:bg-white text-gray-600 hover:text-blue-500 transition-colors px-6 py-2 text-sm font-semibold">
              <Link to="/">Edit Users</Link>
            </li>
          </>
        )}
        <li className="flex items-center rounded-full hover:bg-white text-gray-600 hover:text-blue-500 transition-colors px-6 py-2 text-sm font-semibold">
          <Link
            to="/account"
            className="flex flex-col items-center active:text-indigo-800 active:bg-white">
            <IconUserCircle stroke={2} />
            <p>Account</p>
          </Link>
        </li>
      </ul>
    </div>
  );
}
