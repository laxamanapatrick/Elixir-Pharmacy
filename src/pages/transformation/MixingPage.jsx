import React from 'react'
import { Box, VStack } from '@chakra-ui/react'
import { ListofRequest } from './mixing/List-of-Request';
import { ListofRequirements } from './mixing/List-of-Requirements';
import { StartMixing } from './mixing/Start-Mixing';

const MixingPage = () => {

  return (
    <VStack spacing={3} w='full' h='83.5vh' p={5} justifyContent='space-between'>
      <Box w='full'>
        <ListofRequest />
        <ListofRequirements />
      </Box>
      <Box w='full'>
        <StartMixing />
      </Box>
    </VStack>
  )

}

export default MixingPage;
