import React, { useState, useEffect, useRef } from 'react'
import { Button, ButtonGroup, Flex, Heading, HStack, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Select, Table, Tbody, Td, Text, Th, Thead, Tr, useToast, VStack } from '@chakra-ui/react'
import { BsQuestionOctagonFill } from 'react-icons/bs'
import apiClient from '../../../services/apiClient'
import { ToastComponent } from '../../../components/Toast'
import { decodeUser } from '../../../services/decode-user'
import '../../../theme/styles/stylesheets/stepper.css'
import PageScrollReusable from '../../../components/PageScroll-Reusable'
import { useReactToPrint } from 'react-to-print';
import Barcode from 'react-barcode';
import moment from 'moment'

const currentUser = decodeUser()

export const TrackModal = ({ isOpen, onClose, trackData, trackList }) => {

    const TableHead = [
        "Line", "Barcode", "Item Code", "Item Description", "Quantity", "Expiration Date"
    ]

    return (
        <Modal isOpen={isOpen} onClose={() => { }} isCentered size='5xl'>
            <ModalContent>
                <ModalHeader>
                    <Flex justifyContent='center'>
                    </Flex>
                </ModalHeader>
                <ModalCloseButton onClick={onClose} />

                <ModalBody>

                    <Flex>
                        <div className="tracker">
                            <div className="circle">
                                <div className={trackData[0]?.isPrepared ? "darkShape" : "lightShape"}>&nbsp;</div>
                                <div className="desc">Prepared</div>
                            </div>

                            <div className={trackData[0]?.isApproved ? "darkLine" : "lightLine"}></div>

                            <div className="circle">
                                <div className={trackData[0]?.isApproved ? "darkShape" : "lightShape"}>&nbsp;</div>
                                <div className="desc">Approved</div>
                            </div>

                            <div className={trackData[0]?.isPrint ? "darkLine" : "lightLine"}></div>

                            <div className="circle">
                                <div className={trackData[0]?.isPrint ? "darkShape" : "lightShape"}>&nbsp;</div>
                                <div className="desc">Printing Move Order</div>
                            </div>

                            <div className={trackData[0]?.isTransact ? "darkLine" : "lightLine"}></div>

                            <div className="circle">
                                <div className={trackData[0]?.isTransact ? "darkShape" : "lightShape"}>&nbsp;</div>
                                <div className="desc">Transact Move Order</div>
                            </div>
                        </div>
                    </Flex>

                    <Flex mt={8}>
                        <PageScrollReusable minHeight='150px' maxHeight='300px'>
                            <Table size='sm'>
                                <Thead bgColor='secondary'>
                                    <Tr>
                                        {TableHead?.map((head, i) => <Th color='white' key={i}>{head}</Th>)}
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {
                                        trackList?.map((item, i) =>
                                            <Tr key={i}>
                                                <Td>{i + 1}</Td>
                                                <Td>{item.barcodeNo}</Td>
                                                <Td>{item.itemCode}</Td>
                                                <Td>{item.itemDescription}</Td>
                                                <Td>{item.quantity}</Td>
                                                <Td>{moment(item.expiration).format("MM/DD/yyyy")}</Td>
                                            </Tr>
                                        )
                                    }
                                </Tbody>
                            </Table>
                        </PageScrollReusable>
                    </Flex>

                </ModalBody>

                <ModalFooter>
                    <ButtonGroup size='sm' mt={7}>
                        <Button colorScheme='blackAlpha' onClick={onClose}>Close</Button>
                    </ButtonGroup>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export const PrintModal = ({ isOpen, onClose, printData, closeApprove, fetchApprovedMO, orderId }) => {

    const componentRef = useRef()

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const printAndUpdate = () => {
        try {
            const res = apiClient.put(`Ordering/UpdatePrintStatus`, { orderNo: orderId })
                .then(res => {
                    handlePrint()
                })
                .catch(err => { })
        } catch (error) {
        }
    }

    const dateToday = new Date()

    const closeHandler = () => {
        fetchApprovedMO()
        onClose()
        if (closeApprove) {
            closeApprove()
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={() => { }} isCentered size='5xl'>
            <ModalContent>
                <ModalHeader>
                    <Flex justifyContent='center'>
                    </Flex>
                </ModalHeader>
                <ModalCloseButton onClick={closeHandler} />

                <ModalBody>

                    <Flex w='full' mt={8} p={5} flexDirection='column' ref={componentRef}>

                        <Flex spacing={0} justifyContent='start' flexDirection='column'>
                            <Image
                                src='/images/RDF Logo.png'
                                w='13%' ml={3}
                            />
                            <Text fontSize='8px' ml={2}>Purok 6, Brgy. Lara, City of San Fernando, Pampanga, Philippines</Text>
                        </Flex>

                        <Flex justifyContent='center' my={4}>
                            <Text fontSize='lg' fontWeight='semibold'>Move Order Slip</Text>
                        </Flex>

                        <Flex justifyContent='space-between' mb={3}>
                            <Flex flexDirection='column'>
                                <Text>Order ID: {orderId && orderId}</Text>
                                <Text>Warehouse: {`Pharmacy`}</Text>
                                <Text>Customer: {printData[0]?.farmName}</Text>
                                <Text>Address: {printData[0]?.farmName}</Text>
                            </Flex>
                            <Flex flexDirection='column'>
                                <Barcode width={3} height={50} value={Number(orderId)} />
                                <Text>Date: {moment(dateToday).format("MM/DD/yyyy")}</Text>
                            </Flex>
                        </Flex>

                        <PageScrollReusable minHeight='150px' maxHeight='300px'>
                            <Table size='sm'>
                                <Thead bgColor='secondary'>
                                    <Tr>
                                        <Th color='white'>ITEM CODE</Th>
                                        <Th color='white'>ITEM DESCRIPTION</Th>
                                        <Th color='white'>UOM</Th>
                                        <Th color='white'>QUANTITY</Th>
                                        <Th color='white'>ACTUAL QTY RECEIVED</Th>
                                        <Th color='white'>EXPIRATION DATE</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {
                                        printData?.map((item, i) =>
                                            <Tr key={i}>
                                                <Td>{item.itemCode}</Td>
                                                <Td>{item.itemDescription}</Td>
                                                <Td>{item.uom}</Td>
                                                <Td>{item.quantity}</Td>
                                                <Td></Td>
                                                <Td>{moment(item.expiration).format("MM/DD/yyyy")}</Td>
                                            </Tr>
                                        )
                                    }
                                </Tbody>
                            </Table>
                        </PageScrollReusable>

                        <Flex justifyContent='space-between' mb={5}>
                            <HStack>
                                <Text>Delivery Status:</Text>
                                <Text textDecoration='underline'>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    {printData[0]?.deliveryStatus}
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </Text>
                            </HStack>
                            <VStack spacing={0}>
                                <HStack>
                                    <Text>Checked By:</Text>
                                    <Text textDecoration='underline'>
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    </Text>
                                </HStack>
                                {/* <Text>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    Patrick Laxamana
                                </Text> */}
                            </VStack>
                        </Flex>

                        <Flex justifyContent='space-between'>
                            <VStack spacing={0}>
                                <HStack>
                                    <Text>Prepared By:</Text>
                                    <Text textDecoration='underline'>
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    </Text>
                                </HStack>
                                {/* <Text>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    Patrick Laxamana
                                </Text> */}
                            </VStack>
                            <VStack spacing={0}>
                                <HStack>
                                    <Text>Received By:</Text>
                                    <Text textDecoration='underline'>
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    </Text>
                                </HStack>
                                {/* <Text>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    Jaypee Obidos
                                </Text> */}
                            </VStack>
                        </Flex>

                    </Flex>

                </ModalBody>

                <ModalFooter>
                    <ButtonGroup size='sm' mt={7}>
                        <Button colorScheme='cyan' color='white' onClick={printAndUpdate}>Print</Button>
                        <Button colorScheme='blackAlpha' onClick={closeHandler}>Close</Button>
                    </ButtonGroup>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}


export const RejectModal = ({ isOpen, onClose, id, fetchApprovedMO }) => {

    const [reasonSubmit, setReasonSubmit] = useState('')

    const [reasons, setReasons] = useState([])

    const toast = useToast()

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

        return () => {
            setReasons([])
        }
    }, [])

    const submitHandler = () => {
        try {
            const res = apiClient.put(`Ordering/RejectListOfMoveOrder`,
                {
                    orderNo: id,
                    remarks: reasonSubmit,
                    rejectBy: currentUser?.userName
                }
            )
                .then(res => {
                    ToastComponent("Success", "Move order has been rejected", "success", toast)
                    fetchApprovedMO()
                    onClose()
                })
                .catch(err => {
                    ToastComponent("Error", "Move order was not rejected", "error", toast)
                })
        } catch (error) {
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={() => { }} isCentered size='xl'>
            <ModalContent>
                <ModalHeader>
                    <Flex justifyContent='center'>
                        <Text>Reject</Text>
                    </Flex>
                </ModalHeader>
                <ModalCloseButton onClick={onClose} />

                <ModalBody>
                    <VStack justifyContent='center'>
                        <Text>Are you sure you want to reject this move order?</Text>
                        {
                            reasons?.length > 0 ?
                                <Select
                                    onChange={(e) => setReasonSubmit(e.target.value)}
                                    w='70%' placeholder='Please select a reason'
                                >
                                    {
                                        reasons?.map((reason, i) =>
                                            <option key={i} value={reason.reasonName}>{reason.reasonName}</option>
                                        )
                                    }
                                </Select>
                                : 'loading'
                        }
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <ButtonGroup size='sm' mt={7}>
                        <Button
                            onClick={submitHandler}
                            disabled={!reasonSubmit}
                            colorScheme='blue'
                        >
                            Yes
                        </Button>
                        <Button colorScheme='red' onClick={onClose}>No</Button>
                    </ButtonGroup>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
