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
  const userBg = useColorModeValue('gray.200', 'gray.700');
  const botBg = useColorModeValue('brand.500', 'brand.600');
  const userText = useColorModeValue('gray.800', 'white');
  const botText = 'white';

  const bgColor = isUser ? userBg : botBg;
  const textColor = isUser ? userText : botText;

  return (
    <Flex
      justify={isUser ? 'flex-start' : 'flex-end'}
      w="100%"
      mb={4}
    >
      <HStack
        spacing={3}
        alignItems="flex-start"
        maxW="75%"
        direction={isUser ? 'row' : 'row-reverse'}
      >
        <Avatar 
          icon={isUser ? <FaUser /> : <FaRobot />} 
          bg={isUser ? 'gray.500' : 'brand.500'} 
          color="white"
          size="sm"
          mt={1}
        />
        <Box
          bg={bgColor}
          color={textColor}
          px={4}
          py={3}
          borderRadius="xl"
          boxShadow="md"
          position="relative"
          _before={{
            content: '""',
            position: 'absolute',
            top: '10px',
            [isUser ? 'left' : 'right']: '-8px',
            width: 0,
            height: 0,
            borderStyle: 'solid',
            borderWidth: isUser ? '8px 8px 8px 0' : '8px 0 8px 8px',
            borderColor: isUser 
              ? `transparent ${bgColor} transparent transparent`
              : `transparent transparent transparent ${bgColor}`,
          }}
        >
          <Text fontSize="md" lineHeight="1.6" whiteSpace="pre-wrap">
            {message}
          </Text>
        </Box>
      </HStack>
    </Flex>
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
  
  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.800');
  const scrollbarBg = useColorModeValue('gray.300', 'gray.600');
  const scrollbarHoverBg = useColorModeValue('gray.400', 'gray.500');
  const loadingBotBg = useColorModeValue('brand.500', 'brand.600');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headerBg = useColorModeValue('brand.500', 'brand.600');
  const headerBorderColor = useColorModeValue('brand.600', 'brand.700');
  const chatBg = useColorModeValue('gray.50', 'gray.900');
  const inputBg = useColorModeValue('gray.100', 'gray.700');
  const inputFocusBg = useColorModeValue('white', 'gray.600');
  const inputHoverBg = useColorModeValue('gray.50', 'gray.650');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user's message to the messages array
    const userMessage = { text: input, isUser: true };
    const userInput = input; // Store input before clearing
    setMessages(prev => [...prev, userMessage]);
    setInput(''); // Clear input immediately
    setIsLoading(true);

    try {
      // Use local backend for development, Vercel serverless in production
      const apiUrl = process.env.NODE_ENV === 'development' 
        ? 'http://localhost:8000/api/chat'
        : '/api/chat';
      
      const response = await axios.post(apiUrl, 
        { question: userInput },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      setMessages(prev => [...prev, { text: response.data.answer, isUser: false }]);
    } catch (err) {
      console.error('Error in chat:', err);
      // Add error message to chat
      setMessages(prev => [...prev, { 
        text: "Sorry, I encountered an error. Please try again.", 
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW={'7xl'} py={12} minH="100vh">
      <Stack spacing={6} as={Container} maxW={'4xl'} textAlign={'center'} mb={8}>
        <Heading 
          fontSize={{ base: '3xl', md: '4xl' }}
          bgGradient="linear(to-r, brand.400, brand.600)"
          bgClip="text"
          fontWeight="bold"
        >
          Chat with AI Assistant
        </Heading>
        <Text color={textColor} fontSize={'lg'}>
          Ask me anything about Naman's experience, skills, or projects
        </Text>
      </Stack>

      <Box
        maxW="4xl"
        mx="auto"
        bg={bgColor}
        rounded="2xl"
        boxShadow="2xl"
        border="1px"
        borderColor={borderColor}
        overflow="hidden"
      >
        <Box
          bg={headerBg}
          px={6}
          py={4}
          borderBottom="1px"
          borderColor={headerBorderColor}
        >
          <HStack spacing={3}>
            <Avatar icon={<FaRobot />} bg="white" color="brand.500" size="sm" />
            <Box>
              <Text color="white" fontWeight="bold" fontSize="lg">
                Naman's AI Assistant
              </Text>
              <Text color="brand.50" fontSize="sm">
                Online • Ready to help
              </Text>
            </Box>
          </HStack>
        </Box>

        <VStack spacing={0} align="stretch">
          <Box
            h="65vh"
            overflowY="auto"
            p={6}
            bg={chatBg}
            css={{
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                background: scrollbarBg,
                borderRadius: '24px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: scrollbarHoverBg,
              },
            }}
          >
            <VStack spacing={1} align="stretch">
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
              {isLoading && (
                <Flex justify="flex-end" w="100%">
                  <HStack spacing={3} alignItems="flex-start" maxW="75%">
                    <Avatar icon={<FaRobot />} bg="brand.500" color="white" size="sm" mt={1} />
                    <Box
                      bg={loadingBotBg}
                      px={4}
                      py={3}
                      borderRadius="xl"
                      boxShadow="md"
                    >
                      <HStack spacing={1.5}>
                        <Box 
                          as="span"
                          w="8px" 
                          h="8px" 
                          bg="white" 
                          borderRadius="full" 
                          display="inline-block"
                          animation="pulse 1.4s ease-in-out infinite"
                          sx={{
                            '@keyframes pulse': {
                              '0%, 100%': { opacity: 0.4 },
                              '50%': { opacity: 1 },
                            },
                          }}
                        />
                        <Box 
                          as="span"
                          w="8px" 
                          h="8px" 
                          bg="white" 
                          borderRadius="full" 
                          display="inline-block"
                          animation="pulse 1.4s ease-in-out 0.2s infinite"
                          sx={{
                            '@keyframes pulse': {
                              '0%, 100%': { opacity: 0.4 },
                              '50%': { opacity: 1 },
                            },
                          }}
                        />
                        <Box 
                          as="span"
                          w="8px" 
                          h="8px" 
                          bg="white" 
                          borderRadius="full" 
                          display="inline-block"
                          animation="pulse 1.4s ease-in-out 0.4s infinite"
                          sx={{
                            '@keyframes pulse': {
                              '0%, 100%': { opacity: 0.4 },
                              '50%': { opacity: 1 },
                            },
                          }}
                        />
                      </HStack>
                    </Box>
                  </HStack>
                </Flex>
              )}
              <div ref={messagesEndRef} />
            </VStack>
          </Box>

          <Box
            p={6}
            bg={bgColor}
            borderTop="1px"
            borderColor={borderColor}
          >
            <form onSubmit={handleSubmit}>
              <HStack spacing={3}>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  size="lg"
                  borderRadius="xl"
                  bg={inputBg}
                  border="none"
                  _focus={{
                    bg: inputFocusBg,
                    boxShadow: 'lg',
                  }}
                  _hover={{
                    bg: inputHoverBg,
                  }}
                />
                <IconButton
                  type="submit"
                  colorScheme="brand"
                  aria-label="Send message"
                  icon={<FaPaperPlane />}
                  isLoading={isLoading}
                  size="lg"
                  borderRadius="xl"
                  isDisabled={!input.trim()}
                  _hover={{
                    transform: 'scale(1.05)',
                  }}
                  transition="all 0.2s"
                />
              </HStack>
            </form>
          </Box>
        </VStack>
      </Box>
    </Container>
  );
} 