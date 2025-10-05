import { Outlet } from "react-router-dom";

const App: React.FC = () => {
  return (
    <>
      <div className="text-3xl font-bold">
        <main className="Outlet-style">
          <header>header</header>
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default App;