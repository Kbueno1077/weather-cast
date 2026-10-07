import { HeroUIProvider } from "@heroui/react";
import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { Loading } from "./components/ui/Loading/Loading";
import { QueryProvider } from "./providers/QueryProvider";

const Home = lazy(() => import("./screens/Home"));
const Cities = lazy(() => import("./screens/Cities"));
const MapScreen = lazy(() => import("./screens/Map"));
const Settings = lazy(() => import("./screens/settings/Settings"));

function App() {
  return (
    <QueryProvider>
      <HeroUIProvider>
        <BrowserRouter>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="cities" element={<Cities />} />
                <Route path="map" element={<MapScreen />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </HeroUIProvider>
    </QueryProvider>
  );
}

export default App;
