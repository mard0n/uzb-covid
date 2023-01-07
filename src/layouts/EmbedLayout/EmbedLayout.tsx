import React, { useEffect, useMemo, useRef, useState } from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import { Map, TreeView } from "../../components";
import EmbedLinkInput from "../../components/EmbedLinkInput/EmbedLinkInput";
import { buildTree } from "../../components/TreeView/TreeView";
import { ZoneFeature, ZoneFeatureCollection } from "../../types/zone";
import logo from "../../assets/logo.svg";
import "./EmbedLayout.css";
import { Link } from "react-router-dom";

interface EmbedLayoutProps {}

const EmbedLayout: React.FC<EmbedLayoutProps> = () => {
  const mapRef = useRef();
  const zones = useLoaderData() as ZoneFeatureCollection | undefined;
  const [selectedZones, setSelectedZones] = useState<ZoneFeature[]>([]);
  const [embedLink, setEmbedLink] = useState("");

  if (!zones) {
    return <>loading...</>;
  }

  useEffect(() => {
    mapRef.current &&
      (mapRef.current as any).showSpecificZones({
        type: "FeatureCollection",
        features: selectedZones,
      });

    const selectedZoneIds = selectedZones.map((zone) => zone.properties.id);

    const embedLink = `<iframe id="coviduz-embed" src="${
      selectedZoneIds.length
        ? window.location.origin + "?zone=" + selectedZoneIds.join("&zone=")
        : window.location.origin
    }" sandbox="allow-scripts allow-same-origin allow-popups" style="border: none;" height="640" width="1024" scrolling="no">
      </iframe>
    `;
    setEmbedLink(embedLink);
    return () => {};
  }, [selectedZones, mapRef.current]);

  const handleZoneSelect = (selectedZoneIds: string[] = []) => {
    const selectedZonesObj = zones.features.filter((zone) =>
      selectedZoneIds.includes(zone.properties.id)
    );
    setSelectedZones(selectedZonesObj);
  };

  const tree = buildTree(zones.features);

  return (
    <>
      <div className="flex h-screen w-screen">
        <div className="w-[min(45vw,600px)] z-10 h-full shadow-[0px_4px_40px_rgba(0,30,89,0.09)] px-9 py-6 relative">
          <div className="flex flex-col justify-between h-full">
            <div className=" overflow-scroll ">
              <div className="mb-8">
                <Link to="/">
                  <img src={logo} alt="CovidUz" />
                </Link>
              </div>
              <TreeView data={tree} onSelect={handleZoneSelect} />
            </div>
            <div>
              <EmbedLinkInput link={embedLink} />
            </div>
          </div>
        </div>
        <div className="grow h-full relative">
          <Map ref={mapRef} />
        </div>
      </div>
    </>
  );
};

export default EmbedLayout;
