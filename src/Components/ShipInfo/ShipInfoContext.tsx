import type { Dispatch, SetStateAction, useContext } from "react";

import type { ShipInfoProps } from "./ShipInfo";
import { createContext } from "react";

export interface shipInfoContextPropS {
  shipInfoProps: ShipInfoProps | undefined;

  setShipInfoProps: Dispatch<SetStateAction<ShipInfoProps | undefined>>;
}

export const shipInfoContext = createContext<shipInfoContextPropS | undefined>(
  undefined,
);
