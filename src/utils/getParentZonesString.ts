import { ZoneFeatureCollection, ZoneFeature } from "../types/zone";

export const getParentZonesString = (
  zone: ZoneFeature,
  zones: ZoneFeatureCollection,
  parentZoneList: string[] = []
): string => {
  const parentZone = zones.features.find(
    (z) => z.properties?.id === zone.properties?.parentZoneId
  );
  if (parentZone) {
    parentZoneList.push(parentZone.properties.displayName);
    return getParentZonesString(parentZone, zones, parentZoneList);
  } else {
    return parentZoneList.join(", ");
  }
};
