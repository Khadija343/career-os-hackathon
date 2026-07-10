import { useEffect } from "react";

function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-5 right-5 rounded-2xl px-4 py-3 text-white shadow-lg ${
        type === "success" ? "bg-emerald-500" : "bg-rose-500"
      }`}
    >
      {message}
    </div>
  );
}

export default Toast;