
import { NavListPC } from '../components/NavListPC';
import { NavListMobile } from '../components/NavListMobile';

const Navbar = () => {
  return (
    <>
    {/* Navbar para PC */}
      <div className="mx-auto max-w-screen-xl py-3 bg-white max-sm:hidden z-10">
        <div className="flex items-center justify-between text-blue-gray-900 border-0 rounded-full p-4 shadow-inner bg-gray-100 pr-10 pl-10 max-sm:pl-6 max-sm:pr-6">
          <h1 className='font-bold text-lg max-sm:text-base'>
            Ready To Work
            <span className='font-extralight mr-40 max-sm:mr-4 max-sm:text-base'> | Company</span>
          </h1>
          <NavListPC />
        </div>
      </div>
    {/* Navbar para Mobile */}
      <div className='sm:hidden'>
        <NavListMobile />
      </div>
    </>
  )
}

export default Navbar;