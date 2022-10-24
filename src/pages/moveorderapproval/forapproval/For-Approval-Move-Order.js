import React, { useState } from 'react'
import { Button, Flex, HStack, Input, Select, Table, Tbody, Td, Text, Th, Thead, Tr, useDisclosure } from '@chakra-ui/react'
import PageScrollReusable from '../../../components/PageScroll-Reusable'
import { ApproveModal, RejectModal, ViewModal } from './Action-Modals'
import {
    Pagination,
    usePagination,
    PaginationNext,
    PaginationPage,
    PaginationPrevious,
    PaginationContainer,
    PaginationPageGroup,
} from '@ajna/pagination'
import moment from 'moment'

export const ForApprovalMoveOrder = ({ setCurrentPage, setPageSize, setSearch, pagesCount, 
    currentPage, pageSize, 
    forApprovalData, fetchForApprovalMO, orderId, setOrderId, viewData, fetchNotification
}) => {

    const TableHead = [
        "Line", "Order ID", "Customer Code", "Customer Name", "Category", "Total Quantity Order", "Prepared Date",
        // "Date Needed", 
        "View", "Approve", "Reject"
    ]

    const [totalQuantity, setTotalQuantity] = useState('')

    const { isOpen: isView, onClose: closeView, onOpen: openView } = useDisclosure()
    const { isOpen: isApprove, onClose: closeApprove, onOpen: openApprove } = useDisclosure()
    const { isOpen: isReject, onClose: closeReject, onOpen: openReject } = useDisclosure()

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

    const viewHandler = (id) => {
        if (id) {
            setOrderId(id)
        } else {
            setOrderId('')
        }
        openView()
    }

    const approveHandler = (data) => {
        if (data) {
            setOrderId(data.orderNo)
            setTotalQuantity(data.quantity)
        } else {
            setOrderId('')
            setTotalQuantity('')
        }
        openApprove()
    }

    const rejectHandler = (id) => {
        if (id) {
            setOrderId(id)
        } else {
            setOrderId('')
        }
        openReject()
    }

    return (
        <Flex w='full' flexDirection='column' p={5}>
            <Flex justifyContent='space-between'>
                <Select
                    onChange={handlePageSizeChange}
                    w='7%' variant='filled'
                >
                    <option value={Number(10)}>10</option>
                    <option value={Number(20)}>20</option>
                    <option value={Number(30)}>30</option>
                    <option value={Number(50)}>50</option>
                </Select>
                <HStack w='17%'>
                    <Text>Search:</Text>
                    <Input placeholder='Order Id' onChange={(e) => searchHandler(e.target.value)} />
                </HStack>
            </Flex>

            <Flex mt={5}>
                <PageScrollReusable minHeight='200px' maxHeight='500px'>
                    <Table size='sm'>
                        <Thead bgColor='secondary'>
                            <Tr>
                                {TableHead?.map((head, i) => <Th key={i} color='white'>{head}</Th>)}
                            </Tr>
                        </Thead>
                        <Tbody>
                            {forApprovalData?.moveorder?.map((item, i) =>
                                <Tr key={i}>
                                    <Td>{i + 1}</Td>
                                    <Td>{item.orderNo}</Td>
                                    <Td>{item.farmCode}</Td>
                                    <Td>{item.farmName}</Td>
                                    <Td>{item.category}</Td>
                                    <Td>{item.quantity}</Td>
                                    <Td>{moment(item.preparedDate).format("MM/DD/yyyy")}</Td>
                                    {/* <Td>{item.dateNeeded}</Td> */}
                                    <Td>
                                        <Button size='xs' colorScheme='blue' px={4} onClick={() => viewHandler(item.orderNo)}>View</Button>
                                    </Td>
                                    <Td>
                                        <Button size='xs' colorScheme='blue' onClick={() => approveHandler(item)}>Approve</Button>
                                    </Td>
                                    <Td>
                                        <Button size='xs' colorScheme='red' px={3} onClick={() => rejectHandler(item.orderNo)}>Reject</Button>
                                    </Td>
                                </Tr>
                            )}
                        </Tbody>
                    </Table>
                </PageScrollReusable>
            </Flex>

            <Flex justifyContent='space-between' mt={7}>
                <Text fontSize='xs'>
                    {forApprovalData?.moveorder?.length > 0 ? `Showing ${forApprovalData?.moveorder?.length} entries` : 'No entries available'}
                </Text>
                <Flex>
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

            </Flex>

            {
                isView && (
                    <ViewModal
                        isOpen={isView}
                        onClose={closeView}
                        id={orderId}
                        viewData={viewData}
                    />
                )
            }
            {
                isApprove && (
                    <ApproveModal
                        isOpen={isApprove}
                        onClose={closeApprove}
                        orderNo={orderId}
                        fetchForApprovalMO={fetchForApprovalMO}
                        printData={viewData}
                        fetchNotification={fetchNotification}
                        totalQuantity={totalQuantity}
                    />
                )
            }
            {
                isReject && (
                    <RejectModal
                        isOpen={isReject}
                        onClose={closeReject}
                        id={orderId}
                        fetchForApprovalMO={fetchForApprovalMO}
                        fetchNotification={fetchNotification}
                    />
                )
            }

        </Flex>
    )
}
