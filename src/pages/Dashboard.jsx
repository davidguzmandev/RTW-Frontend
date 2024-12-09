import Navbar from "../partials/Navbar";
import { Records } from "../partials/Records";
import Maps from "../partials/Maps";

const Dashboard = () => {
  return (
    <>
      <div className="bg-white min-h-screen flex flex-col">
        <Navbar />
        <Records />
        <div className="rounded">
          <Maps />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
