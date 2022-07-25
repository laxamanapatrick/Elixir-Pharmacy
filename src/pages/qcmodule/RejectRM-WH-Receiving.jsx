// Reject RM - Warehouse Receiving

import React, { useState, useEffect, useContext } from 'react'
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
  useToast
} from '@chakra-ui/react';
import apiClient from '../../services/apiClient';
import { useDisclosure } from '@chakra-ui/react';
import { decodeUser } from '../../services/decode-user';
import {
  Pagination,
  usePagination,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
  PaginationContainer,
  PaginationPageGroup,
} from '@ajna/pagination'
import { FaSearch } from 'react-icons/fa'
import PageScroll from '../../components/PageScroll';
import ApproveModal from './rm-nearly-expire-page/Approve-Modal';
import RejectModal from './rm-nearly-expire-page/Reject-Modal';
import ConfirmModal from './reject-rm-forwh-receiving/Confirm-Modal';
import ReturnModal from './reject-rm-forwh-receiving/Return-Modal';
import { NotificationContext } from '../../context/NotificationContext';
import moment from 'moment';

const fetchRejectRMWHApi = async (pageNumber, pageSize, search) => {
  const res = await apiClient.get(`Warehouse/GetAllRejectMaterialsFromWarehouseOrig?pageNumber=${pageNumber}&pageSize=${pageSize}&search=${search}`);
  return res.data
}

const RejectRMWHReceiving = ({ fetchNotification }) => {

  const [rejectData, setRejectData] = useState([])
  const [qcReceivingId, setQcReceivingId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const [search, setSearch] = useState("")
  const [pageTotal, setPageTotal] = useState(undefined)

  const { isOpen: isConfirmModalOpen, onOpen: openConfirmModal, onClose: closeConfirmModal } = useDisclosure()
  const { isOpen: isReturnModalOpen, onOpen: openReturnModal, onClose: closeReturnModal } = useDisclosure()

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


  const fetchReject = () => {
    fetchRejectRMWHApi(currentPage, pageSize, search).then(res => {
      setIsLoading(false)
      setRejectData(res)
      setPageTotal(res.totalCount)
    })
  }

  useEffect(() => {
    fetchReject()

    return () => {
      setRejectData([])
    }
  }, [currentPage, pageSize, search]);

  const searchHandler = (inputValue) => {
    setSearch(inputValue)
  }

  const handlePageChange = (nextPage) => {
    setCurrentPage(nextPage)
  }

  const handlePageSizeChange = (e) => {
    const pageSize = Number(e.target.value)
    setPageSize(pageSize)
  }

  const confirmRejectedHandler = (data) => {
    openConfirmModal()
    setQcReceivingId(data)
  }

  const returnRejectedHandler = (data) => {
    openReturnModal()
    setQcReceivingId(data)
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
              Number of Records: {rejectData?.reject?.length}
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
                  <Th color="white">Remarks</Th>
                  <Th color="white">Confirm</Th>
                  <Th color="white">Return</Th>
                </Tr>
              </Thead>
              <Tbody>
                {rejectData.reject?.map(rd =>
                  <Tr key={rd.id}>
                    {/* <Td>{rd.id}</Td> */}
                    <Td>{rd.pO_Number}</Td>
                    <Td>{rd.itemCode}</Td>
                    <Td>{rd.itemDescription}</Td>
                    <Td>{rd.supplier}</Td>
                    <Td>{rd.uom}</Td>
                    <Td>{rd.quantityOrdered.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td>
                    <Td>{rd.actualGood.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td>
                    <Td>{rd.actualReject.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td>
                    <Td>{moment(rd.receivingDate).format("MM-DD-YYYY")}</Td>
                    <Td>{rd.remarks}</Td>
                    <Td>
                      <Button
                        onClick={() => confirmRejectedHandler(rd.qcReceivingId)}
                        color='white' colorScheme='blue' _hover={{ bgColor: 'secondary', color: 'white' }} size='xs'
                      >
                        Confirm
                      </Button>
                    </Td>
                    <Td>
                      <Button
                        onClick={() => returnRejectedHandler(rd.qcReceivingId)}
                        color='white' colorScheme='red' _hover={{ bgColor: 'secondary', color: 'white' }} size='xs'
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

      {
        isConfirmModalOpen && (
          <ConfirmModal
            qcReceivingId={qcReceivingId}
            fetchReject={fetchReject}
            isOpen={isConfirmModalOpen}
            onClose={closeConfirmModal}
            fetchNotification={fetchNotification}
          />
        )
      }

      {
        isReturnModalOpen && (
          <ReturnModal
            qcReceivingId={qcReceivingId}
            fetchReject={fetchReject}
            isOpen={isReturnModalOpen}
            onClose={closeReturnModal}
            fetchNotification={fetchNotification}
          />
        )
      }

    </Flex >
  )
}

export default RejectRMWHReceiving
