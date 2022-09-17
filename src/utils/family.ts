import { isEmpty, isEqual, orderBy } from "lodash";

type SeedMember = {
  id: number;
  name: string;
  children: number[];
  gender: string;
  parents: number[];
};

type FamilyMember = {
  partner?: number;
  layer: number;
} & SeedMember;

export type FamilyMemberWithX = {
  partner?: number;
  layer: number;
  xIndex: number;
} & SeedMember;

export class Family {
  constructor(
    private seedMembers: SeedMember[],
    public familyMembers: FamilyMemberWithX[] = []
  ) {
    const tops = this.findTops();
    if (!tops.length) {
      throw Error("Not top family");
    }
    this.addFamilyMembers(tops);
    this.seedFamilyMembers(tops[0]);
  }
  private seedFamilyMembers(familyMember: FamilyMember) {
    if (isEmpty(familyMember.children)) {
      return;
    }
    familyMember.children.forEach((child) => {
      const oneChild = this.findById(child);
      if (!oneChild) {
        return;
      }
      const result = {
        ...oneChild,
        layer: familyMember.layer + 1,
      };
      const oneChildPartner = this.seedMembers.find((m) => {
        return this.isPartner(m, oneChild);
      });
      if (oneChildPartner) {
        this.addFamilyMembers([
          {
            ...result,
            partner: oneChildPartner.id,
          },
          {
            ...oneChildPartner,
            layer: familyMember.layer + 1,
            partner: oneChild.id,
          },
        ]);
      } else {
        this.addFamilyMembers([result]);
      }
      this.seedFamilyMembers(result);
    });
  }

  private addFamilyMembers(ms: FamilyMember[]) {
    const members = orderBy(ms, "gender");
    let currentIndex =
      this.familyMembers.filter((f) => f.layer === members[0].layer).length + 1;
    members.forEach((m) => {
      this.familyMembers.push({ ...m, xIndex: currentIndex++ });
      this.seedMembers = this.seedMembers.filter((s) => s.id !== m.id);
    });
  }

  private findById(id: number) {
    return this.seedMembers.find((m) => m.id === id);
  }
  private isPartner(a: SeedMember, b: SeedMember) {
    return (
      a.id !== b.id &&
      !isEmpty(a.children) &&
      isEqual(a.children.sort(), b.children.sort())
    );
  }
  private findTops() {
    const canBeTopMembers = this.seedMembers.filter(
      (m) => !isEmpty(m.children) && isEmpty(m.parents)
    );
    let top: FamilyMember[] = [];
    for (let i = 0; i < canBeTopMembers.length; i++) {
      for (let j = i + 1; j < canBeTopMembers.length; j++) {
        if (this.isPartner(canBeTopMembers[i], canBeTopMembers[j])) {
          top = [
            { ...canBeTopMembers[i], partner: canBeTopMembers[j].id, layer: 1 },
            { ...canBeTopMembers[j], partner: canBeTopMembers[i].id, layer: 1 },
          ];
        }
      }
    }
    return top;
  }
}
