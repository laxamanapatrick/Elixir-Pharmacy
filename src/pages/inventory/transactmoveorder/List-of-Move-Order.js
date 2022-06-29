import React from 'react'
import { Flex, Table, Tbody, Td, Text, Th, Thead, Tr, VStack } from '@chakra-ui/react'
import PageScrollReusable from '../../../components/PageScroll-Reusable'

export const ListofMoveOrder = () => {

  const TableHead = [
    "Line", "Order Id", "Farm", "Farm Code", "Category", "Total Quantity Order", "Order Date", "Date Needed", "Prepared Date"
  ]

  return (
    <Flex w='full' flexDirection='column'>
      <VStack spacing={0}>
        <Text pb={2} textAlign='center' fontSize='md' color='white' bgColor='secondary' w='full' mb={-1.5}>List of Move Order</Text>
        <PageScrollReusable minHeight='220px' maxHeight='300px'>
          <Table size='sm' variant='simple'>
            <Thead bgColor='secondary'>
              <Tr>
                {
                  TableHead?.map((t, i) =>
                    <Th color='white' key={i}>{t}</Th>
                  )
                }
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>e</Td>
              </Tr>
            </Tbody>
          </Table>
        </PageScrollReusable>
      </VStack>
    </Flex>
  )
}
