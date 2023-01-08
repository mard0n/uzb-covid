import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { FeatureCollection, Feature } from "geojson";
import mapboxgl, { GeoJSONSource, Map, Popup } from "mapbox-gl";
import { bbox as turfBbox, centerOfMass as turfCenterOfMass } from "@turf/turf";
import { ZoneFeatureCollection } from "../../types/zone";
import "./Map.css";
import { useAppStore } from "../../App";

export interface MapComponentProps {
  zones?: ZoneFeatureCollection;
  applyLayerZoomFilter?: boolean;
}

const moveToFitBounds = (map: Map, feature: Feature | FeatureCollection) => {
  const bbox = turfBbox(feature) as [number, number, number, number];

  map.fitBounds(bbox, { padding: 100 });
};
const popupGenerator = (feature: Feature) => {
  let statusColor, zoneName, infectedNumber, recoveredNumber, deadNumber;

  const { status, displayNameUz, total } = feature.properties || {};
  let overallStats = total;
  try {
    overallStats = JSON.parse(total);
  } catch (error) {}

  switch (status) {
    case "DANGEROUS":
      statusColor = "#FF4967";
      break;
    case "RISKY":
      statusColor = "#FF9635";
      break;
    case "SAFE":
      statusColor = "#87D03F";
      break;
    default:
      statusColor = "#87D03F";
      break;
  }

  return `
  <div class='custom-popup-style'>
    <div class='title-container'>
      <span class="zone-status-pin" style="background-color: ${statusColor}"></span>
      <h5 class="zone-name" style="color: #242B43">${displayNameUz}</h5>
    </div>
    <p class="data infected" style="color: #EF7C38">${"Infected: "} ${
    overallStats?.infectedNumber
  }</p>
    <p class="data recovered" style="color: #87D03F">${"Recovered: "} ${
    overallStats?.recoveredNumber
  }</p>
    <p class="data dead" style="color: #EA5C73">${"Dead: "} ${
    overallStats?.deadNumber
  }</p>
  </div>
  `;
};

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESSTOKEN;

