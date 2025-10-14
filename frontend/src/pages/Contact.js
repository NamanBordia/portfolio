import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  useColorModeValue,
  VStack,
  HStack,
  Icon,
  useToast,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope, FaPhone } from 'react-icons/fa';
import axios from 'axios';

const MotionBox = motion(Box);

const API_URL = 'https://portfolio-backend-1slt.onrender.com';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('Sending contact form to:', `${API_URL}/api/contact`);
      await axios.post(`${API_URL}/api/contact`, formData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log('Contact form sent successfully');
      toast({
        title: 'Message sent!',
        description: "I'll get back to you soon.",
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error sending contact form:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }

    setIsSubmitting(false);
  };

  return (
    <Container maxW={'7xl'} py={12}>
      <Stack spacing={4} as={Container} maxW={'3xl'} textAlign={'center'} mb={10}>
        <Heading fontSize={'3xl'}>Contact Me</Heading>
        <Text color={useColorModeValue('gray.600', 'gray.400')} fontSize={'xl'}>
          Have a question or want to work together? Feel free to reach out!
        </Text>
      </Stack>

      <Stack
        spacing={{ base: 10, md: 20 }}
        direction={{ base: 'column', md: 'row' }}
      >
        <MotionBox
          flex={1}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <VStack spacing={6} align="stretch">
            <Box
              p={6}
              bg={useColorModeValue('white', 'gray.800')}
              rounded={'xl'}
              boxShadow={'lg'}
            >
              <VStack spacing={4} align="stretch">
                <HStack>
                  <Icon as={FaEnvelope} w={6} h={6} color={'brand.500'} />
                  <Text>namanbordia@gmail.com</Text>
                </HStack>
                <HStack>
                  <Icon as={FaPhone} w={6} h={6} color={'brand.500'} />
                  <Text>+91 9351061670</Text>
                </HStack>
                <HStack>
                  <Icon as={FaGithub} w={6} h={6} color={'brand.500'} />
                  <Text>github.com/NamanBordia</Text>
                </HStack>
                <HStack>
                  <Icon as={FaLinkedin} w={6} h={6} color={'brand.500'} />
                  <Text>linkedin.com/in/naman-bordia</Text>
                </HStack>
              </VStack>
            </Box>
          </VStack>
        </MotionBox>

        <MotionBox
          flex={1}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            p={8}
            bg={useColorModeValue('white', 'gray.800')}
            rounded={'xl'}
            boxShadow={'lg'}
          >
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your email"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Message</FormLabel>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your message"
                    rows={6}
                  />
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  width="full"
                  isLoading={isSubmitting}
                >
                  Send Message
                </Button>
              </VStack>
            </form>
          </Box>
        </MotionBox>
      </Stack>
    </Container>
  );
} 