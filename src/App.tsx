import { Outlet } from "react-router-dom";

const App: React.FC = () => {
  return (
    <>
      <main className="w-full h-full">
        <Outlet />
      </main>
    </>
  );
};

export default App;
