// Cancelled Raw Materials

import React, { useEffect, useState, useContext } from 'react';
import {
  Badge,
  Button,
  Flex,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Skeleton,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
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
import ReturnModalComponent from './cancelled-raw-materials-page/Cancelled-RM-Return-Modal';
import { NotificationContext } from '../../context/NotificationContext';

const fetchCancelledRMApi = async (pageNumber, pageSize, search) => {
  const res = await apiClient.get(`Receiving/GetAllCancelledPoWithPaginationOrig?pageNumber=${pageNumber}&pageSize=${pageSize}&search=${search}`);
  return res.data
}

const CancelledRMPage = ({ notification, fetchNotification }) => {

  const [cancelledData, setCancelledData] = useState([])
  const [poId, setPoId] = useState(null)
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pageTotal, setPageTotal] = useState(undefined);
  const { isOpen: isModalOpen, onOpen: openModal, onClose: closeModal } = useDisclosure()

  const outerLimit = 2;
  const innerLimit = 2;
  const { currentPage, setCurrentPage, pagesCount, pages, setPageSize, pageSize } = usePagination({
    total: pageTotal,
    limits: {
      outer: outerLimit,
      inner: innerLimit,
    },
    initialState: { currentPage: 1, pageSize: 5 },

  });

  const fetchCancelled = () => {
    fetchCancelledRMApi(currentPage, pageSize, search).then(res => {
      setIsLoading(false)
      setCancelledData(res)
      setPageTotal(res.totalCount)
    })
  }

  useEffect(() => {
    fetchCancelled()

    return () => {
      setCancelledData([])
    }
  }, [pageSize, currentPage, search]);

  const handlePageChange = (nextPage) => {
    setCurrentPage(nextPage)
  }

  const handlePageSizeChange = (e) => {
    const pageSize = Number(e.target.value)
    setPageSize(pageSize)
  }

  const searchHandler = (inputValue) => {
    setSearch(inputValue)
  }

  const returnRMHandler = (data) => {
    setPoId(data)
    openModal()
  }

  return (
    <Flex p={5} w="full" flexDirection='column'>
      <Flex justifyContent='center'>
        <Heading color='secondary' fontSize='xl' justifyContent='c'>Cancelled PO</Heading>
      </Flex>

      <Flex mb={2} justifyContent='space-between'>
        <HStack>
          <InputGroup>
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
          </InputGroup>

        </HStack>
        <HStack>
          <Badge colorScheme='green'>
            <Text color='secondary'>
              Number of Records: {cancelledData.cancel?.length}
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
                  <Th color="white">Qty. Ordered</Th>
                  <Th color="white">Qty. Cancel</Th>
                  <Th color="white">Qty. Good</Th>
                  <Th color="white">Date Cancelled</Th>
                  <Th color="white">Remarks</Th>
                  <Th color="white">Return</Th>
                </Tr>
              </Thead>
              <Tbody>
                {cancelledData.cancel?.map((c, i) =>
                  <Tr key={i}>
                    {/* <Td>{c.id}</Td> */}
                    <Td>{c.pO_Number}</Td>
                    <Td>{c.itemCode}</Td>
                    <Td>{c.itemDescription}</Td>
                    <Td>{c.supplier}</Td>
                    <Td>{c.quantityOrdered.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td>
                    <Td>{c.quantityCancel.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td>
                    <Td>{c.quantityGood.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td>
                    <Td>{c.dateCancelled}</Td>
                    <Td>{c.remarks}</Td>
                    <Td>
                      <Button
                        onClick={() => returnRMHandler(c.id)}
                        color='white' bgColor='danger' _hover={{ bgColor: 'secondary', color: 'white' }} size='xs'
                      >
                        Return
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

      {
        isModalOpen && (
          <ReturnModalComponent
            poId={poId}
            isOpen={isModalOpen}
            onClose={closeModal}
            fetchCancelled={fetchCancelled}
            notification={notification} fetchNotification={fetchNotification}
          />
        )

      }

      <Flex justifyContent='end' mt={5}>

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

      </Flex>
    </Flex >
  )
}

export default CancelledRMPage