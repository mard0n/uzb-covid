export const getZoneStatusProps = (status: "SAFE" | "RISKY" | "DANGEROUS") => {
  let textColorInWhite: string = "",
    textColorInBlue: string = "",
    text: string = "",
    bgColor: string = "";
  switch (status) {
    case "DANGEROUS":
      textColorInWhite = "#EA5C73";
      textColorInBlue = "#FF4967";
      text = "Xavfli";
      bgColor = "#ff0c0c26";
      break;
    case "RISKY":
      textColorInWhite = "#EF7C38";
      textColorInBlue = "#FF9635";
      text = "Extiyot";
      bgColor = "#ffeb0159";
      break;
    case "SAFE":
      textColorInWhite = "#87D03F";
      textColorInBlue = "#87D03F";
      text = "Xavfsiz";
      bgColor = "#8ff8293d";
      break;
    default:
      break;
  }
  return {
    textInWhiteBg: textColorInWhite,
    textInBlueishBg: textColorInBlue,
    text,
    bgColor: bgColor,
  };
};
