import { FeatureCollection, Feature, Geometry } from "geojson";

export type ZoneProperties = {
  id: string;
  displayName: string;
  displayNameUz: string;
  displayNameRu: string;
  placeType: "REGION" | "COUNTRY" | "CITY" | "DISTRICT";
  status: "SAFE" | "RISKY" | "DANGEROUS";
  parentZone: string;
  parentZoneId: string;
  childZoneIds: string[];
  alias: string[];
  total: {
    infectedNumber: string;
    recoveredNumber: string;
    deadNumber: string;
  };
  history: {
    date: string;
    infectedNumber: number;
    recoveredNumber: number;
    deadNumber: number;
  }[];
};

export type ZoneFeature = Feature<Geometry, ZoneProperties>;
export type ZoneFeatureCollection = FeatureCollection<Geometry, ZoneProperties>;

export type ZoneResType = { zones: ZoneFeatureCollection };
