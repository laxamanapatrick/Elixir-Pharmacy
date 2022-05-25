import { Button, Flex, Table, Tbody, Td, Text, Th, Thead, Tr, VStack } from '@chakra-ui/react'
import React from 'react'

export const FormulaInformation = () => {
  return (
    <Flex w='full' flexDirection='column' mx={5} mb={10}>

      <Flex w='auto' justifyContent='space-between' mx={5} mt={2}>
        <Flex>
          <Text fontWeight='semibold' size='sm'>Transform ID: 21312321332</Text>
        </Flex>
        <Flex>
          <Button variant='outline' size='xs' px={5}>Previous</Button>
          <Text mx={2} fontSize='sm'>1</Text>
          <Button variant='outline' size='xs' px={8}>Next</Button>
        </Flex>
      </Flex>

      <VStack spacing={0.5} mt={5} w='full' justifyContent='center'>
        <Text fontWeight='semibold' w='90%' bgColor='secondary' color='white' textAlign='center'>Transformation Formula Information</Text>
        <Table w='90%' variant='striped' size='sm'>
          <Thead bgColor='secondary'>
            <Tr>
              <Th color='white'>Item Code</Th>
              <Th color='white'>Item Description</Th>
              <Th color='white'>Total Quantity Needed</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
            </Tr>
          </Tbody>
        </Table>
      </VStack>

      <VStack w='full' mt={5} justifyContent='center'>
        <Table w='90%' variant='striped' size='sm'>
          <Thead bgColor='secondary'>
            <Tr>
              <Th color='white'>Item Code</Th>
              <Th color='white'>Item Description</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Yo</Td>
              <Td>Yo</Td>
            </Tr>
          </Tbody>
        </Table>
        <Text fontSize='xs' w='90%'>Some text provided here</Text>
      </VStack>


    </Flex>
  )
}
