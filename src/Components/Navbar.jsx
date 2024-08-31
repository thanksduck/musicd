import React from "react";

function Navbar(props) {
  const [greetings, setGreetings] = React.useState(() => {
    const date = new Date();
    const hours = date.getHours();
    return hours < 12
      ? "Good Morning"
      : hours < 18
      ? "Good Afternoon"
      : hours < 21
      ? "Good Evening"
      : "Good Night";
  });

  return (
    <nav className={`${props.darkMode ? "bg-slate-950" : "bg-zinc-100"} px-4 py-2`}>
  {props.darkMode ? (
    <div className="flex items-center justify-between w-full h-full rounded-lg bg-slate-600 text-white font-semibold text-xl p-4 shadow-md shadow-slate-100">
      <div className="flex items-center">
        <img
          src={"./heart.svg"}
          alt="Thumbnail"
          className="mr-2"
          width="25px"
        />
        <h1 className="text-white">MusicD</h1>
        <h3 className="text-white text-sm ml-4">
          Download Music From YouTube
        </h3>
      </div>
      <p className="text-white text-xs">{greetings}</p>
    </div>
  ) : (
    <div className="flex items-center justify-between w-full h-full mt-4 rounded-lg bg-slate-50 text-black font-semibold text-xl p-4 shadow-md shadow-gray-300">
      <div className="flex items-center">
        <img
          src={"./heart.svg"}
          alt="Thumbnail"
          className="mr-2"
          width="25px"
        />
        <h1 className="text-black">MusicD</h1>
        <h3 className="text-black text-sm ml-4">
          Download Your Song with thumbnail
        </h3>
      </div>
      <p className="text-black text-xs">{greetings}</p>
    </div>
  )}
</nav>
  );
}

export default Navbar;
