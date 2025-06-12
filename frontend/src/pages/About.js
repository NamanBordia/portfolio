import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  SimpleGrid,
  Icon,
  useColorModeValue,
  VStack,
  HStack,
  Badge,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaBriefcase, FaCode, FaAward } from 'react-icons/fa';

const MotionBox = motion(Box);

const Feature = ({ title, text, icon }) => {
  return (
    <Stack
      spacing={4}
      p={6}
      bg={useColorModeValue('white', 'gray.800')}
      rounded={'xl'}
      boxShadow={'lg'}
    >
      <Icon as={icon} w={10} h={10} color={'brand.500'} />
      <Text fontWeight={600}>{title}</Text>
      <Text color={useColorModeValue('gray.600', 'gray.400')}>{text}</Text>
    </Stack>
  );
};

export default function About() {
  return (
    <Container maxW={'7xl'} py={12}>
      <Stack spacing={4} as={Container} maxW={'3xl'} textAlign={'center'} mb={10}>
        <Heading fontSize={'3xl'}>About Me</Heading>
        <Text color={useColorModeValue('gray.600', 'gray.400')} fontSize={'xl'}>
          Get to know more about my journey, skills, and experience
        </Text>
      </Stack>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
        <MotionBox
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <VStack spacing={4} align="stretch">
            <Heading size="md">Education</Heading>
            <Box
              p={5}
              shadow="md"
              borderWidth="1px"
              borderRadius="lg"
              bg={useColorModeValue('white', 'gray.800')}
            >
              <HStack spacing={4}>
                <Icon as={FaGraduationCap} w={6} h={6} color={'brand.500'} />
                <VStack align="start">
                  <Text fontWeight="bold">B.Tech (Hons.) in Computer Science and Engineering</Text>
                  <Text>RV University, Bangalore</Text>
                  <Text>2023 - 2027</Text>
                  <Text>GPA: 8.965</Text>
                </VStack>
              </HStack>
            </Box>
          </VStack>
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <VStack spacing={4} align="stretch">
            <Heading size="md">Experience</Heading>
            <Box
              p={5}
              shadow="md"
              borderWidth="1px"
              borderRadius="lg"
              bg={useColorModeValue('white', 'gray.800')}
            >
              <HStack spacing={4}>
                <Icon as={FaBriefcase} w={6} h={6} color={'brand.500'} />
                <VStack align="start">
                  <Text fontWeight="bold">CVCSI Research Center, RV University</Text>
                  <Text>2024</Text>
                  <Text>Contributed to data preprocessing and synthetic data generation for ML tasks</Text>
                </VStack>
              </HStack>
            </Box>
          </VStack>
        </MotionBox>
      </SimpleGrid>

      <Stack spacing={4} as={Container} maxW={'3xl'} textAlign={'center'} mt={10}>
        <Heading fontSize={'2xl'}>Skills</Heading>
      </Stack>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} mt={5}>
        <Feature
          icon={FaCode}
          title={'Programming Languages'}
          text={'Python, C, Java, C++, Solidity, HTML, CSS, JavaScript, SQL'}
        />
        <Feature
          icon={FaCode}
          title={'Frameworks & Tools'}
          text={'React.js, Node.js, Flask, Bootstrap, MongoDB, Docker, Git, VS Code'}
        />
        <Feature
          icon={FaCode}
          title={'AI/ML & Others'}
          text={'NumPy, Pandas, Matplotlib, Supervised/Unsupervised Learning, DSA, OS, CN, AWS, Agile, DevOps'}
        />
      </SimpleGrid>

      <Stack spacing={4} as={Container} maxW={'3xl'} textAlign={'center'} mt={10}>
        <Heading fontSize={'2xl'}>Certifications</Heading>
      </Stack>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} mt={5}>
        <Feature
          icon={FaAward}
          title={'Machine Learning Specialization'}
          text={'Coursera'}
        />
        <Feature
          icon={FaAward}
          title={'Big Data Foundations'}
          text={'IBM SkillBuild'}
        />
        <Feature
          icon={FaAward}
          title={'Agile Scrum Foundation'}
          text={'Simplilearn'}
        />
        <Feature
          icon={FaAward}
          title={'Generative AI in Action'}
          text={'IBM SkillBuild'}
        />
      </SimpleGrid>
    </Container>
  );
} 