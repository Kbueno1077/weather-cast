import { BrowserRouter, Route, Routes } from "react-router-dom";
import AddedCities from "./components/AddedCities/AddedCities";
import Layout from "./components/Layout";
import { QueryProvider } from "./providers/QueryProvider";
import Home from "./screens/Home";
import Settings from "./screens/settings/Settings";
import { NextUIProvider } from "@nextui-org/system";
import Cities from "./screens/Cities";

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
            </Route>
          </Routes>
        </BrowserRouter>
      </NextUIProvider>
    </QueryProvider>
  );
}

export default App;
