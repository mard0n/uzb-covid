import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Outlet, useLoaderData } from "react-router-dom";
import SwipeableBottomSheet from "react-swipeable-bottom-sheet";
import { HistoryGraph, Map, SearchInput } from "../../components";
import { ZoneFeatureCollection } from "../../types/zone";
import "./Layout.css";
import logo from "../../assets/logo.svg";
import { useAppStore } from "../../App";
import { getParentZonesString } from "../../utils/getParentZonesString";
import { getZoneStatusProps } from "../../utils/getZoneStatusProps";

interface LayoutProps {}

const Layout: React.FC<LayoutProps> = () => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const zones = useLoaderData() as ZoneFeatureCollection | undefined;
  const selectedZoneId = useAppStore((state: any) => state.selectedZoneId);
  const selectedZone = zones?.features.find(
    (zone) => zone.properties.id === selectedZoneId
  );

  if (!zones) {
    return <>loading...</>;
  }

  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = urlSearchParams.getAll("zone");

  const handleSwipeableChange = (isOpen: boolean) =>
    setIsBottomSheetOpen(isOpen);

  return (
    <>
      <div className="hidden md:flex h-screen w-screen ">
        <div className="w-[min(45vw,600px)] z-10 h-full shadow-[0px_4px_40px_rgba(0,30,89,0.09)] px-10 py-6">
          <div className="mb-3 inline-block">
            <Link to="/">
              <img src={logo} alt="CovidUz" />
            </Link>
          </div>
          <div className="mb-8">
            <SearchInput data={zones} />
          </div>
          {selectedZone ? (
            <>
              <div className="flex justify-between mb-8">
                <div>
                  <div className="font-medium text-2xl">
                    {selectedZone.properties.displayName}
                  </div>
                  <div className="text-[#8C93B2]">
                    {getParentZonesString(selectedZone, zones, [])}
                  </div>
                </div>
                <div
                  className="px-4 py-2 rounded-md self-start"
                  style={{
                    color: getZoneStatusProps(selectedZone.properties.status)
                      .textInWhiteBg,
                    backgroundColor: getZoneStatusProps(
                      selectedZone.properties.status
                    ).bgColor,
                  }}
                >
                  {getZoneStatusProps(selectedZone.properties.status).text}
                </div>
              </div>
              <div className="mb-8">
                <h3 className="mb-4 text-lg font-medium">Up to this day</h3>
                <div className="flex gap-4 justify-between">
                  <div className="p-4 text-center flex-grow rounded-lg bg-[#F0F3FE]">
                    <p className="text-sm font-medium text-[#2E409E] mb-2">
                      Infected
                    </p>
                    <div className="text-2xl font-medium mb-6 text-[#FF9635]">
                      {selectedZone.properties.total.infectedNumber}
                    </div>
                  </div>
                  <div className="p-4 text-center flex-grow rounded-lg bg-[#F0F3FE]">
                    <p className="text-sm font-medium text-[#2E409E] mb-2">
                      Recovered
                    </p>
                    <div className="text-2xl font-medium mb-6 text-[#87D03F]">
                      {selectedZone.properties.total.recoveredNumber}
                    </div>
                  </div>
                  <div className="p-4 text-center flex-grow rounded-lg bg-[#F0F3FE]">
                    <p className="text-sm font-medium text-[#2E409E] mb-2">
                      Deceased
                    </p>
                    <div className="text-2xl font-medium mb-6 text-[#FF4967]">
                      {selectedZone.properties.total.deadNumber}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-8">
                <h3 className="mb-4 text-lg font-medium">Overall Statistics</h3>
                <HistoryGraph data={selectedZone.properties.history} />
              </div>
            </>
          ) : (
            <div>
              <div></div>
            </div>
          )}
        </div>
        <div className="grow h-full relative">
          <Map zones={zones} applyLayerZoomFilter={!params.length} />
          {params.length ? (
            <></>
          ) : (
            // <div className="absolute z-10 top-[10px] right-[10px]">
            //   Open big map
            // </div>
            <Link className="absolute z-10 top-[10px] right-[10px]" to="/embed">
              Embed
            </Link>
          )}
        </div>
      </div>
      <div className="block md:hidden h-screen w-screen">
        <div className="h-full w-full">
          <Map zones={zones} applyLayerZoomFilter={!params.length} />
        </div>
        <SwipeableBottomSheet
          overflowHeight={200}
          shadowTip={false}
          topShadow={false}
          overlay={false}
          scrollTopAtClose={true}
          open={isBottomSheetOpen}
          onChange={handleSwipeableChange}
          style={{ zIndex: 20 }}
          bodyStyle={{
            borderTopLeftRadius: "1.5rem",
            borderTopRightRadius: "1.5rem",
            boxShadow: "0px -10px 40px rgba(0, 30, 89, 0.09)",
            padding: "32px 20px",
            backgroundColor: "white",
          }}
        >
          <div className="max-h-[calc(100vh*0.65)] min-h-[136px]">
            <div className="bottom-sheet-notch" />
            <Outlet />
          </div>
        </SwipeableBottomSheet>
      </div>
    </>
  );
};

export default Layout;
