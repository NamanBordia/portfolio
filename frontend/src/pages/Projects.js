import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Badge,
  Image,
  Stack,
  Button,
  useColorModeValue,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import axios from 'axios';

const MotionBox = motion(Box);

const ProjectCard = ({ project }) => {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        maxW={'445px'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow={'2xl'}
        rounded={'md'}
        p={6}
        overflow={'hidden'}
        _hover={{
          transform: 'translateY(-5px)',
          transition: 'all 0.3s ease',
        }}
      >
        <Box
          h={'210px'}
          bg={'gray.100'}
          mt={-6}
          mx={-6}
          mb={6}
          pos={'relative'}
        >
          <Image
            src={project.image}
            fallbackSrc="https://via.placeholder.com/400x210"
            layout={'fill'}
          />
        </Box>
        <Stack>
          <Text
            color={'green.500'}
            textTransform={'uppercase'}
            fontWeight={800}
            fontSize={'sm'}
            letterSpacing={1.1}
          >
            Project
          </Text>
          <Heading
            color={useColorModeValue('gray.700', 'white')}
            fontSize={'2xl'}
            fontFamily={'body'}
          >
            {project.title}
          </Heading>
          <Text color={'gray.500'}>{project.description}</Text>
        </Stack>
        <Stack mt={6} direction={'row'} spacing={4} align={'center'}>
          <Stack direction={'row'} spacing={4}>
            {project.technologies.map((tech) => (
              <Tag
                size={'sm'}
                key={tech}
                borderRadius="full"
                variant="solid"
                colorScheme="brand"
              >
                <TagLabel>{tech}</TagLabel>
              </Tag>
            ))}
          </Stack>
        </Stack>
        <Stack mt={6} direction={'row'} spacing={4}>
          <Button
            leftIcon={<FaGithub />}
            as="a"
            href={project.github}
            target="_blank"
            size="sm"
            colorScheme="brand"
            variant="outline"
          >
            GitHub
          </Button>
          {project.live && (
            <Button
              leftIcon={<FaExternalLinkAlt />}
              as="a"
              href={project.live}
              target="_blank"
              size="sm"
              colorScheme="brand"
            >
              Live Demo
            </Button>
          )}
        </Stack>
      </Box>
    </MotionBox>
  );
};

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [selectedTech, setSelectedTech] = useState([]);
  const [allTechnologies, setAllTechnologies] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/projects');
        setProjects(response.data);
        // Extract unique technologies
        const techs = new Set();
        response.data.forEach((project) => {
          project.technologies.forEach((tech) => techs.add(tech));
        });
        setAllTechnologies(Array.from(techs));
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((project) =>
    selectedTech.length === 0
      ? true
      : selectedTech.every((tech) => project.technologies.includes(tech))
  );

  const toggleTechnology = (tech) => {
    setSelectedTech((prev) =>
      prev.includes(tech)
        ? prev.filter((t) => t !== tech)
        : [...prev, tech]
    );
  };

  return (
    <Container maxW={'7xl'} py={12}>
      <Stack spacing={4} as={Container} maxW={'3xl'} textAlign={'center'} mb={10}>
        <Heading fontSize={'3xl'}>My Projects</Heading>
        <Text color={useColorModeValue('gray.600', 'gray.400')} fontSize={'xl'}>
          A showcase of my recent work and personal projects
        </Text>
      </Stack>

      <Stack spacing={4} mb={8}>
        <Text fontWeight="bold">Filter by Technology:</Text>
        <HStack spacing={2} wrap="wrap">
          {allTechnologies.map((tech) => (
            <Tag
              key={tech}
              size="md"
              borderRadius="full"
              variant={selectedTech.includes(tech) ? 'solid' : 'outline'}
              colorScheme="brand"
              cursor="pointer"
              onClick={() => toggleTechnology(tech)}
            >
              <TagLabel>{tech}</TagLabel>
              {selectedTech.includes(tech) && <TagCloseButton />}
            </Tag>
          ))}
        </HStack>
      </Stack>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </SimpleGrid>
    </Container>
  );
} 