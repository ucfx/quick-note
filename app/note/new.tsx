import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import type { NoteColor } from '../../types/note';
import { COLORS } from '@/constants/colors';

// const COLORS: { label: string; value: string }[] = [
//   { label: "Default", value: "#FFFFFF" }, 
//   { label: "Red", value: "#FF4C4C" }, 
//   { label: "Orange", value: "#FF9F40" }, 
//   { label: "Yellow", value: "#FFD93D" },
//   { label: "Green", value: "#4CAF50" },
//   { label: "Blue", value: "#4F86F7" }, 
//   { label: "Purple", value: "#9C27B0" },
//   { label: "Pink", value: "#FF66B2" }, 
// ];

export default function NewNote() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [color, setColor] = useState<NoteColor>('default');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit() {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setIsLoading(true);
    setError(null);

    const tagsArray = tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    try {
      const { data, error: insertError } = await supabase
        .from('notes')
        .insert([
          {
            title,
            content,
            tags: tagsArray,
            color,
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      router.replace(`/note/${data.id}`);
    } catch (err) {
      console.log('Failed to create note:', err);
      setError(err instanceof Error ? err.message : 'Failed to create note');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </Pressable>
        <Text style={styles.headerTitle}>New Note</Text>
        <Pressable
          onPress={handleSubmit}
          disabled={isLoading}
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
        >
          <Text style={styles.saveButtonText}>
            {isLoading ? 'Saving...' : 'Save'}
          </Text>
        </Pressable>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <TextInput
        style={styles.titleInput}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        maxLength={255}
      />

      <View style={styles.colorPicker}>
        <Text style={styles.label}>Color:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.colorList}>
            {COLORS.map(({ label, value }) => (
              <Pressable
                key={value}
                onPress={() => setColor(value as NoteColor)}
                style={[
                  styles.colorOption,
                  { backgroundColor: value === 'default' ? '#ffffff' : value },
                  color === value && styles.colorOptionSelected,
                ]}
              >
                {color === value && (
                  <Ionicons
                    name="checkmark"
                    size={16}
                    color='#000000'
                  />
                )}
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>

      <TextInput
        style={styles.contentInput}
        placeholder="Note content"
        value={content}
        onChangeText={setContent}
        multiline
        textAlignVertical="top"
      />

      <View style={styles.tagsContainer}>
        <Text style={styles.label}>Tags:</Text>
        <TextInput
          style={styles.tagsInput}
          placeholder="Enter tags separated by commas"
          value={tags}
          onChangeText={setTags}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  errorText: {
    color: '#ff3b30',
    padding: 16,
    textAlign: 'center',
  },
  titleInput: {
    fontSize: 24,
    fontWeight: '600',
    padding: 16,
    marginBottom: 8,
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    padding: 16,
    minHeight: 200,
  },
  colorPicker: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  colorList: {
    flexDirection: 'row',
    gap: 12,
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e1e1e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorOptionSelected: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  tagsContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e1e1e1',
  },
  tagsInput: {
    fontSize: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e1e1e1',
    borderRadius: 8,
  },
});
