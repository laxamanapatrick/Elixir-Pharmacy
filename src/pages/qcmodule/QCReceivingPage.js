import React, { useState, useEffect } from 'react'
import {
  Flex,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  Td,
  Button,
  Popover,
  PopoverTrigger,
  Portal,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  VStack,
  PopoverBody,
  Stack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Skeleton,
  Box,
  FormLabel,
  Checkbox,
  Radio,
  RadioGroup
} from '@chakra-ui/react'
import {
  Pagination,
  PaginationContainer,
  PaginationNext,
  PaginationPage,
  PaginationPageGroup,
  PaginationPrevious,
  usePagination
} from '@ajna/pagination'
import PageScroll from '../../components/PageScroll'
import PageScrollModal from '../../components/PageScrollModal'
import PageScrollQCModal from '../../components/PageScrollQCModal'
import { GoCheck } from 'react-icons/go'
import { ImCross } from 'react-icons/im'
import { BsSlashLg } from 'react-icons/bs'
import { FaSearch } from 'react-icons/fa'
import apiClient from '../../services/apiClient'
import { decodeUser } from '../../services/decode-user'
import DateConverter from '../../components/DateConverter'
import moment from 'moment'
import { EditModalComponent } from './qc-receiving-page/Edit-Modal'


const currentUser = decodeUser()

const fetchPoApi = async (pageNumber, pageSize, search) => {
  const res = await apiClient.get(`Receiving/GetAllAvailablePoWithPaginationOrig?pageNumber=${pageNumber}&pageSize=${pageSize}&search=${search}`)
  return res.data
}

