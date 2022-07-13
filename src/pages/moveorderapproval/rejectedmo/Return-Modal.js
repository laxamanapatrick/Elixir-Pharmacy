import React, { useState, useEffect } from 'react'
import { Button, ButtonGroup, Flex, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Select, Text, useToast, VStack } from '@chakra-ui/react'
import { BsQuestionOctagonFill } from 'react-icons/bs'
import apiClient from '../../../services/apiClient'
import { ToastComponent } from '../../../components/Toast'
import { decodeUser } from '../../../services/decode-user'

const currentUser = decodeUser()

export const ReturnModal = ({ isOpen, onClose, orderNo, fetchRejectedMO }) => {

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
            const res = apiClient.put(`Ordering/ReturnMoveOrderForApproval`,
                {
                    orderNo: orderNo,
                    remarks: reasonSubmit
                }
            )
                .then(res => {
                    ToastComponent("Success", "Move order has been returned", "success", toast)
                    fetchRejectedMO()
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
                        <Text>Return</Text>
                    </Flex>
                </ModalHeader>
                <ModalCloseButton onClick={onClose} />

                <ModalBody>
                    <VStack justifyContent='center'>
                        <Text>Are you sure you want to return this move order?</Text>
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