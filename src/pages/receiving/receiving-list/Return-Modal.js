import React, { useState } from 'react'
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
    toast, 
    useToast, 
    VStack
} from '@chakra-ui/react'
import apiClient from '../../../services/apiClient'
import { ToastComponent } from '../../../components/Toast'

const ReturnModal = ({ isOpen, onClose, returnId, fetchReceivingList }) => {

    const [isLoading, setIsLoading] = useState(false)

    const toast = useToast()

    const submitHandler = () => {
        try {
            setIsLoading(true)
            const res = apiClient.put(`Warehouse/ReturnRawmaterialByWarehouse/${returnId}`, {id: returnId}).then(res => {
            ToastComponent("Success", "Raw Material returned", "success", toast)
            fetchReceivingList()
            onClose()
            }).catch(err => {
                setIsLoading(false)
                ToastComponent("Error", err.response.data, "error",  toast )
            })
        } catch (error) {    
        }
    }
    
    return (
        <Modal isOpen={isOpen} onClose={() => { }} size='xl'>
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
                    <Flex justifyContent='center'>
                        <Text>Are you sure you want to return this raw material?</Text>
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

export default ReturnModal