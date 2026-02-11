import { Header } from "@kystverket/styrbord";
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
      <>
        <Header
          logo={{
            url: "/",
          }}
        />
      </>
      <div>
        <LibreMap></LibreMap>
      </div>
    </>
  );
}

export default App;
