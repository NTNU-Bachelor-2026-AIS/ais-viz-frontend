import { Header } from "@kystverket/styrbord";
import "./App.css";
import SideBar from "./components/sidebar/SideBar";
import ShipInfo from "./components/shipinfo/ShipInfo";
import { LibreMap } from "./Components/LibreMap";
import api from "./api/posts";
import { useEffect, useState } from "react";

/* root component of the app
 */
function App() {
  const [post, setposts] = useState([]);

  useEffect(() => {
    const data = async () => {
      try {
        const response = await api.get("/anomaly-groups");
        console.log(response);
        setposts(response.data);
      } catch (error) {}
    };
    post;
    data();
  }, []);

  return (
    <>
        <Header
          logo={{
            url: "/",
          }}
        />
        <main className="content-area">
        {/* Map Component */}
        <LibreMap></LibreMap>
        {/* Floating components */}
        <ShipInfo />
        
        {/* SideBar */}
        <SideBar />
      </main>
    </>
  );
}

export default App;
