import React from 'react';
import { 
  Flex, 
  Text, 
  VStack 
} from '@chakra-ui/react';
import { FormulaInformation } from './preparation/Formula-Information';
import { Requirements } from './preparation/Requirements';
import { ReceivingDetails } from './preparation/Receiving-Details';
import { RequirementsInformation } from './preparation/Requirements-Information';

const PreparationPage = () => {
  return (
    <>
      <Flex p={5} w='full' h='80vh' justifyContent='space-between'>
        <VStack border='1px' borderRight='0.5px' w='full'>
          <FormulaInformation />
          <Requirements />
        </VStack>
        <VStack border='1px' w='full'>
          <ReceivingDetails />
          <RequirementsInformation />
        </VStack>
      </Flex>
    </>
  )
}

export default PreparationPage;
