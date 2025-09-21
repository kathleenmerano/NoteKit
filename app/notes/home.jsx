import { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Animated, Easing } from "react-native";
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
  const colors = ["#fef9c3", "#bae6fd", "#bbf7d0", "#fecdd3", "#e9d5ff", "#fcd34d"];

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
          deleted: data.deleted ?? false, // Ensure field exists
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
        useNativeDriver: true, // smoother
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
      router.replace("/login"); // navigate to login
    } catch (err) {
      console.log("Logout error:", err.message);
    }
  };

  // Filter notes
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

  return (
    <TouchableWithoutFeedback onPress={handleBackgroundPress}>
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Notes</Text>
          <TouchableOpacity onPress={toggleDropdown}>
            <Ionicons name="menu" size={28} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Dropdown */}
        {dropdownOpen && (
          <Animated.View style={[styles.dropdown, dropdownStyle]}>
            <TouchableOpacity onPress={() => router.push("/notes/recycleBin")}>
              <Text style={styles.dropdownItem}>Recently Deleted</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout}>
              <Text style={styles.dropdownItem}>Log Out</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Search */}
        <TextInput
          style={styles.search}
          placeholder="Search notes..."
          value={search}
          onChangeText={setSearch}
        />

        {/* Filter */}
        <View style={styles.filterBar}>
          <TouchableOpacity onPress={() => setFilter("all")} style={[styles.filterBtn, filter === "all" && styles.activeFilter]}>
            <Text>All</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFilter("pinned")} style={[styles.filterBtn, filter === "pinned" && styles.activeFilter]}>
            <Text>Pinned</Text>
          </TouchableOpacity>
        </View>

        {/* Notes Grid */}
        <ScrollView contentContainerStyle={styles.grid}>
          {sortedNotes?.length > 0 ? (
            sortedNotes.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.card, { backgroundColor: colors[index % colors.length] }]}
                onPress={() => router.push(`/notes/edit?id=${item.id}`)}
                onLongPress={() => togglePin(item.id, item.pinned)}
              >
                {item.pinned && <View style={styles.pinIcon}><Ionicons name="pin" size={18} color="#333" /></View>}
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text numberOfLines={4} style={styles.cardContent}>{item.content}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>No notes found.</Text>
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
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20, paddingTop: 50, paddingBottom: 20 },
  headerTitle: { fontSize: 30, fontWeight: "bold" },
  dropdown: { position: "absolute", right: 15, top: 55, backgroundColor: "#fff", borderWidth: 1, borderColor: "#ccc", borderRadius: 12, zIndex: 10, paddingVertical: 12, paddingHorizontal: 18 },
  dropdownItem: { paddingVertical: 12, fontSize: 16 },
  search: { margin: 15, padding: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 10 },
  filterBar: { flexDirection: "row", marginHorizontal: 15, marginBottom: 10 },
  filterBtn: { paddingVertical: 6, paddingHorizontal: 15, borderRadius: 12, borderWidth: 1, borderColor: "#ccc", marginRight: 10 },
  activeFilter: { backgroundColor: "#ccc4daff", borderColor: "#838187ff", color: "#e7d9d9ff" },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", paddingHorizontal: 10, paddingBottom: 100 },
  card: { width: "48%", padding: 15, borderRadius: 12, marginBottom: 12, minHeight: 120, shadowColor: "#4b4646ff", shadowOpacity: 0.1, shadowRadius: 6, elevation: 3, position: "relative" },
  cardTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  cardContent: { fontSize: 13, color: "#444" },
  pinIcon: { position: "absolute", top: 8, right: 8 },
  emptyText: { textAlign: "center", marginTop: 50, fontSize: 16, color: "#888" },
  addButton: { position: "absolute", right: 20, bottom: 30, backgroundColor: "#030205ff", width: 60, height: 60, borderRadius: 30, justifyContent: "center", alignItems: "center", elevation: 5 },
});
