import type { Dispatch, SetStateAction, useContext } from "react";

import type { ShipInfoProps } from "./ShipInfo";
import { createContext } from "react";


//shipinfo contex props, made of shipinfoprops and a dispatch of setshipinfoprops. . 
export interface shipInfoContextPropS {
  shipInfoProps: ShipInfoProps | undefined;

  setShipInfoProps: Dispatch<SetStateAction<ShipInfoProps | undefined>>;
}

//exports shipinfocontext. 
export const shipInfoContext = createContext<shipInfoContextPropS | undefined>(
  undefined,
);
