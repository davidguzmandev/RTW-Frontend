import Navbar from '../partials/Navbar'
import Footer from '../partials/Footer'
import { Records } from '../partials/Records';

const Dashboard = () => {

  return (
      <>
      <div className='bg-white min-h-screen flex flex-col'>
        <Navbar />
        <div className='flex-grow mx-auto max-w-screen-xl px-6 py-3'>
        <Records />
        <Footer />
        </div>
      </div>
      </>
  );
};

export default Dashboard;
