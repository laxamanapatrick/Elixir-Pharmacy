import React from 'react'
import { Box, Button, ButtonGroup, Flex, HStack, Input, Text, VStack } from '@chakra-ui/react'
import { MRPTable } from './mrp/MRP-Table'
import { RawMatertialInformation } from './mrp/Raw-Matertial-Information'

const MrpPage = () => {

  return (
    <Flex flexDirection='column' w='full'>
      <Text textAlign='center' color='white' bgColor='accent' py={2}>MRP</Text>
      <VStack w='full' p={5} justifyContent='space-between'>
        <MRPTable />
        <RawMatertialInformation />
      </VStack>
    </Flex>
  )

}

export default MrpPage