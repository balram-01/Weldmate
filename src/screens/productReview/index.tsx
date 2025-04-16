import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Button } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import DocumentPicker from "@react-native-documents/picker";
import { Rating } from "react-native-ratings";
import { SafeAreaView } from "react-native";

const ProductReview = () => {
  const [ratings, setRatings] = useState({
    overall: 3,
    valueForMoney: 2,
    quality: 3,
    features: 2,
  });
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    try {
      const result = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images],
      });
      setImage(result.uri);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log("User  cancelled image picker");
      } else {
        console.log("Unknown error: ", err);
      }
    }
  };

  const handleRatingChange = (key, rating) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [key]: rating,
    }));
  };

  return (
    <ScrollView
      contentContainerStyle={{ padding: 20, backgroundColor: "#fff" }}
    >
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TouchableOpacity>
          <Icon
            name="arrow-back"
            size={24}
            color="black"
            style={{ paddingRight: 10 }}
          />
        </TouchableOpacity>
        <View style={styles.searchBox}>
          <Icon
            name="search"
            size={20}
            color="#aaa"
            style={{ marginHorizontal: 10 }}
          />
          <TextInput placeholder="Search Here" style={styles.searchInput} />
          <TouchableOpacity>
            <Icon
              name="photo-camera"
              size={20}
              color="#020403"
              style={{ marginHorizontal: 0 }}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Icon
            name="qr-code-scanner"
            size={24}
            color="black"
            style={{ paddingLeft: 10 }}
          />
        </TouchableOpacity>
      </View>

      {/* Product Image */}
      <Image
        source={{ uri: "https://dummyimage.com/600x400/000/fff" }}
        style={{ width: "100%", height: 150, resizeMode: "contain" }}
      />
      <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 10 }}>
        Product Review Form
      </Text>

      {/* Ratings Section */}
      <Text style={{ marginTop: 10, fontWeight: "bold" }}>
        How would you rate the product overall?
      </Text>
      <View style={styles.ratingContainer}>
        <Rating
          type="custom"
          ratingCount={5}
          imageSize={30}
          startingValue={ratings.overall}
          onFinishRating={(rating) => handleRatingChange("overall", rating)}
          tintColor="#fff"
          ratingBackgroundColor="#ccc"
          ratingColor="#e6581b"
        />
      </View>

      <Text style={{ marginTop: 10, fontWeight: "bold" }}>
        Please rate the individual product features
      </Text>

      {[
        { label: "Value for Money", key: "valueForMoney" },
        { label: "Overall Quality", key: "quality" },
        { label: "Features & Functionality", key: "features" },
      ].map(({ label, key }) => (
        <View key={key} style={{ marginBottom: 10 }}>
          <Text style={{ fontWeight: "bold" }}>{label}</Text>
          <View style={styles.ratingContainer}>
            <Rating
              type="custom"
              ratingCount={5}
              imageSize={30}
              startingValue={ratings[key]}
              onFinishRating={(rating) => handleRatingChange(key, rating)}
              tintColor="#fff"
              ratingBackgroundColor="#ccc"
              ratingColor="#e6581b"
            />
          </View>
        </View>
      ))}

      {/* Review Inputs */}
      <Text style={{ marginTop: 10, fontWeight: "bold" }}>Review Summary</Text>
      <TextInput
        placeholder="What is most important to know?"
        style={styles.input}
      />

      <Text style={{ fontWeight: "bold" }}>Your Review</Text>
      <TextInput
        placeholder="What did you like or dislike?"
        style={[styles.input, { height: 80, textAlignVertical: "top" }]}
        multiline
      />

      {/* Image Upload */}
      <Text style={{ marginTop: 10, fontWeight: "bold" }}>
        Please upload product photos
      </Text>
      <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
        <Text style={{ color: "#e6581b" }}>Choose File or drop here</Text>
      </TouchableOpacity>
      {image && (
        <Image
          source={{ uri: image }}
          style={{ width: 100, height: 100, marginTop: 10 }}
        />
      )}

      {/* Contact Info */}
      <Text style={{ marginTop: 10, fontWeight: "bold" }}>Contact Info</Text>
      <TextInput placeholder="Name" style={styles.input} />
      <TextInput
        placeholder="Email"
        style={styles.input}
        keyboardType="email-address"
      />
      <TouchableOpacity>
        <Button
          mode="contained"
          style={styles.submitButton}
          labelStyle={styles.submitButtonText}
        >
          Submit
        </Button>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = {
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#00000",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
  },
  searchInput: {
    flex: 1,
    paddingVertical: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  uploadButton: {
    borderWidth: 1,
    borderColor: "#e6581b",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: "#e6581b",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#000",
  },
  ratingContainer: {
    alignSelf: "flex-start",
    marginTop: 5,
  },
};

export default ProductReview;
