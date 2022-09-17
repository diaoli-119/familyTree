import React, { useMemo } from "react";
import { FamilyMemberWithX } from "../../utils/family";

const layerHeight = 120;
const xWidth = 250;
const boxWidth = 180;
const boxHeight = 40;

const findMumPositionFromFamily = (
  familyMember: FamilyMemberWithX,
  family: FamilyMemberWithX[],
  left: number
) => {
  const mum = family.find(
    (f) => familyMember.parents.includes(f.id) && f.gender === "female"
  );
  if (!mum) {
    return;
  }
  const mumX = mum.xIndex * xWidth + boxWidth;
  const childX = left + boxWidth / 2;

  const xDif = mumX - childX;
  const yDif = layerHeight - boxHeight;
  const length = (xDif ** 2 + yDif ** 2) ** 0.5;

  const tan = Math.atan2(xDif, yDif);

  const rate = (Math.atan2(xDif, yDif) * 180) / Math.PI;

  return { mum, length, tan, yDif, xDif, rate };
};

export const FamilyMemberBox: React.FC<{
  familyMember: FamilyMemberWithX;
  family: FamilyMemberWithX[];
}> = ({ familyMember, family }) => {
  const { name, gender, partner, layer, xIndex } = familyMember;

  const isGentleMan = gender === "male";

  const marriedGentleMan = isGentleMan && partner;

  const left = xIndex * xWidth - (marriedGentleMan ? xWidth - boxWidth : 0);
  const top = layer * layerHeight;

  const findMumPosition = useMemo(
    () => findMumPositionFromFamily(familyMember, family, left),
    [family, familyMember, left]
  );

  return (
    <>
      {!!findMumPosition && (
        <div
          style={{
            position: "absolute",
            backgroundColor: "black",
            width: 1,
            height: findMumPosition.length,
            left: left + findMumPosition.xDif + boxWidth / 2,
            top: top - findMumPosition.yDif,
            transform: `rotate(${findMumPosition.rate}deg)`,
            transformOrigin: "left top",
          }}
        />
      )}
      <div
        style={{
          left: left,
          top: top,
          color: "black",
          width: boxWidth,
          height: boxHeight,
          backgroundColor: isGentleMan ? "lightblue" : "lightpink",
          position: "absolute",
        }}
      >
        {name}
      </div>
    </>
  );
};
