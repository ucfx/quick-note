import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import type { Note } from '../types/note';

interface NoteCardProps {
  note: Note;
}

export function NoteCard({ note }: NoteCardProps) {
  return (
    <Link href={`/note/${note.id}`} asChild>
      <Pressable style={{...styles.card, backgroundColor: note.color}}>
        <Text style={styles.title} numberOfLines={1}>
          {note.title}
        </Text>
        <Text style={styles.preview} numberOfLines={2}>
          {note.content}
        </Text>
        <View style={styles.tags}>
          {note.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 5,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    width: '48%',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000',
  },
  preview: {
    fontSize: 14,
    color: '#222',
    marginBottom: 12,
    padding: 8,
  },
  taskInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignSelf: 'flex-end',
  },
  tag: {
    backgroundColor: 'rgba(0,0,0,0.06)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: '#666',
  },
});
