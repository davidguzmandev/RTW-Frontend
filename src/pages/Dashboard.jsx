import Navbar from '../partials/Navbar'
import { Records } from '../partials/Records';
import Maps from '../partials/Maps';

const Dashboard = () => {

  return (
      <>
        <div className='bg-white min-h-screen flex flex-col'>
          <Navbar />
          <div>
            <Maps />
          </div>
          <div className='flex-grow mx-auto max-w-screen-xl pb-3'>
            <Records />
          </div>
        </div>
      </>
  );
};

export default Dashboard;
