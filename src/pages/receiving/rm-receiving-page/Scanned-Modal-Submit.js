import React, { useState, useContext, useRef } from 'react'
import {
    Box,
    Button,
    ButtonGroup,
    Flex,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure,
    useToast,
    VStack,
    Image,
    Heading
} from '@chakra-ui/react'
import { WarehouseContext } from '../../../context/WarehouseContext'
import apiClient from '../../../services/apiClient'
import { ToastComponent } from '../../../components/Toast'
import { BsFillQuestionOctagonFill } from 'react-icons/bs'
import PrintList from './Print-List'
import { useReactToPrint } from 'react-to-print'
import PageScrollImport from '../../../components/PageScrollImport'
import Barcode from 'react-barcode';
import moment from 'moment'
import { decodeUser } from '../../../services/decode-user'

const currentUser = decodeUser()

const ScannedModalSubmit = ({ itemCodeData, code, receivingDate, lotCategory, actualGood, sumQuantity, submitRejectData, buttonChanger, receivingId, setCode }) => {

    const { setReceivingId, setButtonChanger } = useContext(WarehouseContext)

    const [isLoading, setIsLoading] = useState(false)
    const [printBool, setPrintBool] = useState(false)

    const toast = useToast()

    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: isPrintModalOpen, onOpen: openPrintModal, onClose: closePrintModal } = useDisclosure()

    const componentRef = useRef()
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const submitHandler = () => {
        const firstSubmit = {
            itemCode: code,
            receivingDate: receivingDate,
            lotCategory: lotCategory,
            actualGood: actualGood,
            totalReject: sumQuantity,
            receivedBy: currentUser.fullName
        }
        try {
            setIsLoading(true)
            const res = apiClient.put(`Warehouse/ReceiveRawMaterialsInWarehouse/${firstSubmit.itemCode}`, firstSubmit).then((res) => {
                ToastComponent("Success!", "PO Updated", "success", toast)
                setReceivingId(res.data.id)
                // fetchItemCodeData()
                setButtonChanger(true)
                onClose()

                // take generated id 
                const receivingIdWithoutUseContext = res.data.id

                // final array data for second put
                const secondSubmit = submitRejectData.map(data => {
                    return {
                        warehouseReceivingId: receivingIdWithoutUseContext,
                        quantity: data.quantity,
                        remarks: data.remarks,
                    }
                })

                if (sumQuantity > 0) {
                    try {
                        console.log(code, receivingDate, lotCategory, actualGood, sumQuantity)
                        console.log(secondSubmit)
                        const res = apiClient.put(`Warehouse/RejectMaterialFromWarehouse`, secondSubmit)
                    } catch (err) {
                        console.log(err)
                    }
                }

                // proceed to first put error catch if condition for second put is not met
                handlePrint()
                openPrintModal()
            }
            ).catch(err => {
                setIsLoading(false)
                setButtonChanger(false)
                ToastComponent("Error", err.response.data, "error", toast)
            }
            )
        } catch (err) {
            console.log(err)
        }
    }

    const displayData = {
        "Date": moment().format("MM/DD/YYYY, h:mm:ss a"),
        "Receiving Id": receivingId,
        // "PO Number": itemCodeData.pO_Number,
        "Item Code": itemCodeData.itemCode,
        "Item Description": itemCodeData.itemDescription,
        "UOM": itemCodeData.uom,
        "Supplier": itemCodeData.supplier,
        "Quantity Good": itemCodeData.actualDelivered,
        "Receiving Date": moment(receivingDate).format("MM/DD/YYYY"),
        "Expiration Date": moment(itemCodeData.expiration).format("MM/DD/YYYY"),
        "Lot Category": lotCategory,
        // "Manufacturing Date": moment(itemCodeData.manufacturingDate).format("MM/DD/YYYY"),
        // "Days of Expiration": itemCodeData.expirationDays,
        // "Actual Delivered": itemCodeData.expectedDelivery,
        // "Total Stock": itemCodeData.totalStock,
        // "Updated Stock": parseInt(itemCodeData.totalStock) + parseInt(itemCodeData.actualDelivered),
        // "Actual Good": actualGood,
        // "Actual Reject": sumQuantity,
    }

    return (
        <>
            {
                buttonChanger === true ?
                    (
                        <Flex w='full' justifyContent='center' mt='100px' mr={2}>

                            <Box w='20%' display='none'>
                                <VStack spacing={0} justifyContent='center' ref={componentRef}>

                                    <VStack spacing={0} justifyContent='start'>
                                        <Image
                                            src='/images/RDF Logo.png'
                                            w='20%' ml={3}
                                        />
                                        <Text fontSize='xs' ml={2}>Purok 6, Brgy. Lara, City of San Fernando, Pampanga, Philippines</Text>
                                    </VStack>

                                    <Flex mt={2} w='90%' justifyContent='center'>
                                        <Text fontSize='25px' fontWeight='semibold' ml={4}>Raw Materials</Text>
                                    </Flex>

                                    {Object.keys(displayData)?.map((key, i) =>
                                        <Flex w='full' justifyContent='center' key={i}>
                                            <Flex ml='10%' w='full'>
                                                <Flex>
                                                    <Text fontWeight='semibold' fontSize='10px'>{key}:</Text>
                                                </Flex>
                                            </Flex>
                                            <Flex w='full'>
                                                <Flex>
                                                    <Text fontWeight='semibold' fontSize='10px'>{displayData[key]}</Text>
                                                </Flex>
                                            </Flex>
                                        </Flex>
                                    )}

                                    <VStack spacing={0} w='90%' ml={4} justifyContent='center'>
                                        <Barcode width={3} height={75} value={receivingId} />
                                    </VStack>

                                    <Flex w='full'></Flex>

                                </VStack>
                            </Box>
                        </Flex >
                    )
                    :
                    (
                        <Flex justifyContent='end' mt={2} mr={2}>
                            <Button
                                size='md'
                                onClick={onOpen}
                                colorScheme='blue' _hover={{ bgColor: 'accent' }}
                            >
                                Receive
                            </Button>
                        </Flex>
                    )
            }

            <Modal isOpen={isOpen} onClose={() => { }} isCentered size='md'>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        <Flex justifyContent='center' mt={10}>
                            <BsFillQuestionOctagonFill fontSize='50px' />
                        </Flex>
                    </ModalHeader>
                    <ModalCloseButton onClick={onClose} />
                    <ModalBody>
                        <Flex justifyContent='center'>
                            <Text>Are you sure you want to receive this item?</Text>
                        </Flex>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            onClick={() => submitHandler()}
                            colorScheme='blue' mr={3} _hover={{ bgColor: 'accent' }}
                        >
                            Yes
                        </Button>
                        <Button variant='ghost' onClick={onClose}>No</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {
                isPrintModalOpen && (
                    <PrintList
                        itemCodeData={itemCodeData}
                        receivingDate={receivingDate}
                        lotCategory={lotCategory}
                        actualGood={actualGood}
                        sumQuantity={sumQuantity}
                        submitRejectData={submitRejectData}
                        receivingId={receivingId}
                        setCode={setCode}
                        isOpen={isPrintModalOpen}
                        onClose={closePrintModal}
                    />
                )
            }

        </>
    )
}

export default ScannedModalSubmit








// {
//     isPrintModalOpen && (
//         <PrintList
//             itemCodeData={itemCodeData}
//             receivingDate={receivingDate}
//             lotCategory={lotCategory}
//             actualGood={actualGood}
//             sumQuantity={sumQuantity}
//             submitRejectData={submitRejectData}
//             receivingId={receivingId}
//             printBool={printBool}
//             setPrintBool={setPrintBool}
//             isOpen={isOpen}
//             onClose={onClose}
//         />
//     )
// }