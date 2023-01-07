import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Outlet, useLoaderData } from "react-router-dom";
import SwipeableBottomSheet from "react-swipeable-bottom-sheet";
import { Map, SearchInput } from "../../components";
import { ZoneFeatureCollection } from "../../types/zone";
import "./Layout.css";
import logo from "../../assets/logo.svg";

interface LayoutProps {}

const Layout: React.FC<LayoutProps> = () => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const zones = useLoaderData() as ZoneFeatureCollection | undefined;

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
          <div>
            <SearchInput data={zones} />
          </div>
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
