import React, { useState, useEffect } from 'react'
import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Button,
    ButtonGroup,
    Flex,
    Heading,
    HStack,
    Input,
    Select,
    Text,
    VStack,
    useToast
} from '@chakra-ui/react'
import { BsFillQuestionOctagonFill } from 'react-icons/bs'
import apiClient from '../../../../services/apiClient'
import { ToastComponent } from '../../../../components/Toast'

const CancelSubmit = ({ isOpen, onClose, transformId, setTransformId, fetchRejected, fetchRequirements, fetchNotification }) => {

    const [reasons, setReasons] = useState([])
    const [cancelRemarks, setCancelRemarks] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const toast = useToast()

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
        setCancelRemarks(data)
    }

    const submitCancelHandler = () => {
        if (transformId) {
            setIsLoading(true)
            try {
                const res = apiClient.put(`Planning/CancelTransformationRequest/${transformId}`,
                    {
                        id: transformId,
                        cancelRemarks: cancelRemarks
                    })
                    .then(res => {
                        ToastComponent("Success", `Item with Transformation ID of ${transformId} has been cancelled.`, "success", toast)
                        setTransformId("")
                        fetchRejected()
                        fetchRequirements()
                        fetchNotification()
                        onClose()
                    })
                    .catch(err => {
                        ToastComponent("Error", "Cancel Failed", "error", toast)
                    })
            } catch (error) {
            }
        }
    }

    return (
        <Modal isCentered size='xl' isOpen={isOpen} onClose={() => { }}>
            <ModalOverlay />
            <ModalContent>

                <ModalHeader>
                    <Flex justifyContent='center' mt={10}>
                        <BsFillQuestionOctagonFill fontSize='50px' />
                    </Flex>
                </ModalHeader>
                <ModalCloseButton onClick={onClose} />

                <ModalBody>
                    <VStack justifyContent='center' mb={8}>
                        <Text>Are you sure you want to cancel this request?</Text>
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
                    <Button colorScheme='blue' mr={3}
                        disabled={!cancelRemarks || isLoading}
                        isLoading={isLoading}
                        onClick={submitCancelHandler}>
                        Yes
                    </Button>
                    <Button variant='ghost' onClick={onClose}>No</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default CancelSubmit
