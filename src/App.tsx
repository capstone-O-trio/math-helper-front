import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const App: React.FC = () => {
  return (
    <>
      <main className="w-full h-full">
        <Outlet />
        <ToastContainer position="top-center" autoClose={1500} />
      </main>
    </>
  );
};

export default App;
