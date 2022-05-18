import React from 'react'
import {
    Button,
    Flex,
    HStack,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useToast,
} from '@chakra-ui/react'
import { BsFillQuestionOctagonFill } from 'react-icons/bs'
import apiClient from '../../../../services/apiClient'
import { ToastComponent } from '../../../../components/Toast'

const DeleteRecipeConfirmation = ({ isOpen, onClose, requirementId, fetchRecipeTable, fetchFormula }) => {

    const toast = useToast()

    const submitDelete = () => {
        try {
            const res = apiClient.put(`Transformation/InActiveRequirements/${requirementId}`, { id: requirementId }).then((res) => {
                ToastComponent("Success!", "Item has been removed", "success", toast)
                fetchFormula()
                fetchRecipeTable()
                onClose()
            }).catch(err => {
                console.log(err)
            })
        } catch (err) {
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={() => { }} isCentered size='md'>
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
                        <Text>Are you sure you want to do delete this item?</Text>
                    </Flex>
                </ModalBody>

                <ModalFooter>
                    <Button
                        onClick={() => submitDelete()}
                        colorScheme='blue' mr={3} _hover={{ bgColor: 'accent' }}
                    >
                        Yes
                    </Button>
                    <Button variant='ghost' onClick={onClose}>No</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default DeleteRecipeConfirmation