import { ZoneFeature } from "../types/zone";

export const getChildZones = (
  childrenIds: string[] | undefined,
  zones: ZoneFeature[]
) => {
  return zones.filter((zone) => childrenIds?.includes(zone.properties?.id));
};
