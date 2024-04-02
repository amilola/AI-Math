import {Bars3Icon, ChartBarIcon} from '@heroicons/react/24/outline'

export const Navbar = ({children}) => {
    return (
        <div className='flex bg-[#5484B7] p-4 w-[100%] h-14 justify-between'>
            <ChartBarIcon className='cursor-pointer text-white'/>
            <div><span className='font-bold'>WORD</span> SEARCH</div>
            <Bars3Icon className='cursor-pointer text-white'/>
        </div>
    )


}