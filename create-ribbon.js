const fs = require("fs");

function createAttribute(props) {
  let patch = "";
  let x = props.x;
  let y = props.y;
  for (i = 0; i < props.limit; i++) {
    const point = `${x} ${y} `;
    patch += point;
    x += props.dx;
    if (props.increaseFirst) {
      if (i % 4 < 2) y += props.dy;
      else y -= props.dy;
    } else {
      if (i % 4 < 2) y -= props.dy;
      else y += props.dy;
    }
  }
  return props.dPrefix + patch + props.dSuffix;
}

function createPathTag(dStart, dEnd, duration, color) {
  const prefix1 = `<path d="" fill="${color}"><animate attributeName="d" keyTimes="0;0.5;1" dur="`;
  const prefix2 = '" repeatCount="indefinite" values="';
  const prefix3 = '"></animate></path>';
  return prefix1 + duration + prefix2 + dStart + dEnd + dStart + prefix3;
}

function createSvgFileData(fileName, props) {
  const svgTagOpen = `<svg viewBox="0 15 ${props.limit * 10} 10" xmlns="http://www.w3.org/2000/svg">`;
  const svgTagClose = "</svg>";

  // ---- CREATE PATH START ----
  const pathStart = createAttribute(props);

  // ---- CREATE PATH END ----
  props.y = 30;
  props.increaseFirst = false;
  const pathEnd = createAttribute(props);

  // ---- CREATE PATH TAGS ----
  const pathTags = props.durations.map((duration, index) => {
    return createPathTag(pathStart, pathEnd, duration, props.colors[index]);
  });

  // ---- CREATE FILE DATA ----
  const fileData = svgTagOpen + pathTags.join("") + svgTagClose;
  fs.writeFile(fileName, fileData, () => {});
}

function getProps() {
  return {
    x: 10,
    dx: 10,
    y: 10,
    dy: 10,
    colors: ["rgba(112, 239, 222, 0.5)", "rgba(215, 183, 253, 0.5)"],
    durations: ["16s", "27s"],
    increaseFirst: true,
    dPrefix: "M0 20 Q",
    dSuffix: "Z;",
    limit: 28, // = 2 x number of nodes required
  };
}

createSvgFileData("ribbon.svg", getProps());
