import React, { useState, useEffect } from 'react'
import { Flex, Table, Tbody, Td, Text, Th, Thead, Tr, VStack } from '@chakra-ui/react'
import PageScrollTransoformation from '../../../components/PageScroll-Transformation'
import apiClient from '../../../services/apiClient'

export const Requirements = ({ requirements, setItemCode, itemCode }) => {

  useEffect(() => {
    setItemCode(requirements[0]?.rawmaterialCode)
  }, [requirements])

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
            {
              requirements?.map((item, i) =>
                <Tr 
                // onClick={() => setItemCode(item.rawmaterialCode)}
                bgColor={item.rawmaterialCode == itemCode ? 'table_accent' : 'none'}
                key={i}
                >
                  <Td>{i + 1}</Td>
                  <Td>{item.rawmaterialCode}</Td>
                  <Td>{item.rawmaterialDescription}</Td>
                  <Td>{item.uom}</Td>
                  <Td>{item.batch}</Td>
                  <Td>{item.rawmaterialQuantity.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td>
                </Tr>
              )
            }
          </Tbody>
        </Table>
      </PageScrollTransoformation>
    </VStack>
  )
}
