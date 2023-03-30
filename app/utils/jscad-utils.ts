const STLserializer = require("@jscad/stl-serializer");
const saveAs = require("file-saver");

/**
 * Save STL file
 * @param filename
 * @param geometries
 */
export const saveSTL = (filename: string, geometries: Geom3[]) => {
  const rawData = STLserializer.serialize({ binary: true }, geometries);
  const blob = new Blob(rawData);
  saveAs(blob, filename + ".stl");
};
