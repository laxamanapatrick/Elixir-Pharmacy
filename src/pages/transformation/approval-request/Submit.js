import React, { useState, useEffect } from 'react'
import { Button, ButtonGroup, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Text, useDisclosure, useToast, VStack } from '@chakra-ui/react'
import { BsFillQuestionOctagonFill } from 'react-icons/bs'
import apiClient from '../../../services/apiClient'
import { ToastComponent } from '../../../components/Toast'

export const Submit = ({ transformId, setTransformId, fetchRequestByStatus, fetchRequirements }) => {

    const toast = useToast()

    const [reasons, setReasons] = useState([])
    const [rejectRemarks, setRejectRemarks] = useState("")

    const { isOpen: isApproveOpen, onOpen: openApprove, onClose: closeApprove } = useDisclosure()
    const { isOpen: isRejectOpen, onOpen: openReject, onClose: closeReject } = useDisclosure()

    const fetchReasons = async () => {
        try {
            const res = await apiClient.get('Reason/GetAllActiveReason')
            setReasons(res.data)
        } catch (error) {
        }
    }

    useEffect(() => {
        try {
            fetchReasons()
        } catch (error) {
        }
    }, []);

    const remarksHandler = (data) => {
        if (data) {
            setRejectRemarks(data)
        } else {
            setRejectRemarks("")
        }
    }

    const approveHandler = () => {
        openApprove()
    }

    const rejectHandler = () => {
        openReject()
    }

    const submitApproveHandler = () => {
        try {
            const res = apiClient.put(`Planning/ApproveTransformRequest/${transformId}`,
                {
                    id: transformId
                })
                .then(res => {
                    ToastComponent("Success", `Item with Transformation ID of ${transformId} has been approved.`, "success", toast)
                    setTransformId("")
                    fetchRequirements()
                    fetchRequestByStatus()
                    closeApprove()
                })
                .catch(err => {
                    ToastComponent("Error", err.response.data, "error", toast)
                })
        } catch (error) {
        }
    }

    const submitRejectHandler = () => {
        try {
            const res = apiClient.put(`Planning/RejectTransformationRequest/${transformId}`,
                {
                    transformId: transformId,
                    rejectRemakrs: rejectRemarks
                })
                .then(res => {
                    ToastComponent("Success", `Item with Transformation ID of ${transformId} has been rejected.`, "success", toast)
                    setTransformId("")
                    fetchRequirements()
                    fetchRequestByStatus()
                    closeReject()
                })
                .catch(err => {
                    ToastComponent("Error", err.response.data, "error", toast)
                })
        } catch (error) {
        }
    }

    return (
        <Flex w='90%' justifyContent='end'>
            <ButtonGroup size='xs'>
                <Button colorScheme='blue' disabled={!transformId} onClick={() => approveHandler()}>APPROVE</Button>
                <Button colorScheme='red' disabled={!transformId} onClick={() => rejectHandler()}>REJECT</Button>
            </ButtonGroup>

            <Modal isCentered size='xl' isOpen={isApproveOpen} onClose={() => { }}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        <Flex justifyContent='center' mt={10}>
                            <BsFillQuestionOctagonFill fontSize='50px' />
                        </Flex>
                    </ModalHeader>
                    <ModalCloseButton onClick={closeApprove} />
                    <ModalBody>
                        <Flex justifyContent='center'>
                            <Text>Are you sure you want to approve this request?</Text>
                        </Flex>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            onClick={() => submitApproveHandler()}
                            colorScheme='blue' mr={3} _hover={{ bgColor: 'accent' }}
                        >
                            Yes
                        </Button>
                        <Button variant='ghost' onClick={closeApprove}>No</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal isCentered size='xl' isOpen={isRejectOpen} onClose={() => { }}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        <Flex justifyContent='center' mt={10}>
                            <BsFillQuestionOctagonFill fontSize='50px' />
                        </Flex>
                    </ModalHeader>
                    <ModalCloseButton onClick={closeReject} />
                    <ModalBody>
                        <VStack justifyContent='center' mb={8}>
                            <Text>Are you sure you want to reject this request?</Text>
                            {
                                reasons.length > 0 ? (
                                    <Select
                                        onChange={(e) => remarksHandler(e.target.value)}
                                        placeholder='Please select a reason'
                                        w='65%'
                                        bgColor='#fff8dc'
                                    >
                                        {
                                            reasons?.map((list, i) =>
                                                <option key={i} value={list.reasonName}>{list.reasonName}</option>
                                            )
                                        }
                                    </Select>
                                ) : "Loading"
                            }
                        </VStack>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            onClick={() => submitRejectHandler()}
                            disabled={!rejectRemarks}
                            colorScheme='blue' mr={3} _hover={{ bgColor: 'accent' }}
                        >
                            Yes
                        </Button>
                        <Button variant='ghost' onClick={closeReject}>No</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </Flex>
    )
}
