import React, { useState, useContext } from 'react'
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
    VStack
} from '@chakra-ui/react'
import { WarehouseContext } from '../../../context/WarehouseContext'
import apiClient from '../../../services/apiClient'
import { ToastComponent } from '../../../components/Toast'
import { BsFillQuestionOctagonFill } from 'react-icons/bs'
import PrintList from './Print-List'

const ScannedModalSubmit = ({ itemCodeData, code, receivingDate, lotCategory, actualGood, sumQuantity, submitRejectData, fetchItemCodeData }) => {

    const { setReceivingId } = useContext(WarehouseContext)

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [isLoading, setIsLoading] = useState(false)
    const [buttonChanger, setButtonChanger] = useState(false)

    const toast = useToast()

    const { isOpen: isPrintModalOpen, onOpen: openPrintModal, onClose: closePrintModal } = useDisclosure()

    const submitHandler = () => {
        const firstSubmit = {
            itemCode: code,
            receivingDate: receivingDate,
            lotCategory: lotCategory,
            actualGood: actualGood,
            totalReject: sumQuantity
        }
        console.log(firstSubmit)
        try {
            setIsLoading(true)
            const res = apiClient.put(`Warehouse/ReceiveRawMaterialsInWarehouse/${firstSubmit.itemCode}`, firstSubmit).then((res) => {
                ToastComponent("Success!", "PO Updated", "success", toast)
                setReceivingId(res.data.id)
                fetchItemCodeData()
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

    const openPrintHandler = () => {
        openPrintModal()
    }

    return (
        <Flex justifyContent='end' mt={2} mr={2}>
            <Box>

                {
                    buttonChanger === true ?
                        (
                            < Button
                                size='md'
                                onClick={openPrintHandler}
                                colorScheme='blue' _hover={{ bgColor: 'accent' }}
                            >
                                Print
                            </Button>
                        )
                        :
                        (
                            <Button
                                size='md'
                                onClick={onOpen}
                                colorScheme='blue' _hover={{ bgColor: 'accent' }}
                            >
                                Save
                            </Button>
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
                                <Text>Are you sure you want to do this action?</Text>
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
            </Box>

            {
                isPrintModalOpen && (
                    <PrintList
                        isOpen={isPrintModalOpen}
                        onClose={closePrintModal}
                        itemCodeData={itemCodeData}
                        receivingDate={receivingDate}
                        lotCategory={lotCategory}
                        actualGood={actualGood}
                        submitRejectData={submitRejectData}
                        sumQuantity={sumQuantity}
                    />
                )
            }

        </Flex >
    )
}

export default ScannedModalSubmit

