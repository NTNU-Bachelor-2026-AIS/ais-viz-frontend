import chroma from "chroma-js";

/*
uses chroma-js and returns a gradient from red to green based on values from 0 to 1. for use in signal strength coloring. 
*/
export const signalStrengthGradient = (singalStrenght: number) => {
  const color = chroma.scale(["red", "yellow", "green"]);
  console.log("SIGNAL STRENGTIGNHTIHNTRNHITRNHR" + singalStrenght);
  console.log("COLOR GRADIENT  ", color(singalStrenght));
  return color(singalStrenght);
};
