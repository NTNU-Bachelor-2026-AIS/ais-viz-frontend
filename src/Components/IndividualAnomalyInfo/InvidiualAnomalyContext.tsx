import type { Dispatch, SetStateAction, useContext } from "react";

import type { IndividualAnomalyInfoProps } from "./IndividualAnomalyInfo";
import { createContext } from "react";

//IndividualAnomalyInfoContextProps contex props, made of IndividualAnomalyInfoProps and a dispatch of setIndividualAnomalyInfoProps.
export interface IndividualAnomalyInfoContextProps {
  individualAnomalyProps: IndividualAnomalyInfoProps | undefined;

  setIndividualAnomalyProps: Dispatch<
    SetStateAction<IndividualAnomalyInfoProps | undefined>
  >;
}

//exports individualanomalyinfo props as context.
export const individualAnomalyContext = createContext<
  IndividualAnomalyInfoContextProps | undefined
>(undefined);
