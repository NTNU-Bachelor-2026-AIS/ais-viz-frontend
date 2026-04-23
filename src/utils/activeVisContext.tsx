import { createContext } from "react";

/*
VisType is a type that is what visualization methods that are allowed to change between. 
*/
export type VisType = "clustering" | "heatmap" | "anomalyGroup";

/*
interface that sets activevis that is of vistype and its setmethod. 
*/
interface visContextType {
  activeVis: VisType;
  setActiveVis: (v: VisType) => void;
}

/*
creates a context of visContextType.
*/
export const LayerContext = createContext<visContextType | undefined>(
  undefined,
);
