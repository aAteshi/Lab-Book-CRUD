import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "./context/ThemeContext";
import { useAuth } from "./context/AuthContext";
import { BookStyles, CommonStyles } from "./styles";
import { API_CONFIG, getApiUrl } from "./config/api";

const BookDetailScreen = () => {
  const { colors } = useTheme();
  const { authFetch, isAuthenticated, user } = useAuth();
  const params = useLocalSearchParams();
  const router = useRouter();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Normalize book data to ensure consistent structure
  const normalizeBookData = (rawData) => {
    return {
      id: rawData.id || rawData._id || rawData.bookId,
      title: rawData.title || rawData.name || 'Unknown Title',
      author: rawData.author || rawData.authorName || rawData.writer || 'Unknown Author',
      genre: rawData.genre || rawData.category || rawData.type || 'Unknown Genre',
      description: rawData.description || rawData.summary || rawData.desc || 'No description available',
      price: parseFloat(rawData.price || rawData.cost || rawData.amount || 0),
      year: rawData.year || rawData.publishedYear || rawData.publicationYear || rawData.publishYear || 'Unknown Year',
      available: rawData.available !== undefined ? rawData.available : (rawData.status === 'available' || rawData.isAvailable === true),
      createdAt: rawData.createdAt || rawData.created_at || rawData.dateCreated,
      updatedAt: rawData.updatedAt || rawData.updated_at || rawData.dateUpdated
    };
  };

  // Create book object from params (fallback data)
  const createBookFromParams = (params) => {
    return normalizeBookData({
      id: params.id,
      title: params.title,
      author: params.author,
      genre: params.genre,
      description: params.description,
      price: params.price,
      year: params.year,
      available: params.available
    });
  };

  // Fetch book by ID
  const fetchBookById = async (bookId) => {
    if (!isAuthenticated) {
      Alert.alert(
        "Authentication Required",
        "Please login to view book details",
        [{ text: "OK", onPress: () => router.back() }]
      );
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching book with ID:', bookId);
      const response = await authFetch(getApiUrl(API_CONFIG.ENDPOINTS.BOOKS_BY_ID(bookId)));
      const data = await response.json();
      
      console.log('API Response:', response.status, data);
      
      if (response.ok) {
        // ตรวจสอบโครงสร้างข้อมูลที่ได้รับ
        console.log('Raw API response data:', JSON.stringify(data, null, 2));
        
        // จัดการข้อมูลตามโครงสร้างที่ API ส่งมา
        let bookData = data;
        
        // ถ้า API ส่งข้อมูลในรูปแบบ { book: {...} }
        if (data.book) {
          bookData = data.book;
          console.log('Extracted book data from response:', JSON.stringify(bookData, null, 2));
        }
        
        // ถ้า API ส่งข้อมูลในรูปแบบ { data: {...} }
        if (data.data) {
          bookData = data.data;
          console.log('Extracted book data from data field:', JSON.stringify(bookData, null, 2));
        }
        
        // Normalize the data before setting
        const normalizedBook = normalizeBookData(bookData);
        setBook(normalizedBook);
        console.log('Book data set successfully:', normalizedBook);
      } else {
        console.log('API Error:', data.message);
        setError(data.message || "Failed to fetch book details");
        
        // ใช้ข้อมูลจาก params เป็น fallback
        const fallbackBook = createBookFromParams(params);
        setBook(fallbackBook);
        console.log('Using fallback data:', fallbackBook);
      }
    } catch (error) {
      console.error("Fetch book error:", error);
      setError("Network error occurred");
      
      // ใช้ข้อมูลจาก params เป็น fallback
      const fallbackBook = createBookFromParams(params);
      setBook(fallbackBook);
      console.log('Using fallback data due to network error:', fallbackBook);
    } finally {
      setLoading(false);
    }
  };

  // Delete book
  const deleteBook = async () => {
    Alert.alert(
      "ยืนยันการลบ",
      `คุณแน่ใจหรือไม่ที่จะลบหนังสือ "${book.title}"?`,
      [
        { text: "ยกเลิก", style: "cancel" },
        {
          text: "ลบ",
          style: "destructive",
          onPress: async () => {
            try {
              const bookId = params.id;
              const response = await authFetch(getApiUrl(API_CONFIG.ENDPOINTS.BOOKS_BY_ID(bookId)), {
                method: "DELETE",
              });

              if (response.ok) {
                Alert.alert("สำเร็จ", "ลบหนังสือเรียบร้อยแล้ว");
                router.back();
              } else {
                const data = await response.json();
                
                // Handle different error types
                let errorMessage = data.message || "ไม่สามารถลบหนังสือได้";
                
                if (response.status === 403) {
                  errorMessage = `🚫 ไม่สามารถลบหนังสือได้\n\nเหตุผล: เซิร์ฟเวอร์ปฏิเสธการลบ\n\nอาจเป็นเพราะ:\n• หนังสือถูกล็อคหรือมีการใช้งานอยู่\n• เซิร์ฟเวอร์มีข้อจำกัดในการลบ\n• ข้อมูลหนังสือไม่สมบูรณ์\n\nกรุณาลองใหม่อีกครั้งหรือติดต่อผู้ดูแลระบบ`;
                } else if (response.status === 404) {
                  errorMessage = "📚 ไม่พบหนังสือ\n\nหนังสือนี้อาจถูกลบไปแล้ว หรือไม่พบในระบบ";
                } else if (response.status === 401) {
                  errorMessage = "🔐 ต้องเข้าสู่ระบบ\n\nกรุณาเข้าสู่ระบบใหม่เพื่อดำเนินการลบหนังสือ";
                } else if (response.status === 500) {
                  errorMessage = "⚠️ เกิดข้อผิดพลาดของเซิร์ฟเวอร์\n\nกรุณาลองใหม่อีกครั้งในภายหลัง";
                }
                
                Alert.alert("ไม่สามารถลบหนังสือได้", errorMessage);
              }
            } catch (error) {
              Alert.alert("ข้อผิดพลาด", "เกิดข้อผิดพลาดในการเชื่อมต่อเครือข่าย");
              console.error("Delete book error:", error);
            }
          },
        },
      ]
    );
  };

  // Check if user can edit/delete book
  const canModifyBook = (book) => {
    if (!book || !user) return false;
    
    // อนุญาตให้แก้ไข/ลบหนังสือได้ทุกเล่ม (สำหรับ admin หรือ user ที่มีสิทธิ์)
    // หรือถ้าต้องการจำกัดเฉพาะหนังสือของตัวเอง ให้ uncomment บรรทัดด้านล่าง
    
    // ตรวจสอบว่าเป็นหนังสือที่ user สร้างหรือไม่ (ถ้าต้องการจำกัดสิทธิ์)
    // const canModify = book.userId === user?.id || 
    //                  book.createdBy === user?.id || 
    //                  book.author === user?.username ||
    //                  book.userId === user?._id ||
    //                  book.createdBy === user?._id;
    
    // อนุญาตให้แก้ไข/ลบได้ทุกเล่ม
    const canModify = true;
    
    return canModify;
  };

  // Edit book
  const editBook = () => {
    const bookId = params.id;
    router.push(`/(tabs)/books?edit=${bookId}`);
  };

  // Load book data on component mount
  useEffect(() => {
    const bookId = params.id;
    console.log('Component mounted with params:', params);
    
    if (bookId) {
      fetchBookById(bookId);
    } else {
      // ถ้าไม่มี ID ให้ใช้ข้อมูลจาก params โดยตรง
      console.log('No book ID provided, using params data directly');
      const fallbackBook = createBookFromParams(params);
      setBook(fallbackBook);
      setLoading(false);
    }
  }, [params.id]);

  if (loading) {
    return (
      <View style={[BookStyles.container, { backgroundColor: colors.background }]}>
        <View style={BookStyles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[BookStyles.loadingText, { color: colors.textSecondary }]}>
            Loading book details...
          </Text>
        </View>
      </View>
    );
  }

  if (!book) {
    return (
      <View style={[BookStyles.container, { backgroundColor: colors.background }]}>
        <View style={BookStyles.emptyContainer}>
          <Text style={[BookStyles.emptyText, { color: colors.textSecondary }]}>
            Book not found
          </Text>
          {error && (
            <Text style={[BookStyles.emptyText, { color: "#f56565", marginTop: 10 }]}>
              Error: {error}
            </Text>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={[BookStyles.container, { backgroundColor: colors.background }]}>
      {/* Error Banner */}
      {error && (
        <View style={[BookStyles.errorBanner, { backgroundColor: "#fef2f2", borderColor: "#f56565" }]}>
          <Text style={[BookStyles.errorText, { color: "#f56565" }]}>
            ⚠️ {error} - Showing cached data
          </Text>
        </View>
      )}
      
      <ScrollView style={BookStyles.detailContainer}>
        {/* Book Info Card */}
        <View
          style={[
            BookStyles.detailCard,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.cardBorder,
              shadowColor: colors.cardShadow,
            },
          ]}
        >
          <View style={BookStyles.detailHeader}>
            <Text style={[BookStyles.detailTitle, { color: colors.text }]}>
              {book.title || 'Unknown Title'}
            </Text>
            <View style={BookStyles.bookActions}>
              {canModifyBook(book) ? (
                <>
                  <TouchableOpacity
                    style={[BookStyles.actionButton, { backgroundColor: colors.primary }]}
                    onPress={editBook}
                  >
                    <Text style={BookStyles.actionButtonText}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[BookStyles.actionButton, { backgroundColor: "#ff4757" }]}
                    onPress={deleteBook}
                  >
                    <Text style={BookStyles.actionButtonText}>🗑️</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <View style={BookStyles.readOnlyIndicator}>
                  <Text style={[BookStyles.readOnlyText, { color: colors.textMuted }]}>
                    👁️ View Only
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View style={BookStyles.detailInfo}>
            <View style={BookStyles.infoRow}>
              <Text style={[BookStyles.infoLabel, { color: colors.textSecondary }]}>
                👤 Author:
              </Text>
              <Text style={[BookStyles.infoValue, { color: colors.text }]}>
                {book.author}
              </Text>
            </View>

            <View style={BookStyles.infoRow}>
              <Text style={[BookStyles.infoLabel, { color: colors.textSecondary }]}>
                📚 Genre:
              </Text>
              <Text style={[BookStyles.infoValue, { color: colors.text }]}>
                {book.genre}
              </Text>
            </View>

            <View style={BookStyles.infoRow}>
              <Text style={[BookStyles.infoLabel, { color: colors.textSecondary }]}>
                💰 Price:
              </Text>
              <Text style={[BookStyles.infoValue, { color: colors.primary }]}>
                ${book.price.toFixed(2)}
              </Text>
            </View>

            <View style={BookStyles.infoRow}>
              <Text style={[BookStyles.infoLabel, { color: colors.textSecondary }]}>
                📅 Year:
              </Text>
              <Text style={[BookStyles.infoValue, { color: colors.text }]}>
                {book.year}
              </Text>
            </View>

            {book.available !== undefined && (
              <View style={BookStyles.infoRow}>
                <Text style={[BookStyles.infoLabel, { color: colors.textSecondary }]}>
                  📦 Availability:
                </Text>
                <Text style={[BookStyles.infoValue, { 
                  color: book.available ? "#48bb78" : "#f56565" 
                }]}>
                  {book.available ? "✅ Available" : "❌ Not Available"}
                </Text>
              </View>
            )}

            {book.description && (
              <View style={BookStyles.descriptionSection}>
                <Text style={[BookStyles.infoLabel, { color: colors.textSecondary }]}>
                  📝 Description:
                </Text>
                <Text style={[BookStyles.descriptionText, { color: colors.text }]}>
                  {book.description}
                </Text>
              </View>
            )}

            {book.createdAt && (
              <View style={BookStyles.infoRow}>
                <Text style={[BookStyles.infoLabel, { color: colors.textSecondary }]}>
                  🕒 Created:
                </Text>
                <Text style={[BookStyles.infoValue, { color: colors.textMuted }]}>
                  {new Date(book.createdAt).toLocaleDateString()}
                </Text>
              </View>
            )}

            {book.updatedAt && (
              <View style={BookStyles.infoRow}>
                <Text style={[BookStyles.infoLabel, { color: colors.textSecondary }]}>
                  🔄 Updated:
                </Text>
                <Text style={[BookStyles.infoValue, { color: colors.textMuted }]}>
                  {new Date(book.updatedAt).toLocaleDateString()}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={BookStyles.bottomActions}>
        <TouchableOpacity
          style={[BookStyles.bottomButton, { backgroundColor: colors.textMuted }]}
          onPress={() => router.back()}
        >
          <Text style={BookStyles.bottomButtonText}>← Back to List</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BookDetailScreen;
