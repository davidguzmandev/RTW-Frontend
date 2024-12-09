import Navbar from "../partials/Navbar";
import { Welcome } from "../partials/Welcome";
import Maps from "../partials/Maps";
import { Records } from "../partials/Records";

const Dashboard = () => {
  return (
    <>
      <div className="bg-white min-h-screen flex flex-col">
        <Navbar />
        <Welcome />
        <div className="rounded">
          <Maps />
        </div>
        <Records />
      </div>
    </>
  );
};

export default Dashboard;
