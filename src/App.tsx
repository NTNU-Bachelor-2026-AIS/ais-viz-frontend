import { Header } from "@kystverket/styrbord";
import { LibreMap } from "./Components/LibreMap";
import api from "./api/posts";
import { useEffect, useState } from "react";
import type { FeatureCollection } from "geojson";

/* root component of the app
 */
function App() {
  const [posts, setposts] = useState<FeatureCollection>({
    type: "featureCollection",
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
      <>
        <Header
          logo={{
            url: "/",
          }}
        />
      </>
      <div>
        <LibreMap responseData={posts}></LibreMap>
      </div>
    </>
  );
}

export default App;
