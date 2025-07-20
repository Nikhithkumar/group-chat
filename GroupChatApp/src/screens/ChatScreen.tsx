/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import io, { Socket } from 'socket.io-client';
import uuid from 'react-native-uuid';
import { JoinResponse, Message } from '.';
import { useRoute } from '@react-navigation/native';
import AppView from '../components/AppView';
import { useMessageStore } from '../store/messageStore';
import AppText from '../components/AppText';
// import { useMessageStore } from '../store/messageStore';

const SOCKET_URL = 'http://localhost:5000/'; // change to your IP if testing on device

const ChatScreen = () => {
  const route = useRoute<any>();
  const { username } = route.params;
  const [text, setText] = useState('');
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);

  const { messages, addMessage, setInitialMessages } = useMessageStore();

  const socketRef = useRef<Socket | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const PAGE_SIZE = 20;

  // Load initial 20 messages on mount
  useEffect(() => {
    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.emit('join', { username }, (res: JoinResponse) => {
      if (res.error) {
        console.warn('Join Error:', res.error);
      } else {
        setInitialMessages(res.messages); 
        const last20 = res.messages.slice(-PAGE_SIZE).reverse();
        setDisplayedMessages(last20);
      }
    });

    socket.on('message', (msg: Message) => {
      const newMsg = { ...msg, id: uuid.v4().toString() };
      addMessage(newMsg);
      setDisplayedMessages(prev => [newMsg, ...prev]);
      scrollToBottom();
    });

    socket.on('notification', (text: string) => {
      const notification = {
        id: uuid.v4().toString(),
        username: 'System',
        text,
        timestamp: new Date().toISOString(),
      };
      addMessage(notification);
      setDisplayedMessages(prev => [notification, ...prev]);
      scrollToBottom();
    });

    return () => {
      socket.disconnect();
    };
  }, [username]);

  const loadMoreMessages = () => {
    if (loadingMore || displayedMessages.length >= messages.length) return;
    setLoadingMore(true);

    setTimeout(() => {
      const nextCount = displayedMessages.length + PAGE_SIZE;
      const nextSlice = messages
        .slice(-nextCount, -displayedMessages.length)
        .reverse(); // show older at top
      setDisplayedMessages(prev => [...prev, ...nextSlice]);
      setLoadingMore(false);
    }, 100);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, 100);
  };

  const sendMessage = () => {
    if (!text.trim()) return;
    socketRef.current?.emit('message', text);
    setText('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <AppView style={styles.headerContainer}>
        <AppText style={styles.backArrow}>b</AppText>
        <AppText style={styles.headerTitle}>The Coder Room</AppText>
      </AppView>
      <AppView style={{ flex: 1 }}>
        <FlatList
          ref={flatListRef}
          data={displayedMessages}
          keyExtractor={(item, index) => `key ${item._id} ${index}`}
          renderItem={({ item }) => (
            <AppView
              style={[
                styles.messageContainer,
                item.username === username ? styles.myMsg : styles.otherMsg,
              ]}
            >
              <AppView style={styles.avatar}>
                <AppText style={styles.avatarText}>
                  {item.username?.charAt(0)?.toUpperCase()}
                </AppText>
              </AppView>

              <AppView style={[styles.messageContent]}>
                <AppText style={styles.username}>{item.username}</AppText>
                <AppView
                  style={[
                    styles.msgBubble,
                    item.username === username
                      ? { backgroundColor: '#DCF8C6' }
                      : { backgroundColor: '#E5E5EA' },
                  ]}
                >
                  <AppText style={styles.msgText}>{item.text}</AppText>
                </AppView>
              </AppView>
            </AppView>
          )}
          inverted
          onEndReachedThreshold={0.2}
          onEndReached={loadMoreMessages}
          contentContainerStyle={{ padding: 16 }}
        />

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Type a message..."
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendBtn}>
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </AppView>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  backArrow: {
    fontSize: 24,
    alignItems: 'flex-start',
    position: 'absolute',
    left: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  msgBubble: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: '100%',
  },
  myMsg: {
    alignSelf: 'flex-end',
  },
  otherMsg: {
    alignSelf: 'flex-start',
  },
  username: {
    fontSize: 12,
    color: '#555',
  },
  msgText: {
    fontSize: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 8,
  },
  inputRow: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#CCC',
    backgroundColor: '#FFF',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 45,
  },
  sendBtn: {
    marginLeft: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  sendText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  loadingMore: {
    padding: 10,
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc', // default fallback color
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    alignSelf: 'flex-end',
    marginBottom: 10,
  },

  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

  messageContent: {
    maxWidth: '80%',
  },
});
