import { Header } from "@kystverket/styrbord";
import { LibreMap } from "./Components/LibreMap";

/* root component of the app
 */
function App() {
  return (
    <>
      <>
        <Header
          logo={{
            url: "/",
          }}
        />
      </>
      <div id="theMap">
        <LibreMap></LibreMap>
      </div>
    </>
  );
}

export default App;
