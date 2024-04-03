export default function Navbar() {
	return (
		<nav className="flex w-full items-center p-2 h-20 bg-slate-300">
            <div className="w-[93%] mr-5 flex justify-center text-[50px] font-bold">Web Apps</div>
			<div className="w-[5%]">
                <button className="text-white p-2 w-[100px] h-[50px] bg-black rounded-lg hover:bg-gray-500">
                    Sign Out
                </button>
            </div>
		</nav>
	);
}
