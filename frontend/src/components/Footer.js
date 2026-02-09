import React from 'react';
import {
  Box,
  Container,
  Stack,
  Text,
  useColorModeValue,
  Link,
} from '@chakra-ui/react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { SiLeetcode } from 'react-icons/si';

export default function Footer() {
  return (
    <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
    >
      <Container
        as={Stack}
        maxW={'6xl'}
        py={4}
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}
      >
        <Text>© 2026 Naman Bordia. All rights reserved</Text>
        <Stack direction={'row'} spacing={6}>
          <Link href={'https://github.com/NamanBordia'} isExternal>
            <FaGithub size={24} />
          </Link>
          <Link href={'https://www.linkedin.com/in/naman-bordia-bbb609281/'} isExternal>
            <FaLinkedin size={24} />
          </Link>
          <Link href={'https://leetcode.com/u/Naman_Bordia/'} isExternal>
            <SiLeetcode size={24} />
          </Link>
        </Stack>
      </Container>
    </Box>
  );
} 