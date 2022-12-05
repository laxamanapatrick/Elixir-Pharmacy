import React, { useState } from 'react'
import {
    Flex, HStack, Button, ButtonGroup, Text, useToast, VStack,
    Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader,
    Table, Tbody, Td, Th, Thead, Tr,
} from '@chakra-ui/react'
import PageScrollReusable from '../../../components/PageScroll-Reusable'
import { BsQuestionDiamondFill } from 'react-icons/bs'
import apiClient from '../../../services/apiClient'
import { ToastComponent } from '../../../components/Toast'
import { decodeUser } from '../../../services/decode-user'
import moment from 'moment'
import { useReactToPrint } from 'react-to-print';
import Barcode from 'react-barcode';
import DatePicker from 'react-datepicker'

const currentUser = decodeUser()

export const ViewModal = ({ isOpen, onClose, moveOrderInformation, moveOrderListThirdTable }) => {

    const TableHead = [
        "Line", "Order Date",
        // "Farm Code", "Farm",
        "Item Code",
        "Item Description",
        "Category",
        "UOM",
        "Quantity",
        "Expiration Date",
    ]

    return (
        <>
            <Modal isOpen={isOpen} onClose={() => { }} isCentered size='6xl'>
                <ModalContent>
                    <ModalHeader></ModalHeader>
                    <ModalCloseButton onClick={onClose} />
                    <ModalBody mt={5}>

                        <Flex w='full' flexDirection='column' borderX='1px'>
                            <VStack w='full' spacing={0} mb={2}>
                                <Text w='full' textAlign='center' bgColor='secondary' color='white'>Transact Move Order</Text>
                                <Text w='full' textAlign='center' bgColor='secondary' color='white'>Move Order Information</Text>
                                <VStack w='99%'>
                                    <HStack w='full' justifyContent='space-between' mt={2}>
                                        <Text fontSize='sm'>Order ID:</Text>
                                        <Text textAlign='center' w='full' fontSize='sm' bgColor='gray.200' border='1px' py={1}
                                        >
                                            {moveOrderInformation.orderNo ? moveOrderInformation.orderNo : 'Please select a list'}
                                        </Text>
                                        <Text fontSize='sm'>Delivery Status:</Text>
                                        <Text textAlign='center' w='full' fontSize='sm' bgColor='gray.200' border='1px' py={1}
                                        >
                                            {/* {moveOrderInformation.deliveryStatus ? moveOrderInformation.deliveryStatus : 'Please select a list'} */}
                                            {moveOrderInformation.deliveryStatus ? moveOrderInformation.deliveryStatus : 'Please select a list'}
                                        </Text>
                                        {/* <Text fontSize='sm'>Delivery Date:</Text>
                                        <DatePicker
                                            onChange={(date) => setDeliveryDate(date)}
                                            selected={deliveryDate}
                                            minDate={new Date()}
                                        /> */}
                                    </HStack>
                                    <HStack w='full' justifyContent='start' mt={2}>
                                        <Text fontSize='sm'>Customer Code:</Text>
                                        <Text textAlign='center' w='30.5%' fontSize='sm' bgColor='gray.200' border='1px' py={1}
                                        >
                                            {moveOrderInformation.farmCode ? moveOrderInformation.farmCode : 'Please select a list'}
                                        </Text>
                                        <Text fontSize='sm'>Customer Name:</Text>
                                        <Text textAlign='center' w='69.5%' fontSize='sm' bgColor='gray.200' border='1px' py={1}
                                        >
                                            {moveOrderInformation.farmName ? moveOrderInformation.farmName : 'Please select a list'}
                                        </Text>
                                    </HStack>
                                </VStack>
                            </VStack>
                        </Flex>

                        <Flex w='full' flexDirection='column' border='1px'>
                            <VStack spacing={0}>
                                <Text pb={2} textAlign='center' fontSize='md' color='white' bgColor='secondary' w='full' mb={-1.5}>List of Move Orders</Text>
                                <PageScrollReusable minHeight='500px' maxHeight='550px'>
                                    <Table size='sm' variant='simple'>
                                        <Thead bgColor='secondary'>
                                            <Tr>
                                                {
                                                    TableHead?.map((t, i) =>
                                                        <Th color='white' key={i}>{t}</Th>
                                                    )
                                                }
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {
                                                moveOrderListThirdTable?.map((list, i) =>
                                                    <Tr key={i}>
                                                        <Td>{i + 1}</Td>
                                                        <Td>{list.orderDate}</Td>
                                                        {/* <Td>{list.farmCode}</Td>
                                                        <Td>{list.farmName}</Td> */}
                                                        <Td>{list.itemCode}</Td>
                                                        <Td>{list.itemDescription}</Td>
                                                        <Td>{list.category}</Td>
                                                        <Td>{list.uom}</Td>
                                                        <Td>{list.quantity}</Td>
                                                        <Td>{moment(list.expiration).format('MM/DD/yyyy')}</Td>
                                                    </Tr>
                                                )
                                            }
                                        </Tbody>
                                    </Table>
                                </PageScrollReusable>
                            </VStack>
                        </Flex>

                    </ModalBody>
                    <ModalFooter></ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export const TransactConfirmation = ({ isOpen, onClose, deliveryDate, checkedItems, setCheckedItems, fetchMoveOrderList, setDeliveryDate, fetchNotification }) => {

    const toast = useToast()
    const [isLoading, setIsLoading] = useState(false)

    // const submitHandlerOld = () => {
    //     try {
    //         const res = apiClient.post(`Ordering/TransactListOfMoveOrders`,
    //             moveOrderListThirdTable?.map(item => {
    //                 return {
    //                     orderNo: item.orderNo,
    //                     // orderDate: moment(item.orderDate).format("yyyy-MM-DD"),
    //                     // dateNeeded: moment(item.dateNeeded).format("yyyy-MM-DD"),
    //                     // warehouseId: item.barcodeNo,
    //                     farmType: item.farmType,
    //                     farmName: item.farmName,
    //                     farmCode: item.farmCode,
    //                     // category: item.category,
    //                     // itemCode: item.itemCode,
    //                     // itemDescription: item.itemDescription,
    //                     // uom: item.uom,
    //                     // expirationDate: moment(item.expiration).format("yyyy-MM-DD"),
    //                     // quantityOrdered: item.quantity,
    //                     // deliveryStatus: item.deliveryStatus,
    //                     orderNoPKey: item.orderNoPKey,
    //                     deliveryDate: moment(deliveryDate).format("yyyy-MM-DD"),
    //                     isApprove: item.isApprove,
    //                     preparedBy: currentUser.fullName
    //                 }
    //             })
    //             // [
    //             //     {
    //             //         "orderno": 1,
    //             //         "orderdate": "2022-06-11",
    //             //         "dateneeded": "2022-06-11",
    //             //         "warehouseid": 24045,
    //             //         "farmtype": "POULTRY",
    //             //         "farmname": "BrFarm - Magalang",
    //             //         "farmcode": "334",
    //             //         "category": "FrmSup",
    //             //         "itemcode": "ANTI002",
    //             //         "itemdescription": "AMOX %2",
    //             //         "uom": "EA",
    //             //         "expirationdate": "2022-09-16",
    //             //         "quantityordered": 10,
    //             //         "platenumber": "EHS 228",
    //             //         "ordernopkey": 7441,
    //             //         "deliverydate": "2022-07-13",
    //             //         "isApprove": true,
    //             //         "preparedBy": "Pat"
    //             //     }
    //             // ]
    //         )
    //             .then(res => {
    //                 ToastComponent("Success", "Move order transacted", "success", toast)
    //                 setMoveOrderInformation([])
    //                 fetchMoveOrderList()
    //                 onClose()
    //             })
    //             .catch(err => {
    //                 ToastComponent("Error", "Transaction failed", "error", toast)
    //             })
    //     } catch (error) {
    //     }
    // }

    const submitHandler = () => {
        const arraySubmit = checkedItems?.map(item => {
            return {
                orderNo: item.orderNo,
                farmType: item.farmType,
                farmName: item.farmName,
                farmCode: item.farmCode,
                orderNoPKey: item.orderNoPKey,
                isApprove: item.isApprove,
                deliveryDate: deliveryDate,
                preparedBy: currentUser?.fullName
            }
        })
        setIsLoading(true)
        try {
            const res = apiClient.post(`Ordering/TransactListOfMoveOrders`, arraySubmit)
                .then(res => {
                    ToastComponent("Success", "Move order transacted", "success", toast)
                    fetchNotification()
                    setDeliveryDate('')
                    setCheckedItems([])
                    fetchMoveOrderList()
                    setIsLoading(false)
                    onClose()
                })
                .catch(err => {
                    ToastComponent("Error", "Transaction failed", "error", toast)
                    setIsLoading(false)
                })
        } catch (error) {
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={() => { }} isCentered size='xl'>
            <ModalContent>
                <ModalHeader>
                    <Flex justifyContent='center'>
                        <BsQuestionDiamondFill fontSize='45px' />
                    </Flex>
                </ModalHeader>
                <ModalCloseButton onClick={onClose} />
                <ModalBody>
                    <Flex justifyContent='center' mt={7}>
                        <Text>Are you sure you want to transact this move order?</Text>
                    </Flex>
                </ModalBody>
                <ModalFooter>
                    <ButtonGroup size='sm' mt={7}>
                        <Button
                            onClick={submitHandler}
                            isLoading={isLoading}
                            disabled={isLoading}
                            colorScheme='blue'
                        >
                            Yes
                        </Button>
                        <Button
                            onClick={onClose}
                            isLoading={isLoading}
                            disabled={isLoading}
                            colorScheme='red'
                        >
                            No
                        </Button>
                    </ButtonGroup>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
