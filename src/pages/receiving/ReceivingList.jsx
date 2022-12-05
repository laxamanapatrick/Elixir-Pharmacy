import React, { useState, useEffect } from 'react'
import {
  Badge,
  Button,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure
} from '@chakra-ui/react'
import PageScrollImport from '../../components/PageScrollImport'
import ReturnModal from './receiving-list/Return-Modal'
import apiClient from '../../services/apiClient'
import NoListData from './receiving-list/No-List-Data'
import { FaSearch } from 'react-icons/fa'
import { Pagination, PaginationContainer, PaginationNext, PaginationPage, PaginationPageGroup, PaginationPrevious, usePagination } from '@ajna/pagination'

const fetchReceivingListApi = async (pageNumber, pageSize, search) => {
  const res = await apiClient.get(`Receiving/GetAllAvailableForWarehouseReceivingWithPaginationOrig?pageNumber=${pageNumber}&pageSize=${pageSize}&search=${search}`)
  return res.data
}
// Warehouse/GetAllListForWarehouseWithPaginationOrig

const ReceivingList = () => {

  const [list, setList] = useState([])
  const [returnId, setReturnId] = useState(null)

  const [search, setSearch] = useState("")
  const [pageTotal, setPageTotal] = useState(undefined);

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

  const fetchReceivingList = () => {
    fetchReceivingListApi(currentPage, pageSize, search).then(res => {
      setList(res)
      setPageTotal(res.totalCount)
    })
  }

  useEffect(() => {
    fetchReceivingList()
  }, [pageSize, currentPage, search])

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

  const returnOpener = (data) => {
    setReturnId(data)
    openReturnModal()
  }

  return (
    <Flex p={4} w='full' flexDirection='column'>

      <Flex justifyContent='space-between' ml='2%' mb={1} mt='-10px'>
        <HStack>
          <InputGroup>
            <InputLeftElement
              pointerEvents='none'
              children={<FaSearch color='gray.300' />}
            />
            <Input type='text' placeholder='Search: PO Number'
              onChange={(e) => searchHandler(e.target.value)}
              focusBorderColor='accent'
            />
          </InputGroup>
        </HStack>

        <HStack mr={8}>
          <Badge colorScheme='green'>
            <Text color='secondary'>
              Number of Records: {list.warehouse?.length}
            </Text>
          </Badge>
        </HStack>

      </Flex>

      <Flex
        h='735px'
        ml='2%'
        w='96%'
        bgColor='white'
        flexDirection='column'
        border='2px'
        borderWidth='5px'
        borderColor='secondary'
        justifyContent='space-between'
      >

        <PageScrollImport>
          {
            !list.warehouse?.length > 0 ? <NoListData /> :

              <Table variant='striped' size="sm">
                <Thead bgColor='secondary'>
                  <Tr>
                    <Th color='white'>PO NO.</Th>
                    <Th color='white'>Item Code</Th>
                    <Th color='white'>Description</Th>
                    <Th color='white'>Qty. Ordered</Th>
                    <Th color='white'>Expected Delivery</Th>
                    <Th color='white'>Actual Delivered</Th>
                    <Th color='white'>Reject</Th>
                    <Th color='white'>Date Checklist created</Th>
                    <Th color='white'>Return</Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {list.warehouse?.map((l, i) =>
                    <Tr key={i}>
                      <Td>{l.pO_Number}</Td>
                      <Td>{l.itemCode}</Td>
                      <Td>{l.itemDescription}</Td>
                      <Td>{l.quantityOrdered.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td>
                      <Td>{l.quantityOrdered.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td>
                      <Td>{l.actualGood.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td>
                      <Td>{l.reject.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td>
                      <Td>{l.qC_ReceivedDate}</Td>
                      <Td>
                        <Button
                          onClick={() => returnOpener(l.id)}
                          colorScheme='red' size='xs'
                        >
                          Return
                        </Button>
                      </Td>
                    </Tr>
                  )
                  }
                </Tbody>
              </Table>

          }
        </PageScrollImport>

      </Flex>

      <Flex justifyContent='end' mt={2}>

        <Stack mr={8}>
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
                <Select
                  onChange={handlePageSizeChange}
                  variant='filled'
                >
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

      {/* <Flex ml={6}>
        <Text>Pagination here</Text>
      </Flex> */}

      {
        isReturnModalOpen && (
          <ReturnModal
            isOpen={isReturnModalOpen}
            onClose={closeReturnModal}
            returnId={returnId}
            fetchReceivingList={fetchReceivingList}
          />
        )
      }

    </Flex>
  )
}

export default ReceivingList