export default function Alert({ className, message }) {
  return (
    <div className={"text-center mt-2 alert " + className} role="alert">
      {message}
    </div>
  );
}
