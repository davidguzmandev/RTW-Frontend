
import { NavList } from '../components/NavList';

const Navbar = () => {
  return (
    <>
      <div className="mx-auto max-w-screen-xl px-6 py-3 bg-white">
        <div className="flex items-center justify-between text-blue-gray-900 border-0 rounded-full p-4 shadow-inner bg-gray-100 pr-10 pl-10">
          <h1 className='font-bold text-lg'>
            Ready To Work
            <span className='font-extralight'> | GSP</span>
          </h1>
          <NavList />
        </div>
      </div>
    </>
  )
}

export default Navbar;