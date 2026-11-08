// blobOne and blobTwo: one colour per light stage, sky-0 → sky-5
// night: [blob one, blob two] on the hero stage
const BLOB_PALETTES = {
  current: {
    blobOne: ["#E8B888", "#E4CFD1", "#EFE3D3", "#D7AA84", "#5E85A2", "#F5B595"],
    blobTwo: ["#B6B4C2", "#FED4C5", "#CFC4C2", "#E5A898", "#FDB368", "#E7A4AB"],
    night: ["#334970", "#8AA4B5"],
  },
  tonal: {
    blobOne: ["#FFD4AA", "#E79991", "#E5BA94", "#AAB0AA", "#68A2C1", "#89AAB6"],
    blobTwo: ["#FFFFFF", "#F2DEDC", "#F2E7DE", "#D7D9D7", "#ADC5D3", "#C2CFD4"],
    night: ["#334970", "#2A4466"],
  },
  neighbours: {
    blobOne: ["#EBC4C0", "#EAD5C2", "#C5C8C5", "#93B6C9", "#ACBFC6", "#93B6C9"],
    blobTwo: ["#F5D9C8", "#FDEEDF", "#EBC4C0", "#EAD5C2", "#C5C8C5", "#93B6C9"],
    night: ["#334970", "#547598"],
  },
  sunrise: {
    blobOne: ["#FFD7AF", "#E79E96", "#E4BD9A", "#ADB2AD", "#6DA3C1", "#8DACB7"],
    blobTwo: ["#F5B595", "#F2B8A8", "#EDC2A6", "#E2BFAE", "#C9B8C2", "#C2BCC4"],
    night: ["#334970", "#6B5A78"],
  },
};

export const DEFAULT_BLOB_PALETTE = "neighbours";

export default BLOB_PALETTES;
