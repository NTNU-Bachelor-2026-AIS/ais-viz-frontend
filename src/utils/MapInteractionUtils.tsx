import type { Dispatch, SetStateAction } from "react";
import type { ShipInfoProps } from "../Components/ShipInfo/ShipInfo";
import type { PickingInfo } from "@deck.gl/core";
import { shipInfoContext } from "../Components/ShipInfo/ShipInfoContext";

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
