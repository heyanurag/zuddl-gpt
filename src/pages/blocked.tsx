import Image from "next/image";

const Blocked = () => {

  const handleRetry = () => {
    window.location.href = "/";
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <Image src="/slow-down.png" width={300} height={300} alt="429" />
      <p className="mt-4 text-2xl font-bold text-primary">Too many requests :&#40; </p>
      <p className="mt-2 text-lg font-medium text-gray-600">Please try again after sometime</p>
      {/* retry button */}
      <button className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark" onClick={handleRetry}>Retry</button>
    </div>
  );
}

export default Blocked;