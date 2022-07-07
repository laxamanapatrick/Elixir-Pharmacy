import React, { useState } from 'react'
import { Button, Flex, HStack, Input, Select, Table, Tbody, Td, Text, Th, Thead, Tr, useDisclosure } from '@chakra-ui/react'
import PageScrollReusable from '../../../components/PageScroll-Reusable'
import { RejectModal, TrackModal } from './Action-Modals'
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
import { MdLocationPin } from 'react-icons/md'


export const ApprovedMoveOrder = ({ setCurrentPage, setPageSize, setSearch, pagesCount, currentPage, pageSize, approvedData, fetchApprovedMO }) => {
    const TableHead = [
        "Line", "Order ID", "Farm Code", "Category", "Total Quantity Order", "Prepared Date",
        "Date Needed", "Approved Date", "Track", "Reject"
    ]

    const [orderId, setOrderId] = useState('')

    const [trackData, setTrackData] = useState([{
        barcodeNo: '',
        itemCode: '',
        itemDescription: '',
        quantity: '',
        expirationDate: '',
        isPrepared: '',
        isApproved: ''
    }])

    const { isOpen: isTrack, onClose: closeTrack, onOpen: openTrack } = useDisclosure()
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

    const rejectHandler = (orderNo) => {
        if (orderNo) {
            setOrderId(orderNo)
            openReject()
        } else {
            setOrderId('')
        }
    }

    const trackHandler = (data) => {
        if (data) {
            setTrackData([{
                barcodeNo: data.barcodeNo,
                itemCode: data.itemCode,
                itemDescription: data.itemDescription,
                quantity: data.quantity,
                expirationDate: moment(data.expiration).format("MM/DD/yyyy"),
                isPrepared: data.isPrepared,
                isApproved: data.isApprove
            }])
            openTrack()
        } else {
            setTrackData([{
                barcodeNo: '',
                itemCode: '',
                itemDescription: '',
                quantity: '',
                expirationDate: '',
                isPrepared: '',
                isApproved: ''
            }])
        }
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
                            {
                                approvedData?.moveorder?.map((order, i) =>
                                    <Tr key={i}>
                                        <Td>{i + 1}</Td>
                                        <Td>{order.orderNo}</Td>
                                        <Td>{order.farmCode}</Td>
                                        <Td>{order.category}</Td>
                                        <Td>{order.quantity}</Td>
                                        <Td>{moment(order.preparedDate).format("MM/DD/yyyy")}</Td>
                                        <Td>{moment(order.dateNeeded).format("MM/DD/yyyy")}</Td>
                                        <Td>{moment(order.approvedDate).format("MM/DD/yyyy")}</Td>
                                        <Td>
                                            <Button size='xs' p={0} bgColor='white' onClick={() => trackHandler(order)}>
                                                <MdLocationPin color='#3EB489' fontSize='20px' />
                                            </Button>
                                        </Td>
                                        <Td>
                                            <Button size='xs' colorScheme='red' onClick={() => rejectHandler(order.orderNo)}>Reject</Button>
                                        </Td>
                                    </Tr>
                                )
                            }
                        </Tbody>
                    </Table>
                </PageScrollReusable>
            </Flex>

            <Flex justifyContent='space-between' mt={7}>
                <Text fontSize='xs'>Showing entries</Text>

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
                isTrack && (
                    <TrackModal
                        isOpen={isTrack}
                        onClose={closeTrack}
                        trackData={trackData}
                    />
                )
            }

            {
                isReject && (
                    <RejectModal
                        isOpen={isReject}
                        onClose={closeReject}
                        id={orderId}
                        fetchApprovedMO={fetchApprovedMO}
                    />
                )
            }

        </Flex>
    )
}
