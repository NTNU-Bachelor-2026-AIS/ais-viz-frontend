import { Header } from "@kystverket/styrbord";
import "./App.css";
import SideBar from "./Components/SideBar/SideBar";
import ShipInfo from "./Components/ShipInfo/ShipInfo";
import { LibreMap } from "./Components/LibreMap";
import api from "./api/posts";
import { useEffect, useState } from "react";
import type { FeatureCollection } from "geojson";
import SettingsBar from "./Components/SettingsBar/SettingsBar";

/* root component of the app
 */
function App() {
  const [posts, setposts] = useState<FeatureCollection>({
    type: "FeatureCollection",
    features: [],
  });

  useEffect(() => {
    const data = async () => {
      try {
        const response = await api.get("/anomaly-groups");
        setposts(response.data);
      } catch (error) {}
    };
    data();
  }, []);

  useEffect(() => {
    console.log("here is updated posts", posts);
  }, [posts]);

  return (
    <>
        <Header
          logo={{
            url: "/",
          }}
        />
        <main className="content-area">
        {/* Map Component */}
        <LibreMap responseData={posts}></LibreMap>
        {/* Floating components */}
        <ShipInfo />
        <SettingsBar />
        
        {/* SideBar */}
        <SideBar />
      </main>
    </>
  );
}

export default App;
