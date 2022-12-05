// Raw Materials Nearly Expire

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
import ApproveModal from './rm-nearly-expire-page/Approve-Modal';
import RejectModal from './rm-nearly-expire-page/Reject-Modal';
import { NotificationContext } from '../../context/NotificationContext';
import { ViewModal } from './rm-nearly-expire-page/View-Modal';

const fetchRMNearlyExpireApi = async (pageNumber, pageSize, search) => {
  const res = await apiClient.get(`Receiving/GetAllNearlyExpireWithPaginationOrig?pageNumber=${pageNumber}&pageSize=${pageSize}&search=${search}`)
  return res.data
}

const RMNearlyExpirePage = ({ fetchNotification }) => {

  const [nearlyExpireData, setNearlyExpireData] = useState([])
  const [receivingId, setReceivingId] = useState(null)
  const [search, setSearch] = useState("")
  const [pageTotal, setPageTotal] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true)

  const { isOpen: isView, onOpen: openView, onClose: closeView } = useDisclosure()
  const { isOpen: isApproveModalOpen, onOpen: openApproveModal, onClose: closeApproveModal } = useDisclosure()
  const { isOpen: isRejectModalOpen, onOpen: openRejectModal, onClose: closeRejectModal } = useDisclosure()

  const toast = useToast()

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

  const fetchRMNearlyExpire = () => {
    setIsLoading(false)
    fetchRMNearlyExpireApi(currentPage, pageSize, search).then(res => {
      setNearlyExpireData(res)
      setPageTotal(res.totalCount)
    })
  }

  useEffect(() => {
    fetchRMNearlyExpire()

    return () => {
      setNearlyExpireData([])
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

  const approveHandler = (data) => {
    openApproveModal()
    setReceivingId(data)
  }

  const rejectHandler = (data) => {
    openRejectModal()
    setReceivingId(data)
  }

  const viewHandler = (id) => {
    if (id) {
      setReceivingId(id)
      openView()
    } else {
      setReceivingId('')
    }
  }

  return (
    <Flex p={5} w="full" flexDirection='column'>
      <Flex justifyContent='center'>
        <Heading color='secondary' fontSize='xl' justifyContent='center'>Nearly Expired Raw Materials</Heading>
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
              Number of Records: {nearlyExpireData.expiry?.length}
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
                  <Th color="white">PO NO.</Th>
                  <Th color="white">Item Code</Th>
                  <Th color="white">Description</Th>
                  <Th color="white">Supplier</Th>
                  <Th color="white">UOM</Th>
                  <Th color="white">Qty. Ordered</Th>
                  <Th color="white">Actual Good</Th>
                  <Th color="white">Actual Remaining</Th>
                  <Th color="white">Expiry Date</Th>
                  <Th color="white">View</Th>
                  <Th color="white">Approve</Th>
                  <Th color="white">Reject</Th>
                </Tr>
              </Thead>
              <Tbody>
                {nearlyExpireData.expiry?.map((ne, i) =>
                  <Tr key={i}>
                    <Td>{ne.pO_Number}</Td>
                    <Td>{ne.itemCode}</Td>
                    <Td>{ne.itemDescription}</Td>
                    <Td>{ne.supplier}</Td>
                    <Td>{ne.uom}</Td>
                    <Td>{ne.quantityOrdered.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td>
                    <Td>{ne.actualGood.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td>
                    <Td>{ne.actualRemaining.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td>
                    <Td>{ne.expiryDate}</Td>

                    <Td>
                      <Button
                        onClick={() => viewHandler(ne.receivingId)}
                        color='white' colorScheme='green' _hover={{ bgColor: 'secondary', color: 'white' }} size='xs'
                      >
                        View
                      </Button>
                    </Td>

                    <Td>
                      <Button
                        onClick={() => approveHandler(ne.receivingId)}
                        color='white' bgColor='#3C8DBC' _hover={{ bgColor: 'secondary', color: 'white' }} size='xs'
                      >
                        Approve
                      </Button>
                    </Td>

                    <Td>
                      <Button
                        onClick={() => rejectHandler(ne.receivingId)}
                        color='white' bgColor='danger' _hover={{ bgColor: 'secondary', color: 'white' }} size='xs'
                      >
                        Reject
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
        isView && (
          <ViewModal
            isOpen={isView}
            onClose={closeView}
            receivingId={receivingId}
          />
        )
      }

      {
        isApproveModalOpen && (
          <ApproveModal
            receivingId={receivingId}
            fetchRMNearlyExpire={fetchRMNearlyExpire}
            isOpen={isApproveModalOpen}
            onClose={closeApproveModal}
            fetchNotification={fetchNotification}
          />
        )
      }

      {
        isRejectModalOpen && (
          <RejectModal
            receivingId={receivingId}
            fetchRMNearlyExpire={fetchRMNearlyExpire}
            isOpen={isRejectModalOpen}
            onClose={closeRejectModal}
            fetchNotification={fetchNotification}
          />
        )
      }

    </Flex >
  )
}

export default RMNearlyExpirePage
