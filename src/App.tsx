import { NextUIProvider } from "@nextui-org/system";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { QueryProvider } from "./providers/QueryProvider";
import Cities from "./screens/Cities";
import Home from "./screens/Home";
import Settings from "./screens/settings/Settings";
import Map from "./screens/Map";

function App() {
  return (
    <QueryProvider>
      <NextUIProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="cities" element={<Cities />} />
              <Route path="settings" element={<Settings />} />
              <Route path="map" element={<Map />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </NextUIProvider>
    </QueryProvider>
  );
}

export default App;
