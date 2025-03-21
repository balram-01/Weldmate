import React from "react";
import { View, ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

type WavyHeaderProps = {
  customStyles?: ViewStyle;
  customHeight?: number;
  customTop?: number;
  customBgColor?: string;
  customWavePattern?: string;
};

const WavyHeader: React.FC<WavyHeaderProps> = ({
  customStyles = {},
  customHeight = 200,
  customTop = 0,
  customBgColor = "#6200ea",
  customWavePattern = "M0,160L80,144C160,128,320,96,480,106.7C640,117,800,171,960,181.3C1120,192,1280,160,1360,144L1440,128V320H0Z"
}) => {
  return (
    <View style={[{ height: customHeight }, customStyles]}>
      <View style={{ backgroundColor: customBgColor, height: "100%" }}>
        <Svg
          height="60%"
          width="100%"
          viewBox="0 0 1440 320"
          style={{ position: "relative", top: customTop }}
        >
          <Path fill={customBgColor} d={customWavePattern} />
        </Svg>
      </View>
    </View>
  );
};

export default WavyHeader;