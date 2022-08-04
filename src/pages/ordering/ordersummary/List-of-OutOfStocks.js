import React, { useState } from 'react'
import { Box, Flex, HStack, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react'
import { CgDanger } from 'react-icons/cg'
import PageScrollReusable from '../../../components/PageScroll-Reusable'

export const ListofOutOfStocks = ({ noStockData }) => {

  const TableHead = [
    "Line", "Order Date", "Date Needed",
    "Customer Code", "Customer Name", "Category", "Item Code", "Item Description",
    "UOM", "Quantity Order"
  ]

  return (
    <Flex width='full' p={5} flexDirection='column'>

      <Flex flexDirection='column' mt={3}>
        <Flex w='full' bgColor='secondary' justifyContent='center'>
          <Text color='white'>List of Out of Stocks</Text>
          <Box p={0} ml={2}><CgDanger fontSize='25px' color='#ed2d47' p={0} /></Box>
        </Flex>
        <PageScrollReusable minHeight='200px' maxHeight='250px'>
          <Table size='sm'>
            <Thead bgColor='secondary'>
              <Tr>
                {TableHead?.map((t, i) => <Th color='white' key={i}>{t}</Th>)}
              </Tr>
            </Thead>
            <Tbody>
              {noStockData?.map((stock, i) =>
                stock.quantityOrder > stock.stockOnHand ?
                  <Tr key={i}>
                    <Td>{i + 1}</Td>
                    <Td>{stock.orderDate}</Td>
                    <Td>{stock.dateNeeded}</Td>
                    <Td>{stock.farmCode}</Td>
                    <Td>{stock.farm}</Td>
                    <Td>{stock.category}</Td>
                    <Td>{stock.itemCode}</Td>
                    <Td>{stock.itemDescription}</Td>
                    <Td>{stock.uom}</Td>
                    <Td>{stock.quantityOrder}</Td>
                  </Tr>
                  : null
              )}
            </Tbody>
          </Table>
        </PageScrollReusable>
        <Text mt={4} fontSize='xs'>Number of records: {noStockData?.length} </Text>
      </Flex>

    </Flex >
  )
}

