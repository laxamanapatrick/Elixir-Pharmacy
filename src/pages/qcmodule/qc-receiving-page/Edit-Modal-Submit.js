import React, { useState, useContext } from 'react'
import {
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
    useToast
} from '@chakra-ui/react'
import { ReceivingContext } from '../../../context/ReceivingContext'
import apiClient from '../../../services/apiClient'
import { ToastComponent } from '../../../components/Toast'
import { BsFillQuestionOctagonFill } from 'react-icons/bs'

export const EditModalSubmit = ({ isSubmitDisabled, receivingId, sumQuantity, submitDataOne,
    submitDataTwo, submitDataThree, fetchPo, closeModal, fetchNotification,
    manufacturingDate, expiryDate,
    expectedDelivery, actualDelivered,
    batchNo, }) => {

    const { setReceivingId } = useContext(ReceivingContext)

    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const firstSubmit = { ...submitDataOne, ...submitDataThree }

    // console.log(submitDataOne)
    // console.log(firstSubmit)

    // const firstSubmit = submitDataOne.map(first => {
    //     return {
    //         pO_Summary_Id: first.pO_Summary_Id,
    //         manufacturing_Date: first.manufacturing_Date,
    //         expected_Delivery: first.expected_Delivery,
    //         expiry_Date: first.expiry_Date,
    //         actual_Delivered: first.actual_Delivered,
    //         batch_No: first.batch_No,
    //         totalReject: first.totalReject,
    //     }
    // }, ...submitDataThree)

    // console.log(firstSubmit)

    const submitEditedHandlder = () => {

        console.log(firstSubmit)
        try {
            setIsLoading(true)
            const res = apiClient.put(`Receiving/ReceiveRawMaterialsById/${submitDataOne.pO_Summary_Id}`, firstSubmit
            ).then((res) => {
                ToastComponent("Success!", "PO Updated", "success", toast)
                setReceivingId(res.data.id)
                // setIsLoading(false)
                fetchPo()
                fetchNotification()
                closeModal()

                // take generated id 
                const receivingIdWithoutUseContext = res.data.id

                // final array data for second put
                const secondSubmit = submitDataTwo.map(data => {
                    return {
                        pO_ReceivingId: receivingIdWithoutUseContext,
                        quantity: data.quantity,
                        remarks: data.remarksName,
                    }
                })

                if (sumQuantity > 0) {
                    console.log(secondSubmit)
                    try {
                        const res = apiClient.put(`Receiving/RejectRawMaterialsByReceivingId`, secondSubmit)
                    } catch (err) {
                        console.log(err)
                    }

                    // proceed to first put error catch if condition for second put is not met
                }
            }
            ).catch(err => {
                setIsLoading(false)
                ToastComponent("Error", err.response.data, "error", toast)
            }
            )
        } catch (err) {
            console.log(err)
        }

    }

    return (
        <Flex>

            <Button
                onClick={onOpen}
                disabled={
                    isSubmitDisabled || !manufacturingDate || !expiryDate ||
                    !expectedDelivery || !actualDelivered || !batchNo
                }
                title={isSubmitDisabled || !manufacturingDate || !expiryDate ||
                    !expectedDelivery || !actualDelivered || !batchNo ? "Please provide required fields" : ''}
                _hover={{ bgColor: 'accent', color: 'white' }}
                variant='outline'
            >
                Save
            </Button>

            <Modal isOpen={isOpen} onClose={() => { }} isCentered size='xl'>
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
                        <ButtonGroup size='md'>
                            <Button
                                colorScheme='blue' _hover={{ bgColor: 'accent' }}
                                isLoading={isLoading}
                                onClick={() => submitEditedHandlder()}
                            >
                                Yes
                            </Button>
                            <Button onClick={onClose} _hover={{ bgColor: 'accent' }}>No</Button>
                        </ButtonGroup>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </Flex>
    )
}
