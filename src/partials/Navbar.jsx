
import { NavList } from '../components/NavList';

const Navbar = () => {
  return (
    <>
      <div className="mx-auto max-w-screen-xl px-6 py-3 bg-white">
        <div className="flex items-center justify-between text-blue-gray-900 border-0 rounded-full p-4 shadow-inner bg-gray-100 pr-10 pl-10 max-sm:pl-6 max-sm:pr-6">
          <h1 className='font-bold text-lg max-sm:text-base'>
            Ready To Work
            <span className='font-extralight mr-40 max-sm:mr-4 max-sm:text-base'> | Company</span>
          </h1>
          <NavList />
        </div>
      </div>
    </>
  )
}

export default Navbar;