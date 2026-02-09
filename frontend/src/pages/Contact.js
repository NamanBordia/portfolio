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
  Link,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope, FaPhone } from 'react-icons/fa';
import { SiLeetcode } from 'react-icons/si';
import axios from 'axios';

const MotionBox = motion(Box);

// API URL configuration - use Render backend URL in production
const API_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:8000'
  : 'https://portfolio-backend-1slt.onrender.com';

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

    // Create email subject and body
    const subject = encodeURIComponent(`Portfolio Contact from ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    );
    
    // Use Gmail compose URL - works universally on desktop and mobile
    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=namanbordia@gmail.com&su=${subject}&body=${body}`;
    
    // Open in new tab
    window.open(gmailLink, '_blank');
    
    toast({
      title: 'Opening Gmail!',
      description: "Gmail will open in a new tab with your pre-filled message.",
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
    
    // Reset form
    setFormData({ name: '', email: '', message: '' });
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
                  <Link href="mailto:namanbordia@gmail.com" color="white" _hover={{ textDecoration: 'underline' }}>
                    namanbordia@gmail.com
                  </Link>
                </HStack>
                <HStack>
                  <Icon as={FaPhone} w={6} h={6} color={'brand.500'} />
                  <Link href="tel:+919351061670" color="white" _hover={{ textDecoration: 'underline' }}>
                    +91 9351061670
                  </Link>
                </HStack>
                <HStack>
                  <Icon as={FaGithub} w={6} h={6} color={'brand.500'} />
                  <Link href="https://github.com/NamanBordia" isExternal color="white" _hover={{ textDecoration: 'underline' }}>
                    github.com/NamanBordia
                  </Link>
                </HStack>
                <HStack>
                  <Icon as={FaLinkedin} w={6} h={6} color={'brand.500'} />
                  <Link href="https://www.linkedin.com/in/naman-bordia-bbb609281/" isExternal color="white" _hover={{ textDecoration: 'underline' }}>
                    linkedin.com/in/naman-bordia
                  </Link>
                </HStack>
                <HStack>
                  <Icon as={SiLeetcode} w={6} h={6} color={'brand.500'} />
                  <Link href="https://leetcode.com/u/Naman_Bordia/" isExternal color="white" _hover={{ textDecoration: 'underline' }}>
                    leetcode.com/Naman_Bordia
                  </Link>
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