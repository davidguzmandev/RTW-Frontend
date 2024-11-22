import Navbar from '../partials/Navbar'
import Footer from '../partials/Footer'
import { Records } from '../partials/Records';
import Maps from '../partials/Maps';

const Dashboard = () => {

  return (
      <>
        <div className='bg-white min-h-screen flex flex-col'>
          <Navbar />
          <div className='flex-grow mx-auto max-w-screen-xl pb-3'>
            <Maps />
            <Records />
            <Footer />
          </div>
        </div>
      </>
  );
};

export default Dashboard;
