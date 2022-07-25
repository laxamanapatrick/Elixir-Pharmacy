//Warehouse Receiving Confirm Reject

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
import ViewingModal from './wh-receiving-confirm-reject/WH-Receiving-ConfirmReject-Modal';
import { NotificationContext } from '../../context/NotificationContext';

const fetchRejectRMApi = async (pageNumber, pageSize, search) => {
  const res = await apiClient.get(`Receiving/GetAllWarehouseConfirmRejectWithPaginationOrig?pageNumber=${pageNumber}&pageSize=${pageSize}&search=${search}`);
  return res.data
}

const WHConfirmReject = ({ fetchNotification }) => {

  const [rejectedMaterialsData, setRejectedMaterialsData] = useState([])
  const [viewingData, setViewingData] = useState([])
  const [viewingId, setViewingId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const [pageTotal, setPageTotal] = useState(undefined)
  const [search, setSearch] = useState("")

  const { isOpen: isViewingModalOpen, onOpen: openViewingModal, onClose: closeViewingModal } = useDisclosure()

  const outerLimit = 2;
  const innerLimit = 2;
  const { currentPage, setCurrentPage, pagesCount, pages, setPageSize, pageSize } = usePagination({
    total: pageTotal,
    limits: {
      outer: outerLimit,
      inner: innerLimit,
    },
    initialState: { currentPage: 1, pageSize: 5 },
  })

  const fetchRejectMaterials = () => {
    fetchRejectRMApi(currentPage, pageSize, search).then(res => {
      // setIsLoading(false)
      setRejectedMaterialsData(res)
      // setPageTotal(res.totalCount)
    })
  }

  useEffect(() => {
    fetchRejectMaterials()

    return () => {
      setRejectedMaterialsData([])
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

  const viewingHandler = (data, id) => {
    setViewingData(data)
    setViewingId(id)
    openViewingModal()
  }

  return (
    <Flex p={5} w="full" flexDirection='column'>
      <Flex justifyContent='center'>
        <Heading color='secondary' fontSize='xl' justifyContent='c'>Warehouse Receiving Confirm Reject</Heading>
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
              Number of Records: {rejectedMaterialsData?.reject?.length}
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
                  <Th color="white">Receiving Date</Th>
                  <Th color="white">Confirm Date</Th>
                  <Th color="white">View</Th>
                </Tr>
              </Thead>
              <Tbody>
                {rejectedMaterialsData?.reject?.map(rmd =>
                  <Tr key={rmd.id}>
                    {/* <Td>{rmd.id}</Td> */}
                    <Td>{rmd.pO_Number}</Td>
                    <Td>{rmd.itemCode}</Td>
                    <Td>{rmd.itemDescription}</Td>
                    <Td>{rmd.supplier}</Td>
                    <Td>{rmd.uom}</Td>
                    <Td>{rmd.quantityOrdered.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td>
                    <Td>{rmd.actualGood.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td>
                    <Td>{rmd.actualReject.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td>
                    <Td>{rmd.receivingDate}</Td>
                    <Td>{rmd.confirmDate}</Td>
                    <Td>
                      <Button
                        onClick={() => viewingHandler(rmd, rmd.id)}
                        color='white' colorScheme='blue' _hover={{ bgColor: 'secondary', color: 'white' }} size='xs'
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

      {
        isViewingModalOpen && (
          <ViewingModal
            viewingId={viewingId}
            viewingData={viewingData}
            isOpen={openViewingModal}
            onClose={closeViewingModal}
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

export default WHConfirmReject