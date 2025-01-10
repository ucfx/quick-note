import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { NoteCard } from '../../components/NoteCard';
import { supabase } from '../../lib/supabase';
import type { Note } from '../../types/note';

export default function NotesScreen() {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const { data: notes, error } = await supabase
      .from('notes')
      .select('*, tasks(*)')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching notes:', error);
      return;
    }

    console.log(notes);

    setNotes(notes);
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notes}
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
