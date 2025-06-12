import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Input,
  Button,
  useColorModeValue,
  Flex,
  Avatar,
  IconButton,
  Stack,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaRobot, FaUser } from 'react-icons/fa';
import axios from 'axios';

const MotionBox = motion(Box);

const Message = ({ message, isUser }) => {
  const userBg = useColorModeValue('brand.500', 'brand.600');
  const botBg = useColorModeValue('gray.100', 'gray.700');
  const userText = 'white';
  const botText = useColorModeValue('gray.800', 'white');

  const bgColor = isUser ? userBg : botBg;
  const textColor = isUser ? userText : botText;

  return (
    <HStack
      spacing={4}
      alignSelf={isUser ? 'flex-end' : 'flex-start'}
      bg={bgColor}
      color={textColor}
      p={4}
      borderRadius="lg"
      maxW="80%"
    >
      {!isUser && <Avatar icon={<FaRobot />} bg="brand.500" />}
      <Text>{message}</Text>
      {isUser && <Avatar icon={<FaUser />} bg="gray.500" />}
    </HStack>
  );
};

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      text: "Hi! I'm Naman's AI assistant. How can I help you today?",
      isUser: false,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const bgColor = useColorModeValue('white', 'gray.800');
  const scrollbarBg = useColorModeValue('gray.200', 'gray.600');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { text: userMessage, isUser: true }]);
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/chat', {
        question: userMessage,
      });
      setMessages((prev) => [
        ...prev,
        { text: response.data.answer, isUser: false },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          text: 'Sorry, I encountered an error. Please try again.',
          isUser: false,
        },
      ]);
    }

    setIsLoading(false);
  };

  return (
    <Container maxW={'7xl'} py={12}>
      <Stack spacing={4} as={Container} maxW={'3xl'} textAlign={'center'} mb={10}>
        <Heading fontSize={'3xl'}>Chat with AI Assistant</Heading>
        <Text color={useColorModeValue('gray.600', 'gray.400')} fontSize={'xl'}>
          Ask me anything about Naman's experience, skills, or projects
        </Text>
      </Stack>

      <Box
        maxW="3xl"
        mx="auto"
        bg={bgColor}
        rounded="xl"
        boxShadow="lg"
        p={6}
      >
        <VStack spacing={4} align="stretch" h="60vh">
          <Box
            flex={1}
            overflowY="auto"
            css={{
              '&::-webkit-scrollbar': {
                width: '4px',
              },
              '&::-webkit-scrollbar-track': {
                width: '6px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: scrollbarBg,
                borderRadius: '24px',
              },
            }}
          >
            <VStack spacing={4} align="stretch">
              {messages.map((message, index) => (
                <MotionBox
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Message message={message.text} isUser={message.isUser} />
                </MotionBox>
              ))}
              <div ref={messagesEndRef} />
            </VStack>
          </Box>

          <form onSubmit={handleSubmit}>
            <HStack>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
              />
              <IconButton
                type="submit"
                colorScheme="brand"
                aria-label="Send message"
                icon={<FaPaperPlane />}
                isLoading={isLoading}
              />
            </HStack>
          </form>
        </VStack>
      </Box>
    </Container>
  );
} 