import { Header } from "@kystverket/styrbord";
import "./App.css";
import SideBar from "./components/sidebar/SideBar";
import ShipInfo from "./components/shipinfo/ShipInfo";

function App() {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;600;700&display=swap" rel="stylesheet"></link>
        <Header
          logo={{
            url: "/",
          }}
        />
        <main className="content-area">
        {/* Map Component */}
        
        {/* Floating components */}
        <ShipInfo />
        
        {/* SideBar */}
        <SideBar />
      </main>
    </>
  );
}

export default App;
