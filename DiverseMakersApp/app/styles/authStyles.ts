import { StyleSheet } from "react-native";

const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    marginBottom: 24,
    textAlign: "center",
    color: "#000",
  },
  input: {
    marginBottom: 8, // Reduced to accommodate HelperText without excessive spacing
    backgroundColor: "#fff",
    borderRadius: 4,
  },
  errorText: {
    color: "red",
    fontSize: 14, // You can adjust this or use settings.fontSize - 2 if available
    marginBottom: 8,
    textAlign: "center",
  },
  button: {
    marginVertical: 12,
    borderRadius: 4,
  },
  buttonContent: {
    height: 48,
    justifyContent: "center",
  },
  link: {
    alignSelf: "center",
    marginTop: 12, // Added to provide spacing between the button and the link
  },
});

export default authStyles;
