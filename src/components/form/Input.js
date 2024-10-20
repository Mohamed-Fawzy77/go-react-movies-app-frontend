import { forwardRef } from "react";

const Input = forwardRef(({ title, name, ...inputAttrs }, ref) => {
  return (
    <div data-mdb-input-init className="form-outline mb-4 col-md-4 offset-md-4">
      <label className="form-label" htmlFor={name}>
        {title}
      </label>
      <input id={name} ref={ref} className="form-control" {...inputAttrs} />
    </div>
  );
});

export default Input;
