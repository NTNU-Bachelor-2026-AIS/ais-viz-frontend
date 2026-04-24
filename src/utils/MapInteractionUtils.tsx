import type { Dispatch, SetStateAction } from "react";
import type { ShipInfoProps } from "../Components/ShipInfo/ShipInfo";
import type { PickingInfo } from "@deck.gl/core";
import { shipInfoContext } from "../Components/ShipInfo/ShipInfoContext";
import { getBaseStations } from "../api/posts";

type setShipInfoType = Dispatch<SetStateAction<ShipInfoProps | undefined>>;
export const setShipInfoOnClick = (
  setShipInfo: setShipInfoType,
  info: PickingInfo<any>,
) => {
  setShipInfo({
    id: info?.properties.id,
    lastActivityAt: info?.properties.lastActivityAt,
    mmsi: info?.properties.mmsi,
    startedAt: info?.properties.startedAt,
    anomalyType: info?.properties.type,
    location: info.geometry?.coordinates,
  });
};

/*
Hardcoded a map of 1-8 of the basestation and their coordinates for use in getting basestation coordinates in layers. 
*/
export const mapBaseStationToCoords = async () => {
  const basestations = await getBaseStations();
  const indexToBaseStationCoords = new Map([
    [1, basestations.features[0].geometry.coordinates],
    [2, basestations.features[1].geometry.coordinates],
    [3, basestations.features[2].geometry.coordinates],
    [4, basestations.features[3].geometry.coordinates],
    [5, basestations.features[4].geometry.coordinates],
    [6, basestations.features[5].geometry.coordinates],
    [7, basestations.features[6].geometry.coordinates],
    [8, basestations.features[7].geometry.coordinates],
  ]);

  return indexToBaseStationCoords;
};
