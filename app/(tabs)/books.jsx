import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  Modal,
  RefreshControl,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { BookStyles, CommonStyles } from "../styles";
import { useRouter } from "expo-router";
import { API_CONFIG, getApiUrl } from "../config/api";

const BooksScreen = () => {
  const { colors } = useTheme();
  const { authFetch, isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMoreBooks, setHasMoreBooks] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    description: "",
    price: "",
    year: "",
    available: true,
  });

  // Check authentication
  const checkAuth = () => {
    if (!isAuthenticated) {
      Alert.alert(
        "Authentication Required",
        "Please login to access books management",
        [
          {
            text: "Login",
            onPress: () => router.push("/login"),
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ]
      );
      return false;
    }
    return true;
  };



  // Fetch all books with pagination
  const fetchBooks = async (search = "", page = 1, limit = 10) => {
    if (!checkAuth()) return;
    
    try {
      setLoading(true);
      
      // Build URL with pagination and search
      let url = `${getApiUrl(API_CONFIG.ENDPOINTS.BOOKS)}?page=${page}&limit=${limit}`;
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      
      const response = await authFetch(url);
      const data = await response.json();
      
      if (response.ok) {
        // Handle paginated response
        if (data.books) {
          setBooks(data.books);
          setCurrentPage(data.currentPage || page);
          setTotalPages(data.totalPages || 1);
          setHasMoreBooks(data.hasNextPage || false);
        } else {
          // Handle simple array response
          setBooks(data);
        }
        
        console.log('Books fetched:', data.books?.length || data.length, 'items');
        console.log('Current page:', data.currentPage || page);
        console.log('Total pages:', data.totalPages || 1);
      } else {
        Alert.alert("Error", data.message || "Failed to fetch books");
      }
    } catch (error) {
      Alert.alert("Error", "Network error occurred");
      console.error("Fetch books error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch genres
  const fetchGenres = async () => {
    if (!checkAuth()) return;
    
    try {
      const response = await authFetch(getApiUrl(API_CONFIG.ENDPOINTS.BOOKS_GENRES));
      const data = await response.json();
      
      if (response.ok) {
        setGenres(data);
      }
    } catch (error) {
      console.error("Fetch genres error:", error);
    }
  };

  // Create or Update book
  const saveBook = async () => {
    if (!checkAuth()) return;
    
    try {
      // Enhanced validation
      if (!formData.title?.trim() || !formData.author?.trim() || !formData.genre?.trim()) {
        Alert.alert("Error", "Please fill in all required fields (Title, Author, Genre)");
        return;
      }

      // Validate year
      const yearValue = parseInt(formData.year);
      if (formData.year && (isNaN(yearValue) || yearValue < 1000 || yearValue > 2030)) {
        Alert.alert("Error", "Please enter a valid year (1000-2030)");
        return;
      }

      // Validate price
      const priceValue = parseFloat(formData.price);
      if (formData.price && (isNaN(priceValue) || priceValue < 0)) {
        Alert.alert("Error", "Please enter a valid price (0 or greater)");
        return;
      }

      const bookData = {
        title: formData.title.trim(),
        author: formData.author.trim(),
        genre: formData.genre.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price) || 0,
        year: parseInt(formData.year) || new Date().getFullYear(),
        available: Boolean(formData.available),
      };

      // Get book ID (handle both id and _id)
      const bookId = editingBook?.id || editingBook?._id;
      
      if (editingBook && !bookId) {
        Alert.alert("Error", "Book ID is missing. Cannot update book.");
        console.error("Missing book ID:", editingBook);
        return;
      }

      const url = editingBook
        ? getApiUrl(API_CONFIG.ENDPOINTS.BOOKS_BY_ID(bookId))
        : getApiUrl(API_CONFIG.ENDPOINTS.BOOKS);
      
      const method = editingBook ? "PUT" : "POST";

      // Debug: Log the data being sent
      console.log('Sending book data:', JSON.stringify(bookData, null, 2));
      console.log('API URL:', url);
      console.log('Method:', method);

      const response = await authFetch(url, {
        method,
        body: JSON.stringify(bookData),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          "Success",
          editingBook ? "Book updated successfully" : "Book created successfully"
        );
        setModalVisible(false);
        resetForm();
        
        // รีเฟรชข้อมูลจาก API
        setTimeout(() => {
          fetchBooks(searchQuery, 1);
        }, 300);
      } else {
        console.log('API Error Response:', data);
        console.log('Response Status:', response.status);
        
        // Handle validation errors
        let errorMessage = `Failed to save book (${response.status})`;
        
        if (data.errors && Array.isArray(data.errors)) {
          const errorDetails = data.errors.map(err => 
            `${err.param || err.field || 'Field'}: ${err.msg || err.message || 'Invalid'}`
          ).join('\n');
          errorMessage = `Validation Errors:\n${errorDetails}`;
        } else if (data.message) {
          errorMessage = data.message;
        }
        
        Alert.alert("Error", errorMessage);
      }
    } catch (error) {
      Alert.alert("Error", "Network error occurred");
      console.error("Save book error:", error);
    }
  };

  // Show delete confirmation
  const showDeleteConfirmation = (book) => {
    console.log('Delete function called with book:', book);
    
    const bookId = book.id || book._id;
    console.log('Extracted book ID:', bookId);
    
    if (!bookId) {
      Alert.alert("Error", "Book ID is missing");
      console.error("Book ID missing:", book);
      return;
    }
    
    setBookToDelete(book);
    setDeleteModalVisible(true);
  };

  // Confirm delete book
  const confirmDeleteBook = async () => {
    if (!bookToDelete) return;
    
    const bookId = bookToDelete.id || bookToDelete._id;
    
    try {
      console.log('Deleting book ID:', bookId);
      
      const response = await authFetch(getApiUrl(API_CONFIG.ENDPOINTS.BOOKS_BY_ID(bookId)), {
        method: "DELETE",
      });

      if (response.ok) {
        // อัปเดต local state ทันที (Optimistic Update)
        const updatedBooks = books.filter(b => (b.id || b._id) !== bookId);
        setBooks(updatedBooks);
        
        setDeleteModalVisible(false);
        setBookToDelete(null);
        
        Alert.alert("Success", "Book deleted successfully");
        
        // รีเฟรชข้อมูลจาก API
        setTimeout(() => {
          fetchBooks(searchQuery, 1);
        }, 500);
      } else {
        const data = await response.json();
        
        // Handle different error types
        let errorMessage = data.message || "Failed to delete book";
        
        if (response.status === 403) {
          errorMessage = `🚫 ไม่สามารถลบหนังสือได้\n\nเหตุผล: เซิร์ฟเวอร์ปฏิเสธการลบ\n\nอาจเป็นเพราะ:\n• หนังสือถูกล็อคหรือมีการใช้งานอยู่\n• เซิร์ฟเวอร์มีข้อจำกัดในการลบ\n• ข้อมูลหนังสือไม่สมบูรณ์\n\nกรุณาลองใหม่อีกครั้งหรือติดต่อผู้ดูแลระบบ`;
        } else if (response.status === 404) {
          errorMessage = "📚 ไม่พบหนังสือ\n\nหนังสือนี้อาจถูกลบไปแล้ว หรือไม่พบในระบบ";
        } else if (response.status === 401) {
          errorMessage = "🔐 ต้องเข้าสู่ระบบ\n\nกรุณาเข้าสู่ระบบใหม่เพื่อดำเนินการลบหนังสือ";
        } else if (response.status === 500) {
          errorMessage = "⚠️ เกิดข้อผิดพลาดของเซิร์ฟเวอร์\n\nกรุณาลองใหม่อีกครั้งในภายหลัง";
        }
        
        setDeleteModalVisible(false);
        setBookToDelete(null);
        Alert.alert("ไม่สามารถลบหนังสือได้", errorMessage);
      }
    } catch (error) {
      Alert.alert("Error", "Network error occurred");
      console.error("Delete book error:", error);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      genre: "",
      description: "",
      price: "",
      year: "",
      available: true,
    });
    setEditingBook(null);
  };

  // Open edit modal
  const openEditModal = (book) => {
    console.log('Opening edit modal for book:', book);
    console.log('Book ID:', book.id || book._id);
    
    setEditingBook(book);
    setFormData({
      title: book.title || "",
      author: book.author || "",
      genre: book.genre || "",
      description: book.description || "",
      price: book.price?.toString() || "",
      year: book.year?.toString() || book.publishedYear?.toString() || "",
      available: book.available !== undefined ? book.available : true,
    });
    setModalVisible(true);
  };

  // Open create modal
  const openCreateModal = () => {
    resetForm();
    setModalVisible(true);
  };

  // Handle search
  const handleSearch = (text) => {
    setSearchQuery(text);
    setCurrentPage(1); // Reset to first page when searching
    if (text.length === 0 || text.length >= 2) {
      fetchBooks(text, 1);
    }
  };

  // Load more books (pagination)
  const loadMoreBooks = () => {
    if (hasMoreBooks && !loading) {
      const nextPage = currentPage + 1;
      fetchBooks(searchQuery, nextPage);
    }
  };

  // Refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    setCurrentPage(1);
    fetchBooks(searchQuery, 1);
  };

  // Load data on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchBooks();
      fetchGenres();
    }
  }, [isAuthenticated]);

  // Navigate to book detail
  const viewBookDetail = (book) => {
    const bookId = book.id || book._id;
    console.log('Navigating to book detail, ID:', bookId);
    console.log('Full book object:', book);
    
    if (!bookId) {
      Alert.alert("Error", "Book ID is missing");
      return;
    }
    
    // ส่งข้อมูลหนังสือทั้งหมดไปด้วยเพื่อใช้เป็น fallback
    router.push({
      pathname: '/book-detail',
      params: { 
        id: bookId,
        title: book.title || '',
        author: book.author || '',
        genre: book.genre || '',
        description: book.description || '',
        price: book.price?.toString() || '0',
        year: book.year?.toString() || book.publishedYear?.toString() || '',
        available: book.available?.toString() || 'true'
      }
    });
  };

  // Check if user can edit/delete book
  const canModifyBook = (book) => {
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

  // Render book item
  const renderBookItem = ({ item }) => (
    <TouchableOpacity
      style={[
        BookStyles.bookCard,
        {
          backgroundColor: colors.cardBackground,
          borderColor: colors.cardBorder,
          shadowColor: colors.cardShadow,
        },
      ]}
      onPress={() => viewBookDetail(item)}
      activeOpacity={0.7}
    >
      <View style={BookStyles.bookHeader}>
        <Text style={[BookStyles.bookTitle, { color: colors.text }]}>
          {item.title}
        </Text>
        <View style={BookStyles.bookActions}>
          {canModifyBook(item) ? (
            <>
              <TouchableOpacity
                style={[BookStyles.actionButton, { backgroundColor: colors.primary }]}
                onPress={(e) => {
                  e.stopPropagation(); // ป้องกัน event bubbling
                  openEditModal(item);
                }}
              >
                <Text style={BookStyles.actionButtonText}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[BookStyles.actionButton, { backgroundColor: "#ff4757" }]}
                onPress={(e) => {
                  e.stopPropagation(); // ป้องกัน event bubbling
                  showDeleteConfirmation(item);
                }}
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
      
      <Text style={[BookStyles.bookAuthor, { color: colors.textSecondary }]}>
        👤 {item.author || 'Unknown Author'}
      </Text>
      
      <Text style={[BookStyles.bookGenre, { color: colors.textSecondary }]}>
        📚 {item.genre || 'Unknown Genre'}
      </Text>
      
      {item.description && item.description.trim() && (
        <Text style={[BookStyles.bookDescription, { color: colors.textSecondary }]}>
          {item.description.length > 100
            ? `${item.description.substring(0, 100)}...`
            : item.description}
        </Text>
      )}
      
      <View style={BookStyles.bookFooter}>
        <Text style={[BookStyles.bookPrice, { color: colors.primary }]}>
          💰 ${item.price || "0.00"}
        </Text>
        <Text style={[BookStyles.bookYear, { color: colors.textMuted }]}>
          📅 {item.year || item.publishedYear || 'Unknown Year'}
        </Text>
        {item.available !== undefined && (
          <Text style={[BookStyles.availabilityText, { 
            color: item.available ? "#48bb78" : "#f56565" 
          }]}>
            {item.available ? "✅ Available" : "❌ Not Available"}
          </Text>
        )}
      </View>
      
      {/* Tap to view indicator */}
      <View style={BookStyles.tapIndicator}>
        <Text style={[BookStyles.tapText, { color: colors.textMuted }]}>
          👆 Tap to view details
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[BookStyles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[BookStyles.header, { backgroundColor: colors.headerBackground }]}>
        <Text style={BookStyles.headerTitle}>📚 Books Management</Text>
        <TouchableOpacity
          style={BookStyles.addButton}
          onPress={openCreateModal}
        >
          <Text style={BookStyles.addButtonText}>+ Add Book</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={BookStyles.searchContainer}>
        <TextInput
          style={[
            BookStyles.searchInput,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.cardBorder,
              color: colors.text,
            },
          ]}
          placeholder="Search books..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* Books List */}
      <FlatList
        data={books}
        renderItem={renderBookItem}
        keyExtractor={(item) => (item.id || item._id)?.toString() || Math.random().toString()}
        contentContainerStyle={BookStyles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={BookStyles.emptyContainer}>
            <Text style={[BookStyles.emptyText, { color: colors.textSecondary }]}>
              {loading ? "Loading books..." : "No books found"}
            </Text>
          </View>
        }
        ListFooterComponent={
          hasMoreBooks ? (
            <TouchableOpacity
              style={[BookStyles.loadMoreButton, { backgroundColor: colors.primary }]}
              onPress={loadMoreBooks}
              disabled={loading}
            >
              <Text style={BookStyles.loadMoreText}>
                {loading ? "Loading..." : "Load More Books"}
              </Text>
            </TouchableOpacity>
          ) : (
            totalPages > 1 && (
              <View style={BookStyles.paginationInfo}>
                <Text style={[BookStyles.paginationText, { color: colors.textMuted }]}>
                  Page {currentPage} of {totalPages} • {books.length} books
                </Text>
              </View>
            )
          )
        }
      />

      {/* Delete Confirmation Modal */}
      <Modal
        visible={deleteModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={BookStyles.deleteModalOverlay}>
          <View style={[BookStyles.deleteModalContent, { backgroundColor: colors.cardBackground }]}>
            <Text style={[BookStyles.deleteModalTitle, { color: colors.text }]}>
              🗑️ Confirm Delete
            </Text>
            <Text style={[BookStyles.deleteModalMessage, { color: colors.textSecondary }]}>
              Are you sure you want to delete "{bookToDelete?.title || 'this book'}"?
            </Text>
            <Text style={[BookStyles.deleteModalWarning, { color: "#f56565" }]}>
              This action cannot be undone.
            </Text>
            
            <View style={BookStyles.deleteModalButtons}>
              <TouchableOpacity
                style={[BookStyles.deleteModalButton, BookStyles.cancelButton, { backgroundColor: colors.textMuted }]}
                onPress={() => {
                  setDeleteModalVisible(false);
                  setBookToDelete(null);
                }}
              >
                <Text style={BookStyles.deleteModalButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[BookStyles.deleteModalButton, BookStyles.deleteButton, { backgroundColor: "#f56565" }]}
                onPress={confirmDeleteBook}
              >
                <Text style={BookStyles.deleteModalButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add/Edit Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={[BookStyles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[BookStyles.modalHeader, { backgroundColor: colors.headerBackground }]}>
            <Text style={BookStyles.modalTitle}>
              {editingBook ? "Edit Book" : "Add New Book"}
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={BookStyles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={BookStyles.modalContent}>
            <View style={BookStyles.formGroup}>
              <Text style={[BookStyles.label, { color: colors.text }]}>
                Title *
              </Text>
              <TextInput
                style={[
                  BookStyles.input,
                  {
                    backgroundColor: colors.cardBackground,
                    borderColor: colors.cardBorder,
                    color: colors.text,
                  },
                ]}
                value={formData.title}
                onChangeText={(text) => setFormData({ ...formData, title: text })}
                placeholder="Enter book title"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <View style={BookStyles.formGroup}>
              <Text style={[BookStyles.label, { color: colors.text }]}>
                Author *
              </Text>
              <TextInput
                style={[
                  BookStyles.input,
                  {
                    backgroundColor: colors.cardBackground,
                    borderColor: colors.cardBorder,
                    color: colors.text,
                  },
                ]}
                value={formData.author}
                onChangeText={(text) => setFormData({ ...formData, author: text })}
                placeholder="Enter author name"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <View style={BookStyles.formGroup}>
              <Text style={[BookStyles.label, { color: colors.text }]}>
                Genre *
              </Text>
              <TextInput
                style={[
                  BookStyles.input,
                  {
                    backgroundColor: colors.cardBackground,
                    borderColor: colors.cardBorder,
                    color: colors.text,
                  },
                ]}
                value={formData.genre}
                onChangeText={(text) => setFormData({ ...formData, genre: text })}
                placeholder="Enter genre"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <View style={BookStyles.formGroup}>
              <Text style={[BookStyles.label, { color: colors.text }]}>
                Description
              </Text>
              <TextInput
                style={[
                  BookStyles.input,
                  BookStyles.textArea,
                  {
                    backgroundColor: colors.cardBackground,
                    borderColor: colors.cardBorder,
                    color: colors.text,
                  },
                ]}
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                placeholder="Enter book description"
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={BookStyles.formRow}>
              <View style={[BookStyles.formGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={[BookStyles.label, { color: colors.text }]}>
                  Price
                </Text>
                <TextInput
                  style={[
                    BookStyles.input,
                    {
                      backgroundColor: colors.cardBackground,
                      borderColor: colors.cardBorder,
                      color: colors.text,
                    },
                  ]}
                  value={formData.price}
                  onChangeText={(text) => setFormData({ ...formData, price: text })}
                  placeholder="0.00"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                />
              </View>

              <View style={[BookStyles.formGroup, { flex: 1, marginLeft: 10 }]}>
                <Text style={[BookStyles.label, { color: colors.text }]}>
                  Year
                </Text>
                <TextInput
                  style={[
                    BookStyles.input,
                    {
                      backgroundColor: colors.cardBackground,
                      borderColor: colors.cardBorder,
                      color: colors.text,
                    },
                  ]}
                  value={formData.year}
                  onChangeText={(text) => setFormData({ ...formData, year: text })}
                  placeholder="2024"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={BookStyles.formGroup}>
              <Text style={[BookStyles.label, { color: colors.text }]}>
                Availability
              </Text>
              <View style={BookStyles.availabilityContainer}>
                <TouchableOpacity
                  style={[
                    BookStyles.availabilityButton,
                    formData.available && { backgroundColor: colors.primary },
                    !formData.available && { borderColor: colors.cardBorder }
                  ]}
                  onPress={() => setFormData({ ...formData, available: true })}
                >
                  <Text style={[
                    BookStyles.availabilityButtonText,
                    { color: formData.available ? "#ffffff" : colors.text }
                  ]}>
                    ✅ Available
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    BookStyles.availabilityButton,
                    !formData.available && { backgroundColor: "#f56565" },
                    formData.available && { borderColor: colors.cardBorder }
                  ]}
                  onPress={() => setFormData({ ...formData, available: false })}
                >
                  <Text style={[
                    BookStyles.availabilityButtonText,
                    { color: !formData.available ? "#ffffff" : colors.text }
                  ]}>
                    ❌ Not Available
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          <View style={BookStyles.modalFooter}>
            <TouchableOpacity
              style={[BookStyles.cancelButton, { backgroundColor: colors.textMuted }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={BookStyles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[BookStyles.saveButton, { backgroundColor: colors.primary }]}
              onPress={saveBook}
            >
              <Text style={BookStyles.saveButtonText}>
                {editingBook ? "Update" : "Create"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default BooksScreen;
