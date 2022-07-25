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
    ButtonGroup,
    Flex
} from '@chakra-ui/react';
import apiClient from '../../../services/apiClient';
import { decodeUser } from '../../../services/decode-user';
import { ToastComponent } from '../../../components/Toast';

const RejectModal = ({ receivingId, fetchRMNearlyExpire, isOpen, onClose, fetchNotification }) => {


    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()

    const submitHandler = () => {

        try {
            setIsLoading(true)
            const res = apiClient.put(`Receiving/RejectNearlyExpire/${receivingId}`,
                {
                    id: receivingId,
                }
            ).then((res) => {
                ToastComponent("Success!", "Raw Material Rejected", "success", toast)
                fetchRMNearlyExpire()
                fetchNotification()
                onClose(onClose)
            }).catch(err => {
                setIsLoading(false)
                ToastComponent("Error!", err.response.data, "error", toast)
            })
        } catch (err) {
            console.log(err)
        }

    }

    return (
        <Modal isOpen={isOpen} onClose={() => { }} size='xl' isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <VStack>
                        <Text>
                            Reject
                        </Text>
                    </VStack>
                </ModalHeader>
                <ModalCloseButton onClick={onClose} />

                <ModalBody>
                    <Flex justifyContent='center'>
                        <Text>Are you sure you want to reject this raw material?</Text>
                    </Flex>
                </ModalBody>

                <ModalFooter>
                    <ButtonGroup size='sm'>
                        <Button
                            onClick={() => submitHandler()}
                            isLoading={isLoading}
                            colorScheme='blue'
                            _hover={{ bgColor: 'accent', color: 'white' }}

                        >
                            Yes
                        </Button>
                        <Button
                            onClick={onClose}
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

export default RejectModal