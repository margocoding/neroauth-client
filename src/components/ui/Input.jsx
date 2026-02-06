const Input = ({ label, ...props }) => {
  return (
    <div className="w-full">
      {label && <div className="text-gray-400">{label}</div>}
      <input
        className={`inline-block w-full bg-zinc-900 border border-zinc-700 
    text-white placeholder-zinc-500 disabled:opacity-70
    focus:border-orange-500 
    font-medium py-2 px-4 rounded-lg 
    transition-colors outline-none 
    ${props.className}`}
        {...props}
      />
    </div>
  );
};

export default Input;
