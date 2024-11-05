
import { NavList } from '../components/NavList';

const Navbar = () => {
  return (
    <>
          <div className="mx-auto max-w-screen-xl px-6 py-3">
            <div className="flex items-center justify-between text-blue-gray-900 border-0 rounded-lg p-8 shadow-lg">
              <h1 className='font-bold text-lg'>
                Ready To Work
              </h1>
              <NavList />
            </div>
          </div>
    </>
  )
}

export default Navbar;