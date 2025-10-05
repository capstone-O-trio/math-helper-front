import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <div className="text-3xl font-bold underline">
        <main className="Outlet-style">
          <header>header</header>
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default App;
