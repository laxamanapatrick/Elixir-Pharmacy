import React from 'react'
import { Box, Flex, Text, VStack } from '@chakra-ui/react'

export const ReceivingDetails = ({ information }) => {

  return (
    <VStack spacing={2} mt={2} w='full' justifyContent='center'>
      <Text fontWeight='semibold' w='90%' bgColor='secondary' color='white' textAlign='center'>Receiving Details of RM Requirements</Text>
      <Flex w='90%' justifyContent='space-between'>
        <Box border='1px' p={1} w='40%'>
          <Text bgColor='secondary' color='white' textAlign='center'>Receiving ID</Text>
          <Text textAlign='center' fontSize='sm' pt={1}>{information?.warehouseReceivedId ? information?.warehouseReceivedId : ''}</Text>
        </Box>
        <Box border='1px' p={1} w='40%'>
          <Text bgColor='secondary' color='white' textAlign='center'>Supplier</Text>
          <Text textAlign='center' fontSize='sm' pt={1}>{information?.supplier ? information?.supplier : ''}</Text>
        </Box>
      </Flex>
    </VStack>
  )
  
}
