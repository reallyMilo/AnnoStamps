import classNames from "classnames";
import { useField } from "formik";
const SelectField = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  const error = meta?.touched && meta?.error;
  return (
    <>
      <label htmlFor={props.name}>{label}</label>
      <select
        className={classNames(
          "w-full shadow-sm rounded-md py-2 pl-4 truncate border focus:outline-none focus:ring-4 focus:ring-opacity-20 transition disabled:opacity-50 disabled:cursor-not-allowed",
          error
            ? "border-red-400 text-red-800 focus:border-red-400 focus:ring-red-400"
            : "border-gray-300 focus:border-gray-400 focus:ring-gray-400"
        )}
        {...field}
        {...props}
      />

      {error ? <div className="text-red-700">{error}</div> : null}
    </>
  );
};

export default SelectField;
