import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Outlet, useLoaderData } from "react-router-dom";
import SwipeableBottomSheet from "react-swipeable-bottom-sheet";
import {
  HistoryGraph,
  Map,
  Restrictions,
  SearchInput,
  Table,
} from "../../components";
import { ZoneFeature, ZoneFeatureCollection } from "../../types/zone";
import "./Layout.css";
import logo from "../../assets/logo.svg";
import { useAppStore } from "../../App";
import { getParentZonesString } from "../../utils/getParentZonesString";
import { getZoneStatusProps } from "../../utils/getZoneStatusProps";
import virusSvg from "../../assets/virus.svg";

interface LayoutProps {
  zones: ZoneFeatureCollection | undefined;
}

const Layout: React.FC<LayoutProps> = ({ zones }) => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const selectedZoneId = useAppStore((state: any) => state.selectedZoneId);
  const selectedZone = zones?.features.find(
    (zone) => zone.properties.id === selectedZoneId
  );

  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = urlSearchParams.getAll("zone");

  const handleSwipeableChange = (isOpen: boolean) =>
    setIsBottomSheetOpen(isOpen);

  const Callbanner = () => {
    return (
      <div
        className="mb-8 bg-[#4863F4] rounded-2xl text-white p-4 flex justify-between items-center cursor-pointer"
        onClick={() => window.open("tel:1003", "_blank")}
      >
        <div className="flex">
          <div className="mr-4">
            <img src={virusSvg} alt="Virus" />
          </div>
          <div className="flex flex-col justify-center">
            <div className="font-medium truncate">
              Covid-19 simptomini sezyapsizmi?
            </div>
            <div className="opacity-50 truncate">
              Covid-19 markaziga qo'ng'iroq qiling
            </div>
          </div>
        </div>
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </div>
      </div>
    );
  };
  const OverallStats = ({ selectedZone }: { selectedZone: ZoneFeature }) => {
    return (
      <div className="mb-8">
        <h3 className="mb-4 text-lg font-medium">Hozirgi kungacha</h3>
        <div className="flex gap-4 justify-between">
          <div className="p-4 text-center flex-grow rounded-lg bg-[#F0F3FE]">
            <p className="text-sm font-medium text-[#2E409E] mb-2">
              Kasallangan
            </p>
            <div className="text-2xl font-medium mb-6 text-[#FF9635]">
              {selectedZone.properties.total.infectedNumber}
            </div>
          </div>
          <div className="p-4 text-center flex-grow rounded-lg bg-[#F0F3FE]">
            <p className="text-sm font-medium text-[#2E409E] mb-2">Sog'aygan</p>
            <div className="text-2xl font-medium mb-6 text-[#87D03F]">
              {selectedZone.properties.total.recoveredNumber}
            </div>
          </div>
          <div className="p-4 text-center flex-grow rounded-lg bg-[#F0F3FE]">
            <p className="text-sm font-medium text-[#2E409E] mb-2">
              Vafot etgan
            </p>
            <div className="text-2xl font-medium mb-6 text-[#FF4967]">
              {selectedZone.properties.total.deadNumber}
            </div>
          </div>
        </div>
      </div>
    );
  };
  const ZoneName = ({ selectedZone }: { selectedZone: ZoneFeature }) => {
    return (
      <div className="flex justify-between mb-8">
        <div>
          <div className="font-medium text-2xl">
            {selectedZone.properties.displayNameUz}
          </div>
          {zones && (
            <div className="text-[#8C93B2]">
              {getParentZonesString(selectedZone, zones, [])}
            </div>
          )}
        </div>
        <div
          className="px-4 py-2 rounded-md self-start"
          style={{
            color: getZoneStatusProps(selectedZone.properties.status)
              .textInWhiteBg,
            backgroundColor: getZoneStatusProps(selectedZone.properties.status)
              .bgColor,
          }}
        >
          {getZoneStatusProps(selectedZone.properties.status).text}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="hidden md:flex h-screen w-screen ">
        <div className="w-[min(45vw,600px)] z-10 h-full overflow-scroll shadow-[0px_4px_40px_rgba(0,30,89,0.09)] px-10 py-6">
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
              <ZoneName selectedZone={selectedZone} />
              <OverallStats selectedZone={selectedZone} />
              <div className="mb-8">
                <h3 className="mb-4 text-lg font-medium">Statistika</h3>
                <HistoryGraph data={selectedZone.properties.history} />
              </div>
              <div className="mb-8">
                <Restrictions zoneStatus={selectedZone.properties.status} />
              </div>
              <Callbanner />
              <div className="mb-8">
                <Table
                  zones={zones}
                  selectedZoneId={selectedZoneId}
                  numberOfVisibleChildZones={4}
                />
              </div>
            </>
          ) : (
            zones && (
              <div>
                <div className="mb-8">
                  <Table
                    zones={zones}
                    selectedZoneId={selectedZoneId}
                    numberOfVisibleChildZones={100}
                  />
                </div>
                <Callbanner />
              </div>
            )
          )}
        </div>
        <div className="grow h-full relative">
          <Map zones={zones} applyLayerZoomFilter={!params.length} />
          {/* {params.length ? (
            <></>
          ) : (
            // <div className="absolute z-10 top-[10px] right-[10px]">
            //   Open big map
            // </div>
            <Link className="absolute z-10 top-[10px] right-[10px]" to="/embed">
              Embed
            </Link>
          )} */}
        </div>
      </div>
      <div className="block md:hidden h-screen w-screen">
        <div className="h-full w-full">
          <Map zones={zones} applyLayerZoomFilter={!params.length} />
          <div className="mb-8 px-2 pt-2">
            <SearchInput data={zones} />
          </div>
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
            {selectedZone ? (
              <>
                <ZoneName selectedZone={selectedZone} />
                <OverallStats selectedZone={selectedZone} />
                <div className="mb-8">
                  <h3 className="mb-4 text-lg font-medium">Statistika</h3>
                  <HistoryGraph data={selectedZone.properties.history} />
                </div>
                <div className="mb-8">
                  <Restrictions zoneStatus={selectedZone.properties.status} />
                </div>
                <Callbanner />
                <div className="mb-8">
                  <Table
                    zones={zones}
                    selectedZoneId={selectedZoneId}
                    numberOfVisibleChildZones={4}
                  />
                </div>
              </>
            ) : (
              zones && (
                <div>
                  <div className="mb-8">
                    <Table
                      zones={zones}
                      selectedZoneId={selectedZoneId}
                      numberOfVisibleChildZones={100}
                    />
                  </div>
                  <Callbanner />
                </div>
              )
            )}
          </div>
        </SwipeableBottomSheet>
      </div>
    </>
  );
};

export default Layout;
