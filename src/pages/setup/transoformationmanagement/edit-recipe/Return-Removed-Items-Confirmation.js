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
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useDisclosure,
    useToast,
} from '@chakra-ui/react'
import { BsFillQuestionOctagonFill } from 'react-icons/bs'
import apiClient from '../../../../services/apiClient'
import { ToastComponent } from '../../../../components/Toast'

const ReturnRemovedItemsConfirmation = ({ materialId, fetchInactive, fetchRecipe, isOpen, onClose, quantity, currentQuantity, formulaQuantity, fetchFormula }) => {

    const toast = useToast()

    const submitReturn = () => {
        let quantityValidator = Number(quantity) + Number(currentQuantity)
        if( quantityValidator > formulaQuantity) {
            ToastComponent("Error!", "Return failed, The total quantity for this formula was already met.", "error", toast)
            return
        }
        try {
            const res = apiClient.put(`Transformation/ActivateRequirement/${materialId}`, { id: materialId }).then((res) => {
                ToastComponent("Success!", "Item has been returned as a requirement", "success", toast)
                fetchFormula()
                fetchRecipe()
                fetchInactive()
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
                        <Text>Are you sure you want to return this requirement?</Text>
                    </Flex>
                </ModalBody>

                <ModalFooter>
                    <Button
                        onClick={() => submitReturn()}
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

export default ReturnRemovedItemsConfirmation