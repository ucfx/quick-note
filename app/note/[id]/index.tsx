import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../../lib/supabase';
import type { Note } from '../../../types/note';
import { useFocusEffect } from '@react-navigation/native';

export default function NoteScreen() {
  const { id } = useLocalSearchParams();
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(() => {
    fetchNote();
  });

  async function fetchNote() {
    try {
      const { data, error: fetchError } = await supabase
        .from('notes')
        .select('*, tasks(*)')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;
      setNote(data);
    } catch (err) {
      console.error('Error fetching note:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch note');
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error || !note) {
    return (
      <View style={styles.container}>
        <Text>Error: {error || 'Note not found'}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </Pressable>
        <Text style={styles.title}>{note.title}</Text>
      </View>
      <Text style={styles.content}>{note.content}</Text>
      {note.tags.length > 0 && (
        <View style={styles.tags}>
          {note.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  content: {
    fontSize: 16,
    padding: 16,
    lineHeight: 24,
  },
  tasksContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  task: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  taskText: {
    marginLeft: 8,
    fontSize: 16,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
  },
  tag: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: '#666',
  },
});
