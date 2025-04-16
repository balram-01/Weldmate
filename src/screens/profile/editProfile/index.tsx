import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  TouchableOpacity,
  useColorScheme,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActionSheetIOS
} from "react-native";
import { TextInput, Text, useTheme, Button, Avatar, Snackbar } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Dropdown } from "react-native-element-dropdown";
import { Country, State, City } from "country-state-city";
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { useUpdateUserMutation } from "../../../redux/api/user";
import { useRoute } from "@react-navigation/native";
import { noProfile_image } from "../../../images";
const EditProfileScreen = ({navigation}) => {
  const theme = useTheme();
  const isDarkMode = useColorScheme() === "dark";
 const route=useRoute()
 const {id:userId}=route.params
  // Input states
  const [fullName, setFullName] = useState("Matilda Brown");
  const [phoneNumber, setPhoneNumber] = useState("+918547123652");
  const [email, setEmail] = useState("matildabrown@gmail.com");
  const [businessName, setBusinessName] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [profilePicture, setProfilePicture] = useState();

  // Lists for dropdowns
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);

  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarError, setSnackbarError] = useState(false);
   const [updateUser]=useUpdateUserMutation()
  const imagePickerOptions = {
    mediaType: 'photo',
    quality: 1,
    maxWidth: 500,
    maxHeight: 500,
  };

  // Validation function
  const validateForm = () => {
    if (!fullName.trim()) return "Full Name is required";
    if (!phoneNumber.match(/^\+\d{10,15}$/)) return "Invalid phone number format";
    if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) return "Invalid email format";
    if (pinCode && !pinCode.match(/^\d{5,6}$/)) return "Invalid PIN code";
    if (gstNumber && !gstNumber.match(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)) 
      return "Invalid GST number format";
    if (!country) return "Country is required";
    if (stateList.length > 0 && !state) return "State is required when available";
    if (cityList.length > 0 && !city) return "City is required when available";
    return null;
  };
  useEffect(() => {
    const countries = Country.getAllCountries().map((country) => ({
      label: country.name,
      value: country.isoCode,
    }));
    setCountryList(countries);
  }, []);

  useEffect(() => {
    if (country) {
      const states = State.getStatesOfCountry(country).map((state) => ({
        label: state.name,
        value: state.isoCode,
      }));
      setStateList(states);
      setState("");
      setCity("");
      setCityList([]);
    }
  }, [country]);

  useEffect(() => {
    if (state) {
      const cities = City.getCitiesOfState(country, state).map((city) => ({
        label: city.name,
        value: city.name,
      }));
      setCityList(cities);
      setCity("");
    }
  }, [state]);

  const takePhoto = () => {
    launchCamera(imagePickerOptions, (response) => {
      handleImagePickerResponse(response);
    });
  };

  const selectProfilePicture = async () => {
    try {
      setIsLoading(true);
      const response = await launchImageLibrary(imagePickerOptions);
      handleImagePickerResponse(response);
    } catch (err) {
      showSnackbar("Error selecting image", true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImagePickerResponse = (response) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.errorCode) {
      showSnackbar(`Image Error: ${response.errorMessage}`, true);
    } else if (response.assets && response.assets.length > 0) {
      const source = { uri: response.assets[0].uri };
      setProfilePicture(source.uri);
      showSnackbar("Profile picture updated");
    }
  };

  const showImagePickerOptions = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Choose from Gallery'],
          cancelButtonIndex: 0,
        },
        buttonIndex => {
          if (buttonIndex === 1) takePhoto();
          else if (buttonIndex === 2) selectProfilePicture();
        }
      );
    } else {
      selectProfilePicture();
    }
  };

  const handlePhotoChange = () => {
    showImagePickerOptions();
  };

  const showSnackbar = (message, isError = false) => {
    setSnackbarMessage(message);
    setSnackbarError(isError);
    setSnackbarVisible(true);
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      showSnackbar(validationError, true);
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('phoneNumber', phoneNumber);
      formData.append('email', email);
      formData.append('businessName', businessName);
      formData.append('gstNumber', gstNumber);
      formData.append('pinCode', pinCode);
      formData.append('country', country);
      formData.append('state', state);
      formData.append('city', city);

      if (profilePicture && profilePicture.startsWith('file://')) {
        formData.append('profilePicture', {
          uri: profilePicture,
          type: 'image/jpeg',
          name: 'profile.jpg',
        });
      }

    try {
      // Replace with your actual API endpoint
      console.log('formData',formData)
      const response = await updateUser({userId,data:formData}).unwrap()

      if (response.ok) {
        showSnackbar("Profile updated successfully");
        navigation.goBack();
        
      } else {
        showSnackbar("Failed to update profile", true);
        console.log('update profile response',response)
      }
    } catch (error) {
      showSnackbar("Network error occurred", true);
    } finally {
      setIsLoading(false);
    }
  };

  const renderDropdown = (label, data, value, setValue, placeholder) => (
    <View style={styles.dropdownContainer}>
      <Text style={styles.label}>{label}</Text>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        data={data}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        searchPlaceholder="Search..."
        value={value}
        onChange={(item) => setValue(item.value)}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={{ flex: 1, backgroundColor: theme.colors.background }}
          contentContainerStyle={{ padding: 20 }}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity onPress={()=>navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color={theme.colors.text} />
            <Text style={styles.backText}>PROFILE</Text>
          </TouchableOpacity>

          <View style={styles.profileContainer}>
            <Avatar.Image size={80} source={profilePicture?{ uri: profilePicture }:noProfile_image} />
            <TouchableOpacity onPress={handlePhotoChange} disabled={isLoading}>
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            label="Full Name *"
            value={fullName}
            onChangeText={setFullName}
            style={styles.input}
            mode="outlined"
            error={!fullName.trim()}
          />
          <TextInput
            label="Phone Number *"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            style={styles.input}
            mode="outlined"
            keyboardType="phone-pad"
            error={!phoneNumber.match(/^\+\d{10,15}$/)}
          />
          <TextInput
            label="Email *"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            mode="outlined"
            keyboardType="email-address"
            error={!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)}
          />
          <TextInput
            label="Business Name"
            value={businessName}
            onChangeText={setBusinessName}
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="GST Number"
            value={gstNumber}
            onChangeText={setGstNumber}
            style={styles.input}
            mode="outlined"
            error={gstNumber && !gstNumber.match(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)}
          />
          <TextInput
            label="Pin Code"
            value={pinCode}
            onChangeText={setPinCode}
            style={styles.input}
            mode="outlined"
            keyboardType="number-pad"
            error={pinCode && !pinCode.match(/^\d{5,6}$/)}
          />

          {renderDropdown("Country *", countryList, country, setCountry, "Select Country")}
          {stateList.length > 0 && renderDropdown("State", stateList, state, setState, "Select State")}
          {cityList.length > 0 && renderDropdown("City", cityList, city, setCity, "Select City")}

          <Button
            mode="contained"
            style={styles.submitButton}
            onPress={handleSubmit}
            loading={isLoading}
            disabled={isLoading}
          >
            Update Profile
          </Button>
        </ScrollView>
      </TouchableWithoutFeedback>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{ backgroundColor: snackbarError ? theme.colors.error : theme.colors.success }}
      >
        {snackbarMessage}
      </Snackbar>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  changePhotoText: {
    marginTop: 8,
    color: "#1E90FF",
    fontWeight: "600",
  },
  input: {
    marginBottom: 15,
    backgroundColor: "transparent",
  },
  dropdownContainer: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontWeight: "500",
    fontSize: 14,
  },
  dropdown: {
    height: 50,
    borderColor: "#C0C0C0",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "white",
  },
  placeholderStyle: {
    color: "#A9A9A9",
  },
  selectedTextStyle: {
    color: "#000",
    fontSize: 16,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  submitButton: {
    marginTop: 20,
    borderRadius: 8,
    paddingVertical: 5,
  },
});

export default EditProfileScreen;
