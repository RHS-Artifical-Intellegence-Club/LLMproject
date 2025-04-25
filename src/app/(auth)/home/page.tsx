import Image from "next/image";
import  Navbar from "@/components/ui/navbar";
export default function Home() {
  return (
    <div>
      <Navbar/>
      <div className="flex justify-center p-17 text-6xl font-bold">
        LEO
      </div>

      <div className="flex justify-center text-2xl mt-[-25]">
        Our latest LLM yet
      </div>

      <div className= "p-20 grid grid-cols gap-20">
        <Image src="/coding.jpg" alt="logo" width={900} height={900} className = "rounded-2xl"/>
        <div className = "align-self-end justify-self-end">
          <Image src="/computer.jpg" alt="logo" width={800} height={200} className = "rounded-2xl flex-row-reverse"/>
        </div>
      </div>
    </div>
  );
}