const QCReceivingPage = () => {

  const [poData, setPoData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [pageTotal, setPageTotal] = useState(undefined)
  const [search, setSearch] = useState("")
  const [viewingData, setViewingData] = useState([])
  const [editData, setEditData] = useState([])
  const { isOpen: isViewModalOpen, onOpen: openViewModal, onClose: closeViewModal } = useDisclosure()
  const { isOpen: isEditModalOpen, onOpen: openEditModal, onClose: closeEditModal } = useDisclosure()
  const { isOpen: isCancelModalOpen, onOpen: openCancelModal, onClose: closeCancelModal } = useDisclosure()

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

  const fetchPo = () => {
    fetchPoApi(currentPage, pageSize, search).then(res => {
      setIsLoading(false)
      setPoData(res)
      setPageTotal(res.totalCount)
    })
  }

  useEffect(() => {
    fetchPo()
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

  const viewModalHandler = (id, pO_Number, pO_Date, pR_Number, pR_Date) => {
    setViewingData({ id, pO_Number, pO_Date, pR_Number, pR_Date })
    openViewModal()
  }

  const editModalHandler = (data) => {
    setEditData(data)
    openEditModal()
  }

  const cancelModalHandler = () => {
    openCancelModal()
  }

  return (
    <Flex p={5} w='full' flexDirection='column'>
      <Flex justifyContent='center'>
        <Heading color='secondary' fontSize='xl' justifyContent='c'>PO Summary Checklist</Heading>
      </Flex>

      <Flex mb={2} justifyContent='start'>
        <HStack>
          <InputGroup>
            <InputLeftElement
              pointerEvents='none'
              children={<FaSearch color='gray.300' />}
            />
            <Input type='text' placeholder='Search: Role'
              focusBorderColor='accent'
              onChange={(e) => searchHandler(e.target.value)}
            />
          </InputGroup>
        </HStack>
      </Flex>

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
            <Table variant='striped' size='sm'>
              <Thead>
                <Tr bgColor='secondary'>
                  <Th color='white'>PO Summary Id</Th>
                  <Th color='white'>PO No.</Th>
                  <Th color='white'>Item Code</Th>
                  <Th color='white'>Description</Th>
                  <Th color='white'>Supplier</Th>
                  <Th color='white'>UOM</Th>
                  <Th color='white'>Qty. Ordered</Th>
                  <Th color='white'>Actual Good</Th>
                  <Th color='white'>Actual Remaining</Th>
                  <Th color='white'>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>

                {poData.posummary?.map(po =>
                  <Tr key={po.id}>

                    <Td>{po.id}</Td>
                    <Td>{po.pO_Number}</Td>
                    <Td>{po.itemCode}</Td>
                    <Td>{po.itemDescription}</Td>
                    <Td>{po.supplier}</Td>
                    <Td>{po.uom}</Td>
                    <Td>{po.quantityOrdered}</Td>
                    <Td>{po.actualGood}</Td>
                    <Td>{po.actualRemaining}</Td>
                    <Td>
                      <HStack spacing={4}>

                        <Button
                          onClick={() => viewModalHandler(po.id, po.pO_Number, po.pO_Date, po.pR_Number, po.pr_Date)}
                          color='white' bgColor='#5CB85C' _hover={{ bgColor: 'secondary', color: 'white' }} size='xs'
                        >
                          View
                        </Button>

                        <Button
                          onClick={() => editModalHandler(po)}
                          color='white' bgColor='#3C8DBC' _hover={{ bgColor: 'secondary', color: 'white' }} size='xs'
                        >
                          Edit
                        </Button>

                        <Button
                          onClick={() => cancelModalHandler()}
                          color='white' bgColor='danger' _hover={{ bgColor: 'secondary', color: 'white' }} size='xs'
                        >
                          Cancel
                        </Button>

                      </HStack>
                    </Td>

                  </Tr>
                )}

              </Tbody>
            </Table>
          )}
      </PageScroll>

      <Flex justifyContent='end' mt={5}>

        {
          isViewModalOpen && (
            <ViewModalComponent
              isOpen={isViewModalOpen}
              onClose={closeViewModal}
              viewingData={viewingData}
            />
          )
        }

        {
          isEditModalOpen && (
            <EditModalComponent
              isOpen={isEditModalOpen}
              onClose={closeEditModal}
              editData={editData}
              fetchPo={fetchPo}
            />
          )
        }

        {
          isCancelModalOpen && (
            <CancelModalComponent
              isOpen={isCancelModalOpen}
              onClose={closeCancelModal}
            />
          )
        }

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

    </Flex>
  )
}

export default QCReceivingPage

//Viewing Modal

const ViewModalComponent = ({ isOpen, onClose, viewingData }) => {

  return (

    <Flex>
      <Modal size='5xl' isOpen={isOpen} onClose={() => { }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex justifyContent='center'>
              <Text>
                PO Summary
              </Text>
            </Flex>
          </ModalHeader>
          <ModalCloseButton onClick={onClose} />

          <ModalBody>

            <PageScrollModal>
              {
                !viewingData ? (
                  <Stack width="full">
                    <Skeleton height='20px' />
                    <Skeleton height='20px' />
                    <Skeleton height='20px' />
                    <Skeleton height='20px' />
                    <Skeleton height='20px' />
                    <Skeleton height='20px' />
                  </Stack>
                ) : (
                  <Table variant='striped' size='sm'>

                    <Thead>
                      <Tr bgColor='secondary'>
                        <Th color='white'>PO No.</Th>
                        <Th color='white'>Approved Date</Th>
                        <Th color='white'>PR No.</Th>
                        <Th color='white'>PR Date</Th>
                      </Tr>
                    </Thead>

                    <Tbody>
                      <Tr key={viewingData.id}>
                        <Td>{viewingData.pO_Number}</Td>
                        <Td>{moment(viewingData.pO_Date).format("MM/DD/YYYY")}</Td>
                        <Td>{viewingData.pR_Number}</Td>
                        <Td>{moment(viewingData.pR_Date).format("MM/DD/YYYY")}</Td>
                      </Tr>
                    </Tbody>

                  </Table>
                )}
            </PageScrollModal>
          </ModalBody>
          <ModalFooter>
            <Button variant='outline' onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex >
  )

}

//Cancel Modal

const CancelModalComponent = ({ isOpen, onClose }) => {

  const [reasons, setReasons] = useState([])
  const [reasonData, setReasonData] = useState(null)
  const [isDisabled, setIsDisabled] = useState(true)

  const fetchReasonsApi = async () => {
    const res = await apiClient.get(`Reason/GetAllActiveReason`)
    return res.data
  }

  const fetchReasons = () => {
    fetchReasonsApi().then(res => {
      setReasons(res)
    })
  }

  useEffect(() => {
    fetchReasons()
  }, [])

  const reasonHandler = (data) => {
    if (data) {
      setIsDisabled(false)
    } else {
      setIsDisabled(true)
    }

    setReasonData(data)
  }

  return (

    <Flex>
      <Modal size='xl' isOpen={isOpen} onClose={() => { }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex justifyContent='center'>
              <Text>
                Cancel Raw Materials
              </Text>
            </Flex>
          </ModalHeader>
          <ModalCloseButton onClick={onClose} />
          <Flex borderColor='gray.100' borderWidth='5px' borderX='none' borderTop='none'></Flex>
          <ModalBody>

            <Flex justifyContent='center' my={7}>
              <VStack spacing={5}>
                <Text>Are you sure you want to cancel this raw material?</Text>

                {
                  reasons.length > 0 ? (<Select
                    onChange={(e) => reasonHandler(e.target.value)}
                    placeholder='Select Reason'
                  >
                    {reasons.map(reason => (
                      <option key={reason.id} value={reason.id}>{reason.reasonName}</option>
                    ))}

                  </Select>) : "loading"
                }

              </VStack>
            </Flex>

          </ModalBody>
          <Flex borderColor='gray.100' borderWidth='5px' borderX='none' borderTop='none'></Flex>
          <ModalFooter>
            <Button
              disabled={isDisabled}
              _hover={{ bgColor: 'accent', color: 'white' }}
              variant='outline'
              onClick={onClose}
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex >
  )

}

