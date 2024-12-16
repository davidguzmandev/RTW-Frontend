import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../partials/Navbar";
import Footer from "../partials/Footer";
import { UserContext } from "../utils/UserContext";
import { useHandleLogout } from "../utils/auth";
import { IconChevronLeft } from "@tabler/icons-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const handleLogout = useHandleLogout();
  const defaultImage = "/images/users/default.webp";

  const { user } = useContext(UserContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // Redirige a SignIn si no hay token
      return;
    }
  }, [navigate]);

  return (
    <>
      <div className="bg-white flex h-screen flex-col">
        <div className="flex-grow flex flex-col">
          <Navbar />

          <div className="py-5 flex justify-center items-center bg-gray-100 sm:hidden relative">
            <div className="absolute left-5">
              <Link to="/">
                <IconChevronLeft stroke={2} />
              </Link>
            </div>
            <div className="text-center">Acoount</div>
          </div>

          <div className="mx-auto mt-4 px-6 py-3 bg-gray-100 rounded-xl">
            <div className="text-center p-4">
              {user ? (
                <div>
                  <div className="flex justify-center">
                    <img
                      src={user.photo ? user.photo : defaultImage}
                      alt="Profile Picture"
                      className="w-16 rounded-full"
                    />
                  </div>
                  <h2 className="font-semibold text-xl text-center">
                    {user.name}
                  </h2>
                  <p>{user.email}</p>
                </div>
              ) : (
                <p>Loading user data...</p>
              )}
              <div className="mt-4">
                <button
                  onClick={handleLogout}
                  className="bg-indigo-700 text-white px-4 py-2 rounded-full hover:bg-indigo-600">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
