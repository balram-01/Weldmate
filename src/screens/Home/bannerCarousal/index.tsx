import * as React from "react";
import { Dimensions, View, Image, StyleSheet } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";



const BannerCarousel = ({ bannerData ,width}) => {
  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  return (
    <View style={styles.container}>
      <Carousel
        ref={ref}
        loop
        width={width}
        height={200}
        autoPlay
        autoPlayInterval={3000}
        data={bannerData}
        onProgressChange={progress}
        scrollAnimationDuration={800}
        renderItem={({ item }) => (
          <Image source={item.image} style={styles.bannerImage} />
        )}
      />

      <Pagination.Basic
        progress={progress}
        data={bannerData}
        dotStyle={styles.dot}
        containerStyle={styles.paginationContainer}
        onPress={onPressPagination}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 10 },
  bannerImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  dot: {
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 50,
    width: 10,
    height: 10,
  },
});

export default BannerCarousel;
