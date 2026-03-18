import Spinner from "../components/ui/Spinner";

const LoadingPage = () => {
  return (
    <div className="h-[50vh] w-full flex justify-center items-center">
      <Spinner />
    </div>
  );
};

export default LoadingPage;
