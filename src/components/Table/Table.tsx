import React, { useState, useContext, useEffect } from "react";
import { useAppStore } from "../../App";
import { ZoneFeatureCollection } from "../../types/zone";
import { getChildZones } from "../../utils/getChildZones";
import { getSelectedZoneObjById } from "../../utils/getSelectedZoneObj";

export interface ChildZonesProps {
  zones: ZoneFeatureCollection;
  selectedZoneId: string;
  numberOfVisibleChildZones: number;
}

const ChildZones: React.FC<ChildZonesProps> = ({
  zones,
  selectedZoneId,
  numberOfVisibleChildZones = 4,
}) => {
  const setSelectedZoneId = useAppStore(
    (state: any) => state.setSelectedZoneId
  );
  const selectedZone = getSelectedZoneObjById(selectedZoneId, zones.features);
  const [numberOfVisibleCells, setNumberOfVisibleCells] = useState(
    numberOfVisibleChildZones
  );


  const defaultZone = zones.features.find(
    (zone) => zone?.properties?.alias?.indexOf("Uzbekistan") > -1
  );

  // console.log("selectedZone", selectedZone);
  // console.log("defaultZone", defaultZone);

  const childZones = getChildZones(
    selectedZone
      ? selectedZone?.properties?.childZoneIds
      : defaultZone?.properties?.childZoneIds,
    zones.features
  );

  // console.log("childZones", childZones);
  return childZones.length ? (
    <div className="mt-4 mb-4">
      <h3 className="mb-4 text-lg font-medium">Sub zones</h3>
      <div>
        <div className="flex mb-4">
          <div className="w-6/12">
            <p className="whitespace-nowrap overflow-hidden text-ellipsis uppercase text-[#777FA9] text-xs font-medium">
              Zone name
            </p>
          </div>
          <div className="w-2/12 ">
            <p className="text-center whitespace-nowrap overflow-hidden text-ellipsis uppercase text-[#777FA9] text-xs font-medium">
              Infected
            </p>
          </div>
          <div className="w-2/12 ">
            <p className="text-center whitespace-nowrap overflow-hidden text-ellipsis uppercase text-[#777FA9] text-xs font-medium">
              Recovered
            </p>
          </div>
          <div className="w-2/12 ">
            <p className="text-center whitespace-nowrap overflow-hidden text-ellipsis uppercase text-[#777FA9] text-xs font-medium">
              Deceased
            </p>
          </div>
        </div>
        {childZones.map(
          (zone, index: number) =>
            index + 1 <= numberOfVisibleCells && (
              <div key={zone.properties.id} className="flex my-4">
                <div className="w-6/12">
                  <p
                    className="whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer text-[#4863F4] hover:text-[#1a3cf4] font-medium"
                    onClick={() => setSelectedZoneId(zone.properties.id)}
                  >
                    {zone.properties.displayName}
                  </p>
                </div>
                <div className="w-2/12">
                  <p className="text-center whitespace-nowrap overflow-hidden text-ellipsis">
                    {zone?.properties?.total?.infectedNumber}
                  </p>
                </div>
                <div className="w-2/12">
                  <p className="text-center whitespace-nowrap overflow-hidden text-ellipsis">
                    {zone?.properties?.total?.recoveredNumber}
                  </p>
                </div>
                <div className="w-2/12">
                  <p className="text-center whitespace-nowrap overflow-hidden text-ellipsis">
                    {zone?.properties?.total?.deadNumber}
                  </p>
                </div>
              </div>
            )
        )}
      </div>
      {childZones.length > numberOfVisibleCells && (
        <div className="mt-2 flex justify-center">
          <button
            className="mx-auto rounded-2xl px-4 py-1"
            color="primary"
            onClick={() => {
              setNumberOfVisibleCells(childZones.length);
            }}
          >
            Show more
          </button>
        </div>
      )}
    </div>
  ) : (
    <></>
  );
};

export default ChildZones;