const MapComponent = forwardRef<any, MapComponentProps>(
  ({ zones, applyLayerZoomFilter = false }, ref) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapReady = useRef(false);
    const map = useRef<Map | null>(null);
    const popup = useRef<Popup | null>(null);
    const [lng, setLng] = useState(64.62);
    const [lat, setLat] = useState(40.93);
    const [zoom, setZoom] = useState(4);

    const unsub = useAppStore.subscribe((state: any) => {
      const zoneObj = zones?.features.find(
        (zone) => zone.properties.id === state.selectedZoneId
      );

      if (!map.current || !zoneObj) return;

      moveToFitBounds(map.current, zoneObj);
    });
    const setSelectedZoneId = useAppStore(
      (state: any) => state.setSelectedZoneId
    );

    useImperativeHandle(
      ref,
      () => {
        return {
          showSpecificZones(zones: ZoneFeatureCollection) {
            if (!map.current) return;

            const zonesSource = map.current.getSource("zones") as GeoJSONSource;
            zonesSource && zonesSource.setData(zones);
          },
          moveToFitBounds: (zones: Feature | FeatureCollection) => {
            if (!map.current) return;

            moveToFitBounds(map.current, zones);
          },
        };
      },
      [map.current]
    );

    useEffect(() => {
      if (map.current) return;

      map.current = new mapboxgl.Map({
        container: mapContainer.current || "",
        style: "mapbox://styles/mapbox/streets-v11",
        center: [lng, lat],
        zoom: zoom,
        minZoom: 4,
        maxZoom: 12,
        // hash: true,
      });

      popup.current = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      });
      return () => {
        unsub();
      };
    }, []);

    useEffect(() => {
      if (!map.current) return;
      map.current.on("load", () => {
        mapReady.current = true;
      });

      if (!map.current || !mapReady.current || !zones) return;
      map.current.addSource("zones", {
        type: "geojson",
        data: zones ?? {
          type: "FeatureCollection",
          features: [],
        },
      });
      map.current.addLayer({
        id: "zones-layer",
        type: "fill",
        source: "zones",
        layout: {},
        paint: {
          "fill-color": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            [
              "case",
              ["==", ["get", "status"], "DANGEROUS"],
              "#FA0303",
              ["==", ["get", "status"], "RISKY"],
              "#FAFF00",
              ["==", ["get", "status"], "SAFE"],
              "#23FF00",
              "#23FF00",
            ],
            [
              "case",
              ["==", ["get", "status"], "DANGEROUS"],
              "#FB3535",
              ["==", ["get", "status"], "RISKY"],
              "#FAFF00",
              ["==", ["get", "status"], "SAFE"],
              "#23FD00",
              "#23FD00",
            ],
          ],
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            [
              "case",
              ["==", ["get", "status"], "DANGEROUS"],
              0.3,
              ["==", ["get", "status"], "RISKY"],
              0.4,
              ["==", ["get", "status"], "SAFE"],
              0.5,
              0.5,
            ],
            [
              "case",
              ["==", ["get", "status"], "DANGEROUS"],
              0.2,
              ["==", ["get", "status"], "RISKY"],
              0.2,
              ["==", ["get", "status"], "SAFE"],
              0.2,
              0.2,
            ],
          ],
        },
      });

      let hoveredFeatureId: string | number | undefined | null = null;
      map.current.on("mousemove", "zones-layer", (e) => {
        if (!e.features?.length || !map.current) return;
        const feature = e.features[0];

        if (hoveredFeatureId !== null) {
          map.current?.setFeatureState(
            { source: "zones", id: hoveredFeatureId },
            { hover: false }
          );
        }
        hoveredFeatureId = feature.id;
        map.current.setFeatureState(
          { source: "zones", id: hoveredFeatureId },
          { hover: true }
        );

        map.current.getCanvas().style.cursor = "pointer";
        const centerCoordinates = turfCenterOfMass(feature).geometry
          .coordinates as [number, number];
        const popupHtml = popupGenerator(feature);

        popup.current
          ?.setLngLat(centerCoordinates)
          .setHTML(popupHtml)
          .addTo(map.current);
      });
      map.current.on("mouseleave", "zones-layer", (e) => {
        if (!map.current) return;

        if (hoveredFeatureId !== null) {
          map.current.setFeatureState(
            { source: "zones", id: hoveredFeatureId },
            { hover: false }
          );
        }
        hoveredFeatureId = null;

        map.current.getCanvas().style.cursor = "";
        popup.current?.remove();
      });

      map.current.on("click", "zones-layer", (e) => {
        if (!map.current || !e.features) return;
        setSelectedZoneId(e.features[0]?.properties?.id);
        moveToFitBounds(map.current, e.features[0]);
      });
      // If all zones are shown, apply usual zoom step and placeType based filter
      applyLayerZoomFilter &&
        map.current?.setFilter("zones-layer", [
          "step",
          ["zoom"],
          ["==", ["get", "placeType"], "COUNTRY"],
          5,
          ["==", ["get", "placeType"], "REGION"],
          7,
          ["match", ["get", "placeType"], ["DISTRICT", "CITY"], true, false],
        ]);
      // else show all zones. Later on selecting childzone and parent zone should be prevented
      // to avoid zone overlaps
      // });

      return () => {
        if (map.current?.getSource("zones")) {
          map.current.removeLayer("zones-layer");
          map.current.removeSource("zones");
        }
      };
    }, [zones, mapReady.current]);

    // useEffect(() => {
    //   map.current?.on("load", () => {

    //   });
    //   return () => {};
    // }, [applyLayerZoomFilter]);

    return (
      <div
        ref={mapContainer}
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: "100%",
        }}
      />
    );
  }
);

export default MapComponent;
