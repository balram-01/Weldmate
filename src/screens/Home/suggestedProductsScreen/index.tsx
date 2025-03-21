import React from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import ProductList from "./productList";
import { productImages } from "../../../images";


const relatedProducts = [
  {
    id: "1",
    name: "Lincoln Power Wave S500",
    price: "₹1,200,000.00 – ₹1,800,000.00",
    image: productImages.product2,
  },
  {
    id: "2",
    name: "Megmeet DEX DM3000",
    price: "₹70,000.00 – ₹95,000.00",
    image: productImages.product1,
  },
];

const trendingProducts = [
  {
    id: "3",
    name: "Idealarc DC1000",
    price: "₹40,000.00 – ₹280,000.00",
    image:  productImages.product1,
  },
  {
    id: "4",
    name: "MIG 200",
    price: "₹45,000.00 – ₹85,000.00",
    image:  productImages.product2,
  },
];

const SuggestedProductsScreen = () => {
  return (
    <View>
  
        <ProductList title="Related to items you have viewed" products={relatedProducts} />
        <ProductList title="Based on your recent shopping trends" products={trendingProducts} />
    
    </View>
  );
};

export default SuggestedProductsScreen;