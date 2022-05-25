import React from 'react'
import { Box, Flex, HStack, Input, Text, VStack } from '@chakra-ui/react'
import { FaCloudscale } from 'react-icons/fa'

export const RequirementsInformation = () => {
  return (
    <VStack spacing={5} mt={2} w='full' justifyContent='center'>
      <Text mb={3} fontWeight='semibold' w='90%' bgColor='secondary' color='white' textAlign='center'>Raw Materials Requirements Information</Text>

      <Flex w='90%' justifyContent='space-between'>
        <Text w='45%' pl={2} bgColor='secondary' color='white'>Item Code:</Text>
        <Text w='45%' pl={2} bgColor='gray.200' border='1px'>Ekalam09282</Text>
      </Flex>

      <Flex w='90%' justifyContent='space-between'>
        <Text w='45%' pl={2} bgColor='secondary' color='white'>Item Description:</Text>
        <Text w='45%' pl={2} bgColor='gray.200' border='1px'>Ekalam Jaypee</Text>
      </Flex>

      <Flex w='90%' justifyContent='space-between'>
        <Text w='45%' pl={2} bgColor='secondary' color='white'>MFG Date:</Text>
        <Text w='45%' pl={2} bgColor='gray.200' border='1px'>November ?, 1999</Text>
      </Flex>

      <Flex w='90%' justifyContent='space-between'>
        <Text w='45%' pl={2} bgColor='secondary' color='white'>Expiration Date:</Text>
        <Text w='45%' pl={2} bgColor='gray.200' border='1px'>March ? , 1999</Text>
      </Flex>

      <Flex w='90%' justifyContent='space-between'>
        <Text w='45%' pl={2} bgColor='secondary' color='white'>Balance:</Text>
        <Text w='45%' pl={2} bgColor='gray.200' border='1px'>Poor ako</Text>
      </Flex>

      <Flex w='90%' justifyContent='space-between'>
        <Text w='45%' pl={2} bgColor='secondary' color='white'>Quantity Needed:</Text>
        <Text w='45%' pl={2} bgColor='gray.200' border='1px'>69</Text>
      </Flex>

      <Flex w='90%' justifyContent='space-between'>
        <Text w='45%' pl={2} bgColor='secondary' color='white'>Batch:</Text>
        <Text w='45%' pl={2} bgColor='gray.200' border='1px'>7</Text>
      </Flex>

      <Flex w='90%' justifyContent='space-between'>
        <Text w='45%' pl={2} bgColor='secondary' color='white'>Weighing Scale:</Text>
        <HStack w='45%'>
          <FaCloudscale fontSize='25px' />
          <Input w='full' h={7} p={0} bgColor='#fff8dc' border='1px' type='number' />
        </HStack>
      </Flex>

    </VStack>
  )
}
