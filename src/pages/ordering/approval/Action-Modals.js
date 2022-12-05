import React, { useState, useEffect } from 'react'
import { Button, ButtonGroup, Flex, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Select, Text, useToast, VStack } from '@chakra-ui/react'
import { BsQuestionOctagonFill } from 'react-icons/bs'
import apiClient from '../../../services/apiClient'
import { ToastComponent } from '../../../components/Toast'
import { decodeUser } from '../../../services/decode-user'

const currentUser = decodeUser()

export const ApproveModal = ({ isOpen, onClose, orderNo, setOrderNo, fetchOrderList, fetchOrdersByOrderNo, fetchNotification }) => {

    const toast = useToast()
    const [isLoading, setIsLoading] = useState(false)

    const submitHandler = () => {
        setIsLoading(true)
        try {
            const res = apiClient.put(`Ordering/ApprovePreparedDate`,
                {
                    orderNoPKey: orderNo
                }
            )
                .then(res => {
                    ToastComponent("Success", "Order has been approved.", "success", toast)
                    setOrderNo('')
                    fetchNotification()
                    fetchOrderList()
                    fetchOrdersByOrderNo()
                    setIsLoading(false)
                    onClose()
                })
                .catch(err => {
                    ToastComponent("Error", "Order was not approved.", "error", toast)
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
                        <BsQuestionOctagonFill fontSize='40px' />
                    </Flex>
                </ModalHeader>
                <ModalCloseButton onClick={onClose} />

                <ModalBody>
                    <Text textAlign='center'>Are you sure you want to approve this order?</Text>
                </ModalBody>

                <ModalFooter>
                    <ButtonGroup size='sm' mt={7}>
                        <Button colorScheme='blue' onClick={submitHandler} isLoading={isLoading} disabled={isLoading}>Yes</Button>
                        <Button colorScheme='red' onClick={onClose} isLoading={isLoading} disabled={isLoading}>No</Button>
                    </ButtonGroup>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export const RejectModal = ({ isOpen, onClose, orderNo, setOrderNo, fetchOrderList, fetchOrdersByOrderNo, fetchNotification }) => {

    const [reason, setReason] = useState('')
    const [reasonData, setReasonData] = useState([])

    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()

    const fetchReasonApi = async () => {
        const res = await apiClient.get(`Reason/GetAllActiveReason`)
        return res.data
    }

    const fetchReason = () => {
        fetchReasonApi().then(res => {
            setReasonData(res)
        })
    }

    useEffect(() => {
        fetchReason()

        return () => {
            setReasonData([])
        }
    }, [])

    const submitHandler = () => {
        setIsLoading(true)
        try {
            const res = apiClient.put(`Ordering/RejectPreparedDate`,
                {
                    orderNoPKey: orderNo,
                    remarks: reason,
                    rejectedBy: currentUser.fullName
                }
            )
                .then(res => {
                    ToastComponent("Succes", "Order has been rejected", "success", toast)
                    setOrderNo('')
                    fetchNotification()
                    fetchOrderList()
                    fetchOrdersByOrderNo()
                    setIsLoading(false)
                    onClose()
                })
                .catch(err => {
                    ToastComponent("Error", "Reject failed", "error", toast)
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
                        <BsQuestionOctagonFill fontSize='40px' />
                    </Flex>
                </ModalHeader>
                <ModalCloseButton onClick={onClose} />

                <ModalBody>
                    <VStack justifyContent='center'>
                        <Text textAlign='center'>Are you sure you want to reject this order?</Text>
                        {
                            reasonData.length > 0 ?
                                <Select
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder='Please select a reason'
                                    bgColor='#fff8dc' w='60%'
                                >
                                    {
                                        reasonData?.map((reason, i) =>
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
                        <Button colorScheme='blue' disabled={!reason || isLoading} onClick={submitHandler} isLoading={isLoading}>Yes</Button>
                        <Button colorScheme='red' isLoading={isLoading} disabled={isLoading}>No</Button>
                    </ButtonGroup>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
