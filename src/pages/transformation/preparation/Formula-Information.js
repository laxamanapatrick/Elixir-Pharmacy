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

const fetchInformationApi = async (pageNumber) => {
  const res = await apiClient.get(`Preparation/GetTransformationFormulaPagination/?pageNumber=${pageNumber}&pageSize=1`)
  return res.data
}

export const FormulaInformation = ({ setTransformId, setBatch }) => {

  const [info, setInfo] = useState([])

  const [pageTotal, setPageTotal] = useState(undefined);

  const outerLimit = 2;
  const innerLimit = 2;
  const { currentPage, setCurrentPage, pagesCount, pages } = usePagination({
    total: pageTotal,
    limits: {
      outer: outerLimit,
      inner: innerLimit,
    },
    initialState: { currentPage: 1, pageSize: 1 },
  })

  const fetchInformation = () => {
    fetchInformationApi(currentPage).then(res => {
      setInfo(res)
      setPageTotal(res.totalCount)
    })
  }

  useEffect(() => {
    fetchInformation()

    return () => {
      setInfo([])
    }
  }, [currentPage])

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
                  <Td>{item.quantity}</Td>
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
              <Th color='white'>Stock on Hand</Th>
              <Th color='white'>Batch</Th>
            </Tr>
          </Thead>
          <Tbody>
            {
              info?.preparation?.map((item, i) =>
                <Tr key={i}>
                  <Td>{item.warehouseStock}</Td>
                  <Td>{item.batch}</Td>
                </Tr>
              )
            }
          </Tbody>
        </Table>
        {/* <Text fontSize='xs' w='90%'>{info?.preparation?.length} remaining of transformation formula</Text> */}
      </VStack>


    </Flex >
  )
}
