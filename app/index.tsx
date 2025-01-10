import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Pressable, Text, RefreshControl, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { NoteCard } from '../components/NoteCard';
import { supabase } from '../lib/supabase';
import type { Note } from '../types/note';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '@/constants/colors';

export default function NotesScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [colorFilterOpen, setColorFilterOpen] = useState(false);

  const fetchNotes = async () => {
    setRefreshing(true);
    const { data: notes, error } = await supabase
      .from('notes')
      .select('*, tasks(*)')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching notes:', error);
      setRefreshing(false);
      return;
    }

    setNotes(notes);
    setFilteredNotes(notes);
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchNotes()
    }, [])
  );

  const onRefresh = useCallback(() => {
    fetchNotes();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };


  const toggleColorSelection = (color: string) => {
    let updatedColors = selectedColors.includes(color)
      ? selectedColors.filter((c) => c !== color)
      : [...selectedColors, color];

    setSelectedColors(updatedColors);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Notes ({filteredNotes.length})</Text>
      
      <View>
        <View style={styles.filterInputs}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by word, tag..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={handleSearch}
          />

          {/* Color Filter Toggle */}
          <TouchableOpacity onPress={() => setColorFilterOpen(!colorFilterOpen)} style={styles.filterToggle}>
            <Ionicons name={colorFilterOpen ? 'chevron-up' : 'chevron-down'} size={20} color="#333" />
          </TouchableOpacity>
        </View>

        {colorFilterOpen && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.colorFilters}>
          {COLORS.map(({ value }) => (
            <TouchableOpacity
              key={value}
              style={[styles.colorCheckbox, { borderColor: "rgba(0,0,0,0.2)", backgroundColor: value }]}
              onPress={() => toggleColorSelection(value)}
            >
              {selectedColors.includes(value) && <Ionicons name="checkmark" size={18} color="#000" />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      </View>
      
      {filteredNotes.length === 0 && (
        <Text style={styles.emptyText}>
          No notes found. Try adjusting your search.
        </Text>
      )}

      <FlatList
        numColumns={2}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        data={notes.filter((note) =>
                      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      (note.tags && note.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))) ||
                      (note.color && note.color.toLowerCase().includes(searchQuery.toLowerCase()))
                    )
                    .filter((note) => selectedColors.length === 0 || selectedColors.includes(note.color))}
        renderItem={({ item }) => <NoteCard note={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
      
      <Link href="/note/new" asChild>
        <Pressable style={styles.fab}>
          <Ionicons name="add" size={24} color="#fff" />
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 16,
    paddingTop: 0,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    margin: 16,
  },
  filterInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
    gap: 10,
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    margin: 12,
    color: '#666',
  },
  filterToggle: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterText: {
    fontSize: 16,
    color: '#333',
  },
  colorFilters: {
    height: 48,
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
    paddingBottom: 10
  },
  colorCheckbox: {
    width: 32,
    height: 32,
    marginHorizontal: 8,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
