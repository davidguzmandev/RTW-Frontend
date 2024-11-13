
import { NavList } from '../components/NavList';

const Navbar = () => {
  return (
    <>
      <div className="mx-auto max-w-screen-xl px-6 py-3 bg-slate-200">
        <div className="flex items-center justify-between text-blue-gray-900 border-0 rounded-lg p-4 shadow-lg bg-white">
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