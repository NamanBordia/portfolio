import React, { useState, useEffect } from 'react';
import {
  Container,
  SimpleGrid,
  Heading,
  Text,
  Stack,
  useColorModeValue,
  Box,
  Button,
  Tag,
  TagLabel,
  TagCloseButton,
  HStack,
} from '@chakra-ui/react';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { projectsData } from '../data/projects';

const MotionBox = motion(Box);

const ProjectCard = ({ project }) => {
  const textColor = useColorModeValue('gray.700', 'white');
  const bgColor = useColorModeValue('white', 'gray.800');
  const descriptionColor = useColorModeValue('gray.500', 'gray.400');

  return (
    <MotionBox
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      bg={bgColor}
      boxShadow={'xl'}
      rounded={'md'}
      overflow={'hidden'}
    >
      <Stack p={6}>
        <Heading
          color={textColor}
          fontSize={'2xl'}
          fontFamily={'body'}
        >
          {project.title}
        </Heading>
        <Text color={descriptionColor}>{project.description}</Text>

        <Stack direction={'row'} spacing={2} mt={4}>
          {(project.technologies || []).map((tech, i) => (
            <Tag
              key={i}
              size="sm"
              borderRadius="full"
              variant="solid"
              colorScheme="blue"
            >
              {tech}
            </Tag>
          ))}
        </Stack>

        <Stack mt={6} direction={'row'} spacing={4}>
          {project.github && (
            <Button
              leftIcon={<FaGithub />}
              colorScheme="gray"
              variant="outline"
              as="a"
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </Button>
          )}
          {project.demo && (
            <Button
              leftIcon={<FaExternalLinkAlt />}
              colorScheme="blue"
              as="a"
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
            >
              Live Demo
            </Button>
          )}
        </Stack>
      </Stack>
    </MotionBox>
  );
};

const Projects = () => {
  const [projects] = useState(projectsData);
  const [selectedTech, setSelectedTech] = useState([]);
  const [allTechnologies, setAllTechnologies] = useState([]);
  const textColor = useColorModeValue('gray.600', 'gray.400');

  useEffect(() => {
    // Extract unique technologies from projects
    const techs = new Set();
    projectsData.forEach((project) => {
      if (project && project.technologies) {
        project.technologies.forEach((tech) => techs.add(tech));
      }
    });
    setAllTechnologies(Array.from(techs));
  }, []);

  const toggleTechnology = (tech) => {
    setSelectedTech((prev) =>
      prev.includes(tech)
        ? prev.filter((t) => t !== tech)
        : [...prev, tech]
    );
  };

  const filteredProjects = projects.filter((project) =>
    selectedTech.length === 0
      ? true
      : project.technologies && project.technologies.some((tech) => selectedTech.includes(tech))
  );

  return (
    <Container maxW={'7xl'} py={12}>
      <Stack spacing={4} as={Container} maxW={'3xl'} textAlign={'center'} mb={10}>
        <Heading fontSize={'3xl'}>My Projects</Heading>
        <Text color={textColor} fontSize={'xl'}>
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
              variant={selectedTech.includes(tech) ? "solid" : "outline"}
              colorScheme="blue"
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

export default Projects; 