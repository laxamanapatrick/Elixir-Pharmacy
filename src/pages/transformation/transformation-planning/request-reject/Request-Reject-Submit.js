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

const RequestRejectSubmit = ({ isOpen, onClose, transformId, setTransformId, fetchRejected, fetchRequirements }) => {

    const toast = useToast()

    const submitRequestHandler = () => {
        if (transformId) {
            try {
                const res = apiClient.put(`Planning/RequestRejectTransformationRequest/${transformId}`,
                    {
                        id: transformId,
                    })
                    .then(res => {
                        ToastComponent("Success", `Item with Transformation ID of ${transformId} has been requested for reject.`, "success", toast)
                        setTransformId("")
                        fetchRejected()
                        fetchRequirements()
                        onClose()
                    })
                    .catch(err => {
                        ToastComponent("Error", err.response.data , "error", toast)
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
                        <Text>Are you sure you want to request this reject?</Text>
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={submitRequestHandler}>
                        Yes
                    </Button>
                    <Button variant='ghost' onClick={onClose}>No</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default RequestRejectSubmit