
import React, { useEffect, useState } from 'react';
import {
    Button,
    Select,
    Text,
    useToast,
    VStack,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    ButtonGroup
} from '@chakra-ui/react';
import apiClient from '../../../services/apiClient';
import { decodeUser } from '../../../services/decode-user';
import { ToastComponent } from '../../../components/Toast';

const currentUser = decodeUser()

const fetchReasonsApi = async () => {
    const res = await apiClient.get('Reason/GetAllActiveReason')
    return res.data
}

const ReturnModalComponent = ({ poId, fetchCancelled, isOpen, onClose, fetchNotification }) => {

    const [reasons, setReasons] = useState([])
    const [submitReason, setSubmitReason] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isDisabled, setIsDisabled] = useState(true)

    const toast = useToast()

    const fetchReason = async () => {
        fetchReasonsApi().then(res => {
            setReasons(res)
        })
    }

    useEffect(() => {
        fetchReason()
    }, [setReasons])

    const reasonHandler = (data) => {
        if(data) {
            setIsDisabled(false)
        } else {
            setIsDisabled(true)
        }
        const newData = JSON.parse(data)
        setSubmitReason(newData.reasonName)
    }

    const submitHandler = () => {
        try {
            setIsLoading(true)
            const res = apiClient.put(`Receiving/ReturnPoInAvailableList/${poId}`,
                {
                    id: poId,
                    reason: submitReason
                }
            ).then(res => {
                ToastComponent("Succes", "PO Returned", "success", toast)
                fetchCancelled()
                fetchNotification()
                onClose()
            }).catch(err => {
                setIsLoading(false)
                ToastComponent("Error", "Cancel Failed", "error", toast)
            })

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={() => { }} isCentered size='xl'>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <VStack>
                        <Text>
                            Return
                        </Text>
                    </VStack>
                </ModalHeader>
                <ModalCloseButton onClick={onClose} />
                <ModalBody>

                    <VStack justifyContent='center'>
                        <Text>Are you sure you want to return this raw material?</Text>
                        {
                            reasons.length > 0 ?
                                (<Select
                                    onChange={(e) => reasonHandler(e.target.value)}
                                    placeholder='Select a reason'
                                    w='60%'
                                    bgColor='#fff8dc'
                                >
                                    {reasons?.map(reason =>
                                        <option key={reason.id} value={JSON.stringify(reason)}>{reason.reasonName}</option>
                                    )}
                                </Select>) : "Loading"
                        }
                    </VStack>

                </ModalBody>

                <ModalFooter>
                    <ButtonGroup size='sm'>
                        <Button
                            onClick={() => submitHandler()}
                            isLoading={isLoading}
                            disabled={isDisabled}
                            colorScheme='blue'
                            _hover={{ bgColor: 'accent', color: 'white' }}

                        >
                            Yes
                        </Button>
                        <Button
                            onClick={onClose}
                            // disabled={!Boolean(submitReason)}
                            colorScheme='red'
                            _hover={{ bgColor: 'accent', color: 'white' }}

                        >
                            No
                        </Button>
                    </ButtonGroup>
                </ModalFooter>
            </ModalContent>
        </Modal >
    )
}

export default ReturnModalComponent