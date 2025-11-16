import React from "react";

const Input = ({
  type = "text",
  placeholder = "",
  className = "",
  value,
  onChange,
  onBlur,
  name,
  error = "",
  ...rest
}) => {
  return (
    <div className="w-full">
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none 
          ${error ? "border-red-500 focus:ring-red-300" : "border-gray-500 focus:ring-indigo-500"} 
          ${className}`}
        {...rest}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Input;
