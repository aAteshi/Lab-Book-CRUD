import { StyleSheet } from "react-native";

export const CommonStyles = StyleSheet.create({
  // Button styles
  button: {
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  // Card styles
  card: {
    borderRadius: 20,
    padding: 24,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  cardContent: {
    gap: 8,
  },

  // Text styles
  heading: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  subheading: {
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: 0.2,
  },

  // Theme toggle container
  themeToggleContainer: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 3,
  },
});
