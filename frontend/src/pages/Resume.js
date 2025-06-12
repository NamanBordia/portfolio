import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  Button,
  useColorModeValue,
  VStack,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaDownload } from 'react-icons/fa';

const MotionBox = motion(Box);

export default function Resume() {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleDownload = () => {
    // Replace with your actual resume file path
    window.open('/assets/resume.pdf', '_blank');
  };

  return (
    <Container maxW={'7xl'} py={12}>
      <Stack spacing={4} as={Container} maxW={'3xl'} textAlign={'center'} mb={10}>
        <Heading fontSize={'3xl'}>My Resume</Heading>
        <Text color={useColorModeValue('gray.600', 'gray.400')} fontSize={'xl'}>
          Download my resume or view it below
        </Text>
      </Stack>

      <VStack spacing={8} align="stretch">
        <HStack justify="center">
          <Button
            leftIcon={<Icon as={FaDownload} />}
            colorScheme="brand"
            size="lg"
            onClick={handleDownload}
          >
            Download Resume
          </Button>
        </HStack>

        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            bg={bgColor}
            rounded="xl"
            boxShadow="lg"
            p={6}
            borderWidth="1px"
            borderColor={borderColor}
            height="100vh"
            overflow="hidden"
          >
            <iframe
              src="/assets/resume.pdf"
              width="100%"
              height="100%"
              style={{ border: 'none' }}
              title="Resume"
            />
          </Box>
        </MotionBox>
      </VStack>
    </Container>
  );
} 