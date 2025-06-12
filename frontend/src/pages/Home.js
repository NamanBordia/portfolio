import React from 'react';
import {
  Box,
  Container,
  Stack,
  Text,
  useColorModeValue,
  Button,
  Image,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { Link as RouterLink } from 'react-router-dom';

const MotionBox = motion(Box);

export default function Home() {
  return (
    <Container maxW={'7xl'}>
      <Stack
        align={'center'}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 20, md: 28 }}
        direction={{ base: 'column', md: 'row' }}
      >
        <Stack flex={1} spacing={{ base: 5, md: 10 }}>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Text
              lineHeight={1.1}
              fontWeight={600}
              fontSize={{ base: '3xl', sm: '4xl', lg: '6xl' }}
            >
              <Text
                as={'span'}
                position={'relative'}
                _after={{
                  content: "''",
                  width: 'full',
                  height: '30%',
                  position: 'absolute',
                  bottom: 1,
                  left: 0,
                  bg: useColorModeValue('brand.100', 'brand.900'),
                  zIndex: -1,
                }}
              >
                Hi, I'm
              </Text>
              <br />
              <Text as={'span'} color={'brand.500'}>
                Naman Bordia
              </Text>
            </Text>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Text
              color={useColorModeValue('gray.500', 'gray.400')}
              fontSize={{ base: 'lg', sm: 'xl', lg: '2xl' }}
            >
              <TypeAnimation
                sequence={[
                  'B.Tech CSE Student',
                  1000,
                  'AI/ML Enthusiast',
                  1000,
                  'Full Stack Developer',
                  1000,
                  'Blockchain Developer',
                  1000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
              />
            </Text>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Text
              color={useColorModeValue('gray.600', 'gray.400')}
              fontSize={{ base: 'md', sm: 'lg', lg: 'xl' }}
            >
              Enthusiastic and detail-oriented B.Tech (Hons.) CSE student at RV
              University, Bangalore, with a specialization in AI/ML and a minor in
              Fintech. Experienced in Blockchain, Full Stack Development, and
              Machine Learning.
            </Text>
          </MotionBox>

          <Stack
            spacing={{ base: 4, sm: 6 }}
            direction={{ base: 'column', sm: 'row' }}
          >
            <Button
              as={RouterLink}
              to="/projects"
              rounded={'full'}
              size={'lg'}
              fontWeight={'normal'}
              px={6}
              colorScheme={'brand'}
              bg={'brand.500'}
              _hover={{ bg: 'brand.600' }}
            >
              View Projects
            </Button>
            <Button
              as={RouterLink}
              to="/contact"
              rounded={'full'}
              size={'lg'}
              fontWeight={'normal'}
              px={6}
              leftIcon={<Text>📧</Text>}
            >
              Contact Me
            </Button>
          </Stack>
        </Stack>
        <MotionBox
          flex={1}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Image
            alt={'Hero Image'}
            fit={'cover'}
            align={'center'}
            w={'100%'}
            h={'100%'}
            src={'/assets/myimg2.png'}
            fallbackSrc="https://via.placeholder.com/400"
          />
        </MotionBox>
      </Stack>
    </Container>
  );
} 