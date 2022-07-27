import React, { useState, useEffect } from 'react'
import { Button, Flex, HStack, Select, Table, Tbody, Td, Text, Th, Thead, Tr, VStack } from '@chakra-ui/react'
import {
  Pagination,
  usePagination,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
  PaginationContainer,
  PaginationPageGroup,
} from '@ajna/pagination'
import apiClient from '../../../services/apiClient'

export const FormulaInformation = ({ setTransformId, setBatch,
  info,
  setCurrentPage,
  pagesCount,
  currentPage }) => {

  useEffect(() => {
    {
      info?.preparation?.map(item => {
        item.id ? setTransformId(item?.id) : setTransformId(null)
        item.batch ? setBatch(item?.batch) : setBatch(null)
      }
      )
    }
  }, [info])

  const handlePageChange = (nextPage) => {
    setCurrentPage(nextPage)
  }
  
  return (

    <Flex w='full' flexDirection='column' mx={5} mb={10}>

      <Flex w='auto' justifyContent='space-between' mx={5} mt={2}>
        <Flex alignItems='center'>
          {
            info?.preparation?.map(item =>
              <Text key={item} fontWeight='semibold' fontSize='20px'>Transform ID: {item.id}</Text>
            )
          }
        </Flex>















        <Pagination
          pagesCount={pagesCount}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        >
          <PaginationContainer>
            <PaginationPrevious
              border='1px' fontSize='xs' px={2} _hover={{ bg: 'accent', color: 'white' }}
            >
              {"< Previous"}
            </PaginationPrevious>
            <Text mx={1} bgColor='secondary' color='white' px={2} pt={1.5} >{currentPage}</Text>
            <PaginationNext
              border='1px' fontSize='xs' px={4} _hover={{ bg: 'accent', color: 'white' }}
            >
              {"Next >"}
            </PaginationNext>
          </PaginationContainer>
        </Pagination>














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
            {
              info?.preparation?.map((item, i) =>
                <Tr key={i}>
                  <Td>{item.itemCode}</Td>
                  <Td>{item.itemDescription}</Td>
                  <Td>{item.quantity.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td>
                </Tr>
              )
            }
          </Tbody>
        </Table>
      </VStack>

      <VStack w='full' mt={5} justifyContent='center'>
        <Table w='90%' variant='striped' size='sm'>
          <Thead bgColor='secondary'>
            <Tr>
              <Th color='white'>Production Date</Th>
              <Th color='white'>Stock on Hand</Th>
              <Th color='white'>Batch</Th>
            </Tr>
          </Thead>
          <Tbody>
            {
              info?.preparation?.map((item, i) =>
                <Tr key={i}>
                  <Td>{item.prodPlan}</Td>
                  <Td>{item.warehouseStock}</Td>
                  <Td>{item.batch}</Td>
                </Tr>
              )
            }
          </Tbody>
        </Table>
        <Text fontSize='xs' w='90%'>{info?.totalCount} remaining of transformation formula</Text>
      </VStack>


    </Flex >
  )
}
