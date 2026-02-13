import Spinner from "./Spinner";

const getBackgroundByColor = (color) => {
  switch (color) {
    case "success":
      return "bg-green-500 hover:bg-green-600";
    case "danger":
      return "bg-red-500 hover:bg-red-600";
    case "fade":
      return 'bg-[#333] hover:bg-[#444]'
    default:
      return "bg-orange-500 hover:bg-orange-600";
  }
};

const Button = ({
  children,
  color = "default",
  className,
  disabled,
  isLoading,
  ...props
}) => {
  return (
    <button
      disabled={disabled || isLoading}
      className={`${className} ${getBackgroundByColor(color)} flex justify-center items-center cursor-pointer disabled:opacity-50 disabled:cursor-default text-white font-medium py-2 px-4 rounded-lg transition-colors`}
      {...props}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
};

export default Button;
