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

const currentUser = decodeUser()

const ApproveModal = ({ receivingId, fetchRMNearlyExpire, isOpen, onClose }) => {

const [isLoading, setIsLoading] = useState(false)
const toast = useToast()

    const submitHandler = () => {
        try {
            setIsLoading(true)
            const res = apiClient.put(`Receiving/ApproveNearlyExpire/${receivingId}`,
                {
                    id: receivingId,
                    expiryApproveBy: currentUser.username
                }
            ).then((res) => {
                ToastComponent("Success!", "Nearly Expired Raw Material Approved", "success", toast)
                fetchRMNearlyExpire()
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
        <Modal isOpen={isOpen} onClose={() => { }} size='xl'>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <VStack>
                        <Text>
                            Approve
                        </Text>
                    </VStack>
                </ModalHeader>
                <ModalCloseButton onClick={onClose} />

                <ModalBody>
                    <Flex justifyContent='center'>
                        <Text>Are you sure you want to approve this raw material?</Text>
                    </Flex>
                </ModalBody>

                <ModalFooter>
                    <ButtonGroup size='sm'>
                        <Button
                            onClick={() => submitHandler()}
                            isLoading={isLoading}
                            // disabled={!Boolean(submitReason && submitRemarks)}
                            colorScheme='blue'
                            _hover={{ bgColor: 'accent', color: 'white' }}

                        >
                            Yes
                        </Button>
                        <Button
                            onClick={onClose}
                            // disabled={!Boolean(submitReason && submitRemarks)}
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

export default ApproveModal