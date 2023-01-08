import { ZoneFeature } from "../types/zone";

export const getSelectedZoneObjById = (
  id: string,
  zones: ZoneFeature[] = []
) => {
  return zones.find((zone) => zone.properties.id === id);
};
