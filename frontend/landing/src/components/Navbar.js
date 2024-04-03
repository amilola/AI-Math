export default function Navbar() {
	return (
		<nav className="flex w-full justify-center md:justify-normal items-center p-2 h-20 bg-slate-300">
			<div className="w-[60%] md:w-[80%] md:mr-2 flex justify-center text-[30px] sm:text-[50px] font-bold">
				Web Apps
			</div>
			<div className="w-[40%] md:w-[20%] flex justify-end p-2">
				<button className="text-white p-2 w-[100px] h-[50px] bg-black rounded-lg hover:bg-gray-500">
					Sign Out
				</button>
			</div>
		</nav>
	);
}
