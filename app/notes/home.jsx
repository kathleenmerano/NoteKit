import { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Animated, Easing, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import { auth, db } from "../../firebaseConfig";
import { collection, query, where, onSnapshot, orderBy, doc, updateDoc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";

export default function NotesHome() {
  const router = useRouter();
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownAnim = useRef(new Animated.Value(0)).current;
  const colors = ["#fef3c7", "#dbeafe", "#d1fae5", "#fce7f3", "#e0e7ff", "#fed7aa"];

  useEffect(() => {
    const q = query(
      collection(db, "notes"),
      where("uid", "==", auth.currentUser.uid),
      orderBy("updatedAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allNotes = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          pinned: data.pinned ?? false,
          deleted: data.deleted ?? false,
        };
      });
      setNotes(allNotes);
    });

    return unsubscribe;
  }, []);

  const togglePin = async (id, currentPinned) => {
    try {
      await updateDoc(doc(db, "notes", id), { pinned: !currentPinned });
    } catch (err) {
      console.log("Error updating pin:", err.message);
    }
  };

  const toggleDropdown = () => {
    if (dropdownOpen) {
      Animated.timing(dropdownAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }).start(() => setDropdownOpen(false));
    } else {
      setDropdownOpen(true);
      Animated.timing(dropdownAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }).start();
    }
  };

  const handleBackgroundPress = () => {
    if (dropdownOpen) toggleDropdown();
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.replace("/login");
    } catch (err) {
      console.log("Logout error:", err.message);
    }
  };

  const filteredNotes = notes
    ?.filter(n => !n.deleted)
    .filter(n => (filter === "pinned" ? n.pinned : true))
    .filter(n => n.title?.toLowerCase().includes(search.toLowerCase()) || n.content?.toLowerCase().includes(search.toLowerCase()));

  const sortedNotes = [
    ...(filteredNotes?.filter(n => n.pinned) || []),
    ...(filteredNotes?.filter(n => !n.pinned) || []),
  ];

  const dropdownStyle = {
    opacity: dropdownAnim,
    transform: [
      {
        translateY: dropdownAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [-20, 0],
        }),
      },
    ],
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  return (
    <TouchableWithoutFeedback onPress={handleBackgroundPress}>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>My Notes</Text>
            <Text style={styles.headerSubtitle}>
              {sortedNotes.length} {sortedNotes.length === 1 ? 'note' : 'notes'}
            </Text>
          </View>
          <TouchableOpacity style={styles.menuButton} onPress={toggleDropdown}>
            <Ionicons name="menu" size={28} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Dropdown */}
        {dropdownOpen && (
          <Animated.View style={[styles.dropdown, dropdownStyle]}>
            <TouchableOpacity style={styles.dropdownItemContainer} onPress={() => router.push("/notes/recycleBin")}>
              <Text style={styles.dropdownItem}>Recently Deleted</Text>
            </TouchableOpacity>
            <View style={styles.dropdownDivider} />
            <TouchableOpacity style={styles.dropdownItemContainer} onPress={handleLogout}>
              <Text style={[styles.dropdownItem, styles.logoutText]}>Log Out</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Search */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search notes..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#999"
          />
        </View>

        {/* Filter */}
        <View style={styles.filterBar}>
          <TouchableOpacity 
            onPress={() => setFilter("all")} 
            style={[styles.filterBtn, filter === "all" && styles.activeFilter]}
          >
            <Text style={[styles.filterText, filter === "all" && styles.activeFilterText]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setFilter("pinned")} 
            style={[styles.filterBtn, filter === "pinned" && styles.activeFilter]}
          >
            <Text style={[styles.filterText, filter === "pinned" && styles.activeFilterText]}>Pinned</Text>
          </TouchableOpacity>
        </View>

        {/* Notes Grid */}
        <ScrollView 
          contentContainerStyle={[styles.gridContainer, { paddingBottom: 100 }]}
          showsVerticalScrollIndicator={false}
        >
          {sortedNotes?.length > 0 ? (
            sortedNotes.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.noteCard, { backgroundColor: colors[index % colors.length] }]}
                onPress={() => router.push(`/notes/edit?id=${item.id}`)}
                onLongPress={() => togglePin(item.id, item.pinned)}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {item.title || 'Untitled'}
                  </Text>
                  {item.pinned && (
                    <View style={styles.pinIndicator}>
                      <Ionicons name="pin" size={16} color="#666" />
                    </View>
                  )}
                </View>
                
                <Text numberOfLines={4} style={styles.cardContent}>
                  {item.content}
                </Text>
                
                <View style={styles.cardFooter}>
                  <Text style={styles.cardDate}>
                    {formatDate(item.updatedAt)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No notes found</Text>
              <Text style={styles.emptySubtitle}>
                {filter === "pinned" ? "No pinned notes yet" : "Create your first note to get started"}
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Add Button */}
        <TouchableOpacity style={styles.addButton} onPress={() => router.push("/notes/create")}>
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdfcf7", // updated
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "#fdfcf7", // updated
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  menuButton: {
    padding: 8,
  },
  dropdown: {
    position: "absolute",
    right: 20,
    top: 90,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1000,
    minWidth: 180,
    overflow: "hidden",
  },
  dropdownItemContainer: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  dropdownItem: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginHorizontal: 20,
  },
  logoutText: {
    color: "#ff3b30",
  },
  searchContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: "#fff", // softer search box
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  filterBar: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  filterBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: "#fff", // updated
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  activeFilter: {
    backgroundColor: "#845d6dff", // updated
    borderColor: "#845d6dff", // updated
  },
  filterText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },
  activeFilterText: {
    color: "#fff",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  noteCard: {
    width: "48%",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    minHeight: 160,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    flex: 1,
  },
  pinIndicator: {
    marginLeft: 8,
    opacity: 0.8,
  },
  cardContent: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    flex: 1,
  },
  cardFooter: {
    marginTop: 12,
    paddingTop: 8,
  },
  cardDate: {
    fontSize: 12,
    color: "#888",
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
    width: "100%",
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  addButton: {
    position: "absolute",
    right: 24,
    bottom: 40,
    backgroundColor: "#845d6dff", // updated
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#845d6dff", // updated
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
});
