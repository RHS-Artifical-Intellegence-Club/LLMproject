import Image from "next/image";

export default function Home() {
  return (
    // Background
    
      <div className="bg-zinc-800 h-screen flex flex-col">
        {/*Project Window*/}
        <div className="flex flex-col h-screen w-1/6 bg-neutral-900 rounded-2xl content-center">
            <h1 className="text-3xl text-white text-center">Projects</h1>
        </div>
      {/*Main Area*/}
      <div className="flex flex-col w-full h-full">
        {/*Main part with the content */}
        <div className="flex-grow bg-neutral-800">
          
        </div>
      </div>
    
      {/*input box at bottom of screen*/}
      <div className="bg-neutral-700 p-4 border-t border-neutral-600">
      <div className="flex items-center">
        <input
        type="text"
        placeholder="Type the prompt"
        className="flex-grow px-4 py-2 rounded-lg bg-neutral-600 text-white focus:outline-none"
        />
        <button className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Send</button>
      </div>
    </div>
  </div>
  
  );
}
