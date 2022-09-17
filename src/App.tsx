import React from "react";
import "./App.css";
import { FamilyMemberBox } from "./common/box/FamilyBox";
import { Family } from "./utils/family";
import { familyTree } from "./common/familyTreeFile.js";

function App() {
  const family = new Family(familyTree);

  return (
    <div className="container">
      {family.familyMembers.map((member) => {
        return (
          <FamilyMemberBox
            key={member.id}
            familyMember={member}
            family={family.familyMembers}
          />
        );
      })}
    </div>
  );
}

export default App;
