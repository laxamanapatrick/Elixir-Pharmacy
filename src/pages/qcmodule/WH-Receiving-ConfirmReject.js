//Warehouse Receiving Confirm Reject

import React, { useEffect, useState } from 'react';
import {
  Badge,
  Button,
  Flex,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Skeleton,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import apiClient from '../../services/apiClient';
import { useDisclosure } from '@chakra-ui/react';
import { decodeUser } from '../../services/decode-user';
import { FaSearch } from 'react-icons/fa';
import {
  Pagination,
  usePagination,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
  PaginationContainer,
  PaginationPageGroup,
} from '@ajna/pagination'
import PageScroll from '../../components/PageScroll';

const fetchRejectRMWHApi = async () => {
  const res = await apiClient.get(`Warehouse/GetRejectMaterialsForWarehouse`);
  return res.data
}

const WHConfirmReject = () => {

  const [rejectData, setRejectData] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchReject = () => {
    fetchRejectRMWHApi().then(res => {
      // setIsLoading(false)
      setRejectData(res)
      // setPageTotal(res.totalCount)
    })
  }

  useEffect(() => {
    fetchReject()

    return () => {
      setRejectData([])
    }
  }, []);

  return (
    <Flex p={5} w="full" flexDirection='column'>
      <Flex justifyContent='center'>
        <Heading color='secondary' fontSize='xl' justifyContent='c'>Warehouse Receiving Confirm Reject</Heading>
      </Flex>

      <Flex mb={2} justifyContent='space-between'>
        <HStack>
          {/* <InputGroup>
            <InputLeftElement
              pointerEvents='none'
              children={<FaSearch color='gray.300' />}
            />
            <Input
              onChange={(e) => searchHandler(e.target.value)}
              type='text'
              placeholder='Search: PO Number'
              focusBorderColor='accent'
            />
          </InputGroup> */}
        </HStack>
        <HStack>
          <Badge colorScheme='green'>
            <Text color='secondary'>
              Number of Records: {rejectData?.length}
            </Text>
          </Badge>
        </HStack>
      </Flex>

      {/* Table of data start */}

      <PageScroll>
        {
          isLoading ? (
            <Stack width="full">
              <Skeleton height='20px' />
              <Skeleton height='20px' />
              <Skeleton height='20px' />
              <Skeleton height='20px' />
              <Skeleton height='20px' />
              <Skeleton height='20px' />
            </Stack>
          ) : (
            <Table variant='striped' size="sm">
              <Thead>
                <Tr bgColor="secondary" >
                  {/* <Th color="white">ID</Th> */}
                  <Th color="white">PO NO.</Th>
                  <Th color="white">Item Code</Th>
                  <Th color="white">Description</Th>
                  <Th color="white">Supplier</Th>
                  <Th color="white">UOM</Th>
                  <Th color="white">Qty. Ordered</Th>
                  <Th color="white">Actual Good</Th>
                  <Th color="white">Actual Reject</Th>
                  <Th color="white">Expiration Date</Th>
                  <Th color="white">Receiving Date</Th>
                  <Th color="white">View</Th>
                </Tr>
              </Thead>
              <Tbody>
                {rejectData?.map(rd =>
                  <Tr key={rd.id}>
                    {/* <Td>{rd.id}</Td> */}
                    <Td>{rd.pO_Number}</Td>
                    <Td>{rd.itemCode}</Td>
                    <Td>{rd.itemDescription}</Td>
                    <Td>{rd.supplier}</Td>
                    <Td>{rd.uom}</Td>
                    <Td>{rd.quantityOrdered}</Td>
                    <Td>{rd.actualGood}</Td>
                    <Td>{rd.reject}</Td>
                    <Td>{rd.receivingDate}</Td>
                    <Td>{rd.confirmDate}</Td>
                    <Td>
                      <Button
                        // onClick={() => cancelReceivingHandler(wh)}
                        color='white' bgColor='blue' _hover={{ bgColor: 'secondary', color: 'white' }} size='xs'
                      >
                        View
                      </Button>
                    </Td>
                  </Tr>
                )
                }
              </Tbody>
            </Table>
          )
        }
      </PageScroll>

      {/* Table data end */}
      {/* 
      {
        isModalOpen && (
          <ModalComponent
            modalData={modalData}
            isOpen={isModalOpen}
            onClose={closeModal}
            fetchWHReceiving={fetchWHReceiving}
          />
        )

      } */}

      {/* <Flex justifyContent='end' mt={5}>

        <Stack>
          <Pagination
            pagesCount={pagesCount}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          >
            <PaginationContainer>
              <PaginationPrevious bg="secondary" color='white' p={1} _hover={{ bg: 'accent', color: 'white' }}>{"<<"}</PaginationPrevious>
              <PaginationPageGroup ml={1} mr={1}>
                {pages.map((page) => (
                  <PaginationPage
                    _hover={{ bg: 'accent', color: 'white' }}
                    p={3}
                    bg="secondary"
                    color='white'
                    key={`pagination_page_${page}`}
                    page={page}
                  />
                ))}
              </PaginationPageGroup>
              <HStack>
                <PaginationNext bg="secondary" color='white' p={1} _hover={{ bg: 'accent', color: 'white' }}>{">>"}</PaginationNext>
                <Select onChange={handlePageSizeChange} variant='filled'>
                  <option value={Number(5)}>5</option>
                  <option value={Number(10)}>10</option>
                  <option value={Number(25)}>25</option>
                  <option value={Number(50)}>50</option>
                </Select>
              </HStack>
            </PaginationContainer>
          </Pagination>
        </Stack>

      </Flex> */}
    </Flex >
  )
}

export default WHConfirmReject