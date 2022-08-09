import React, { useRef, useEffect, useContext } from 'react'
import {
    Box,
    Button,
    Flex,
    FormLabel,
    HStack,
    Image,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    VStack
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import moment from 'moment'
import PageScrollImport from '../../../components/PageScrollImport'
import { useReactToPrint } from 'react-to-print';
import Barcode from 'react-barcode';
import { WarehouseContext } from '../../../context/WarehouseContext'

const PrintList = ({
    itemCodeData,
    receivingDate,
    lotCategory,
    actualGood,
    sumQuantity,
    submitRejectData,
    receivingId,
    isOpen, onClose }) => {

    const { setButtonChanger, setDisplayCode, setCode } = useContext(WarehouseContext)

    const componentRef = useRef()

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    })

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

    // console.log("Item Code Data:", itemCodeData)
    // console.log("Receiving Date:", receivingDate)
    // console.log("Lot Category:", lotCategory)
    // console.log("Actual Good:", actualGood)
    // console.log("Total Reject:", sumQuantity)
    // console.log("Reject Data:", submitRejectData)\

    const closeHandler = () => {
        setButtonChanger(false)
        setDisplayCode("")
        setCode("")
        onClose()
    }

    return (
        <Modal isOpen={isOpen} onClose={() => { }} isCentered size='md'>
            <ModalOverlay />
            <ModalContent>

                <ModalHeader>
                    <Flex justifyContent='center'>
                        <Text>Print Preview</Text>
                    </Flex>
                </ModalHeader>

                <ModalCloseButton onClick={closeHandler} />

                <ModalBody>

                    <PageScrollImport>

                        <VStack spacing={0} justifyContent='center' ref={componentRef}>

                            <VStack spacing={0} justifyContent='start'>
                                <Image
                                    src='/images/RDF Logo.png'
                                    w='20%' ml={3}
                                />
                                <Text fontSize='xs' ml={2}>Purok 6, Brgy. Lara, City of San Fernando, Pampanga, Philippines</Text>
                            </VStack>

                            <Flex justifyContent='center'>
                                <Text fontSize='xs' fontWeight='semibold'>(reprinted copy)</Text>
                            </Flex>

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

                    </PageScrollImport>

                </ModalBody>

                <ModalFooter>
                    <Button
                        onClick={handlePrint}
                        colorScheme='blue' _hover={{ bgColor: 'accent' }} mr={3}
                    >
                        Re-Print
                    </Button>
                    <Button onClick={closeHandler}>Close</Button>
                </ModalFooter>

            </ModalContent >
        </Modal >
    )
}

export default PrintList





{/* {submitRejectData.length > 0 ? (
                                <>
                                    <Flex border='1px' w='90%' justifyContent='center'>
                                        <Text fontWeight='semibold' ml={4}>Rejection Data</Text>
                                    </Flex>
                                    <Flex w='60%' justifyContent='space-between'>
                                        <Flex>
                                            <Text fontWeight='semibold'>Quantity</Text>
                                        </Flex>
                                        <Flex>
                                            <Text fontWeight='semibold'>Reason</Text>
                                        </Flex>
                                    </Flex>
                                </>
                            ) : ""}
                            {submitRejectData?.map((rej, x) =>
                                <Flex w='60%' justifyContent='space-between' borderBottom='1px' key={x}>
                                    <Flex>
                                        <Text>{rej.quantity}</Text>
                                    </Flex>
                                    <Flex>
                                        <Text>{rej.remarks}</Text>
                                    </Flex>
                                </Flex>
                            )} */}