import { forwardRef } from "react";

const Input = forwardRef(({ title, name, ...inputAttrs }, ref) => {
  return (
    <div data-mdb-input-init class="form-outline mb-4 col-md-4 offset-md-4">
      <label class="form-label" htmlFor={name}>
        {title}
      </label>
      <input id={name} ref={ref} class="form-control" {...inputAttrs} />
    </div>
  );
});

export default Input;
