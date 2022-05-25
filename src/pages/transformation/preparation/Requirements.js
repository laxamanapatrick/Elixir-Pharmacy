import React from 'react'
import { Flex, Table, Tbody, Td, Text, Th, Thead, Tr, VStack } from '@chakra-ui/react'
import PageScrollTransoformation from '../../../components/PageScroll-Transformation'

export const Requirements = () => {
  return (
    <VStack spacing={2} mt={5} w='90%' justifyContent='center'>
      <Text fontWeight='semibold' w='full' bgColor='secondary' color='white' textAlign='center'>Raw Materials Requirements</Text>
      <PageScrollTransoformation minHeight='200px' maxHeight='350px'>
        <Table variant='simple' size='sm'>
          <Thead bgColor='secondary'>
            <Tr>
              <Th color='white'>Line</Th>
              <Th color='white'>Item Code</Th>
              <Th color='white'>Item Description</Th>
              <Th color='white'>UOM</Th>
              <Th color='white'>Batch</Th>
              <Th color='white'>Quantity</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr bgColor='table_accent'>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
            </Tr>
            <Tr>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
            </Tr>
            <Tr>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
            </Tr>
            <Tr>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
            </Tr>
            <Tr>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
            </Tr>
            <Tr>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
            </Tr>
            <Tr>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
            </Tr>
            <Tr>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
            </Tr>
            <Tr>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
            </Tr>
            <Tr>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
            </Tr>
            <Tr>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
            </Tr>
            <Tr>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
            </Tr>
            <Tr>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
            </Tr>
            <Tr>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
            </Tr>
            <Tr>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
              <Td>Yo</Td>
            </Tr>
          </Tbody>
        </Table>
      </PageScrollTransoformation>
      <Text w='full' fontSize='xs' textAlign='start'>4 Remaining raw mats</Text>
    </VStack>
  )
}
