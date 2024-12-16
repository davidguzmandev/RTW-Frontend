import Navbar from "../partials/Navbar";
import { Welcome } from "../partials/Welcome";
import Maps from "../partials/Maps";
import { Records } from "../partials/Records";

const Dashboard = () => {
  return (
    <>
      <div className="bg-gray-100 min-h-screen flex flex-col">
        <Navbar />
        <Welcome />
        <div className="z-0 mx-4 rounded-lg overflow-hidden">
          <Maps />
        </div>
        <Records />
      </div>
    </>
  );
};

export default Dashboard;
