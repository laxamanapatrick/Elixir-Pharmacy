import React, { useRef } from 'react'
import {
    Box,
    Button,
    Flex,
    FormLabel,
    HStack,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    Text
} from '@chakra-ui/react'
import PageScrollModal from '../../../components/PageScrollModal'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import moment from 'moment'
import ReactToPrint from 'react-to-print'

const PrintList = ({
    itemCodeData,
    receivingDate,
    lotCategory,
    actualGood,
    sumQuantity,
    submitRejectData,
    isOpen, onClose }) => {

    const componentRef = useRef()

    const { register } = useForm({
        resolver: yupResolver(),
        mode: "onChange",
        defaultValues: {
            displayData: {
                itemCode: itemCodeData.itemCode,
                receivingDate: moment(receivingDate).format("MM/DD/YYYY"),
                itemDescription: itemCodeData.itemDescription,
                manufacturingDate: moment(itemCodeData.manufacturingDate).format("MM/DD/YYYY"),
                supplier: itemCodeData.supplier,
                expiration: moment(itemCodeData.expiration).format("MM/DD/YYYY"),
                pO_Number: itemCodeData.pO_Number,
                expirationDays: itemCodeData.expirationDays,
                actualDelivered: itemCodeData.expectedDelivery,
                qtyGood: itemCodeData.actualDelivered,
                uom: itemCodeData.uom,
                lotCategory: lotCategory,
                totalStock: itemCodeData.totalStock,
                updatedStock: parseInt(itemCodeData.totalStock) + parseInt(itemCodeData.actualDelivered),
                actualReject: sumQuantity,
                actualGood: actualGood,
            }
        }
    })

    // console.log("Item Code Data:", itemCodeData)
    // console.log("Receiving Date:", receivingDate)
    // console.log("Lot Category:", lotCategory)
    // console.log("Actual Good:", actualGood)
    // console.log("Total Reject:", sumQuantity)
    // console.log("Reject Data:", submitRejectData)

    return (
        <Modal isOpen={isOpen} onClose={() => { }} isCentered size='4xl'>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <Flex justifyContent='center'>
                        <Text>Print Preview</Text>
                    </Flex>
                </ModalHeader>
                <ModalCloseButton onClick={onClose} />
                <ModalBody>

                    <PageScrollModal>
                        <Stack spacing={5} ref={componentRef} mx={2}>

                            {/* RAW MATERIALS INFORMATION */}

                            <Flex justifyContent='center' p={1}>
                                <Text>RAW MATERIALS INFORMATION</Text>
                            </Flex>

                            <Flex justifyContent='space-between'>
                                <FormLabel w='40%'>
                                    Item Code
                                    <Input
                                        {...register("displayData.itemCode")}
                                        readOnly={true}
                                        _disabled={{ color: 'black' }}
                                        disabled={true}
                                    />
                                </FormLabel>

                                <FormLabel w='40%'>
                                    Receiving Date
                                    <Input
                                        {...register("displayData.receivingDate")}
                                        readOnly={true}
                                        _disabled={{ color: 'black' }}
                                        disabled={true}
                                    />
                                </FormLabel>
                            </Flex>

                            <Flex justifyContent='space-between'>
                                <FormLabel w='40%'>
                                    Description
                                    <Input
                                        {...register("displayData.itemDescription")}
                                        readOnly={true}
                                        _disabled={{ color: 'black' }}
                                        disabled={true}
                                    />
                                </FormLabel>

                                <FormLabel w='40%'>
                                    Manufacturing Date
                                    <Input
                                        {...register("displayData.manufacturingDate")}
                                        readOnly={true}
                                        _disabled={{ color: 'black' }}
                                        disabled={true}
                                    />
                                </FormLabel>
                            </Flex>

                            <Flex justifyContent='space-between'>
                                <FormLabel w='40%'>
                                    Supplier
                                    <Input
                                        {...register("displayData.supplier")}
                                        readOnly={true}
                                        _disabled={{ color: 'black' }}
                                        disabled={true}
                                    />
                                </FormLabel>

                                <FormLabel w='40%'>
                                    Expiration
                                    <Input
                                        {...register("displayData.expiration")}
                                        readOnly={true}
                                        _disabled={{ color: 'black' }}
                                        disabled={true}
                                    />
                                </FormLabel>
                            </Flex>

                            <Flex justifyContent='space-between'>
                                <FormLabel w='40%'>
                                    PO NO.
                                    <Input
                                        {...register("displayData.pO_Number")}
                                        readOnly={true}
                                        _disabled={{ color: 'black' }}
                                        disabled={true}
                                    />
                                </FormLabel>

                                <FormLabel w='40%'>
                                    Days of Expiry
                                    <Input
                                        {...register("displayData.expirationDays")}
                                        readOnly={true}
                                        _disabled={{ color: 'black' }}
                                        disabled={true}
                                    />
                                </FormLabel>
                            </Flex>

                            {/* QA RECEIVING INFORMATION */}

                            <Flex justifyContent='center' p={1}>
                                <Text>QA RECEIVING INFORMATION</Text>
                            </Flex>

                            <Flex justifyContent='space-between'>
                                <FormLabel w='40%'>
                                    Actual Delivered
                                    <Input
                                        {...register("displayData.actualDelivered")}
                                        readOnly={true}
                                        _disabled={{ color: 'black' }}
                                        disabled={true}
                                    />
                                </FormLabel>

                                <FormLabel w='40%'>
                                    Qty. Good
                                    <Input
                                        {...register("displayData.qtyGood")}
                                        readOnly={true}
                                        _disabled={{ color: 'black' }}
                                        disabled={true}
                                    />
                                </FormLabel>
                            </Flex>

                            {/* PHARMACY WAREHOUSE RAW MATERIALS RECEIVING INFORMATION */}

                            <Flex justifyContent='center' p={1}>
                                <Text>PHARMACY WAREHOUSE RAW MATERIALS RECEIVING INFORMATION</Text>
                            </Flex>

                            <Flex justifyContent='space-between'>
                                <FormLabel w='40%'>
                                    UOM
                                    <Input
                                        {...register("displayData.uom")}
                                        readOnly={true}
                                        _disabled={{ color: 'black' }}
                                        disabled={true}
                                    />
                                </FormLabel>

                                <FormLabel w='40%'>
                                    LOT Name
                                    <Input
                                        {...register("displayData.lotCategory")}
                                        readOnly={true}
                                        _disabled={{ color: 'black' }}
                                        disabled={true}
                                    />
                                </FormLabel>
                            </Flex>

                            <Flex justifyContent='space-between'>
                                <FormLabel w='40%'>
                                    Total Stock
                                    <Input
                                        {...register("displayData.totalStock")}
                                        readOnly={true}
                                        _disabled={{ color: 'black' }}
                                        disabled={true}
                                    />
                                </FormLabel>

                                <FormLabel w='40%'>
                                    Updated Stock
                                    <Input
                                        {...register("displayData.updatedStock")}
                                        readOnly={true}
                                        _disabled={{ color: 'black' }}
                                        disabled={true}
                                    />
                                </FormLabel>
                            </Flex>

                            <Flex justifyContent='space-between'>
                                <FormLabel w='40%'>
                                    Actual Reject
                                    <Input
                                        {...register("displayData.actualReject")}
                                        readOnly={true}
                                        _disabled={{ color: 'black' }}
                                        disabled={true}
                                    />
                                </FormLabel>

                                <FormLabel w='40%'>
                                    Actual Good
                                    <Input
                                        {...register("displayData.actualGood")}
                                        readOnly={true}
                                        _disabled={{ color: 'black' }}
                                        disabled={true}
                                    />
                                </FormLabel>
                            </Flex>

                            {/* Rejection Data */}

                            <Flex justifyContent='center' p={1}>
                                <Text>Rejected Materials</Text>
                            </Flex>
                            {
                                submitRejectData?.map((r, i) => (

                                    <Flex justifyContent='space-between' key={i}>
                                        <FormLabel w='40%'>
                                            Quantity
                                            <Input
                                                value={r.quantity}
                                                readOnly={true}
                                                _disabled={{ color: 'black' }}
                                                disabled={true}
                                            />
                                        </FormLabel>

                                        <FormLabel w='40%'>
                                            Remarks
                                            <Input
                                                value={r.remarks}
                                                readOnly={true}
                                                _disabled={{ color: 'black' }}
                                                disabled={true}
                                            />
                                        </FormLabel>
                                    </Flex>

                                ))
                            }
                        </Stack>
                    </PageScrollModal>

                </ModalBody>

                <ModalFooter>
                    <ReactToPrint
                        trigger={
                            () =>
                                <Button
                                    // onClick={handlePrint}
                                    colorScheme='blue' _hover={{ bgColor: 'accent' }} mr={3}
                                >
                                    Print
                                </Button>
                        }
                        content={() => componentRef.current}
                    />
                    {/* <SamplePrint  /> */}

                </ModalFooter>

            </ModalContent>
        </Modal>
    )
}

export default PrintList