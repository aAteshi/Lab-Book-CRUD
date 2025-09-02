import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { useRouter } from "expo-router";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { AuthStyles, CommonStyles } from "../styles";

const LoginScreen = () => {
  const { colors } = useTheme();
  const { login, register } = useAuth();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        Alert.alert("Error", "Passwords do not match");
        return;
      }
      if (!formData.name) {
        Alert.alert("Error", "Please enter your name");
        return;
      }
    }

    setLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await login(formData.email, formData.password);
      } else {
        result = await register({
          email: formData.email,
          password: formData.password,
          name: formData.name,
        });
      }

      if (result.success) {
        Alert.alert(
          "Success",
          result.message || (isLogin ? "Login successful!" : "Registration successful!"),
          [
            {
              text: "OK",
              onPress: () => router.replace("/(tabs)"),
            },
          ]
        );
      } else {
        Alert.alert("Login Failed", result.message || "An error occurred");
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    });
  };

  return (
    <KeyboardAvoidingView
      style={[AuthStyles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={AuthStyles.scrollContainer}>
        {/* Header */}
        <View style={[AuthStyles.header, { backgroundColor: colors.headerBackground }]}>
          <Text style={AuthStyles.headerTitle}>
            {isLogin ? "🔐 Login" : "📝 Register"}
          </Text>
          <Text style={AuthStyles.headerSubtitle}>
            {isLogin ? "Welcome back!" : "Create your account"}
          </Text>
        </View>

        {/* Form */}
        <View style={AuthStyles.formContainer}>
          {!isLogin && (
            <View style={AuthStyles.formGroup}>
              <Text style={[AuthStyles.label, { color: colors.text }]}>
                Full Name *
              </Text>
              <TextInput
                style={[
                  AuthStyles.input,
                  {
                    backgroundColor: colors.cardBackground,
                    borderColor: colors.cardBorder,
                    color: colors.text,
                  },
                ]}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Enter your full name"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="words"
              />
            </View>
          )}

          <View style={AuthStyles.formGroup}>
            <Text style={[AuthStyles.label, { color: colors.text }]}>
              Email *
            </Text>
            <TextInput
              style={[
                AuthStyles.input,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.cardBorder,
                  color: colors.text,
                },
              ]}
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              placeholder="Enter your email"
              placeholderTextColor={colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View style={AuthStyles.formGroup}>
            <Text style={[AuthStyles.label, { color: colors.text }]}>
              Password *
            </Text>
            <TextInput
              style={[
                AuthStyles.input,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.cardBorder,
                  color: colors.text,
                },
              ]}
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
              placeholder="Enter your password"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              autoComplete="password"
            />
          </View>

          {!isLogin && (
            <View style={AuthStyles.formGroup}>
              <Text style={[AuthStyles.label, { color: colors.text }]}>
                Confirm Password *
              </Text>
              <TextInput
                style={[
                  AuthStyles.input,
                  {
                    backgroundColor: colors.cardBackground,
                    borderColor: colors.cardBorder,
                    color: colors.text,
                  },
                ]}
                value={formData.confirmPassword}
                onChangeText={(text) =>
                  setFormData({ ...formData, confirmPassword: text })
                }
                placeholder="Confirm your password"
                placeholderTextColor={colors.textMuted}
                secureTextEntry
                autoComplete="password"
              />
            </View>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              AuthStyles.submitButton,
              { backgroundColor: colors.primary },
              loading && { opacity: 0.7 },
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={AuthStyles.submitButtonText}>
              {loading
                ? "Processing..."
                : isLogin
                ? "Login"
                : "Register"}
            </Text>
          </TouchableOpacity>

          {/* Toggle Mode */}
          <View style={AuthStyles.toggleContainer}>
            <Text style={[AuthStyles.toggleText, { color: colors.textSecondary }]}>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </Text>
            <TouchableOpacity onPress={toggleMode}>
              <Text style={[AuthStyles.toggleLink, { color: colors.primary }]}>
                {isLogin ? "Register here" : "Login here"}
              </Text>
            </TouchableOpacity>
          </View>


        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
