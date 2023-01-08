import { Layout, EmbedLayout } from "./layouts";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import ErrorPage from "./error-page";
import { ZoneFeatureCollection, ZoneResType } from "./types/zone";
import create from "zustand";
import { useEffect, useState } from "react";

export const useAppStore = create((set) => ({
  selectedZoneId: "",
  setSelectedZoneId: (zoneId: string) =>
    set(() => ({ selectedZoneId: zoneId })),
}));

async function rootloader() {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = urlSearchParams.getAll("zone");

  if (params.length) {
    const res: ZoneResType = await fetch(
      `api/zones?${params.map((p) => "zone=" + p).join("&")}`
    ).then((res) => res.json());
    if (res?.zones) {
      return res.zones;
    }
  } else {
    const res: ZoneResType = await fetch(`api/zones`).then((res) => res.json());
    if (res?.zones) {
      return res.zones;
    }
  }
}

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Layout />,
//     errorElement: <ErrorPage />,
//     loader: rootloader,
//   },
//   {
//     path: "/embed",
//     element: <EmbedLayout />,
//     errorElement: <ErrorPage />,
//     loader: rootloader,
//   },
// ]);

function App() {
  const [zones, setZones] = useState<ZoneFeatureCollection>();

  const fetchZones = async () => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = urlSearchParams.getAll("zone");

    if (params.length) {
      const res: ZoneResType = await fetch(
        `api/zones?${params.map((p) => "zone=" + p).join("&")}`
      ).then((res) => res.json());
      if (res?.zones) {
        setZones(res.zones);
        return res.zones;
      }
    } else {
      const res: ZoneResType = await fetch(`api/zones`).then((res) =>
        res.json()
      );
      if (res?.zones) {
        setZones(res.zones);
        return res.zones;
      }
    }
  };
  useEffect(() => {
    fetchZones();
    return () => {};
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" index element={<Layout zones={zones} />} />
        <Route path="/embed" element={<EmbedLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// TODO: Add select all children Button in embed screen
// TODO: Minify Zones
// TODO: Test on interactivity, drag, pan on different devices
