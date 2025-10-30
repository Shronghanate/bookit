import logo from "../assets/logo.png";

const Header = ({ onNavigateHome }) => {
  return (
    <header className="bg-[#F9F9F9] shadow-[0_2px_16px_rgba(0,0,0,0.1)] w-full flex justify-between items-center px-[124px] py-4">
      <div onClick={onNavigateHome} className="cursor-pointer">
        <img src={logo} alt="Bookit Logo" className="w-[120px] h-auto" />
      </div>

      {/* Search Section */}
      <div className="flex gap-4 items-center w-[443px]">
        <input
          type="text"
          placeholder="Search experiences..."
          className="w-[340px] h-[42px] bg-[#EDEDED] px-4 py-3 rounded-[4px] text-[14px] placeholder-gray-500 focus:outline-none"
        />
        <button className="bg-[#FFD643] px-[20px] py-[12px] rounded-[8px] font-medium text-[14px]">
          Search
        </button>
      </div>
    </header>
  );
};

export default Header;
