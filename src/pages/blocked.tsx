import Image from "next/image";

const Blocked = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <Image src="/slow-down.png" width={300} height={300} alt="429" />
      <p className="mt-4 text-2xl font-bold text-primary">Too many requests :&#40; </p>
      <p className="mt-2 text-lg font-medium text-gray-600">Please try again after sometime</p>
    </div>
  );
}

export default Blocked;