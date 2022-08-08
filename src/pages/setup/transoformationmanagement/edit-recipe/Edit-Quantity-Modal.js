import React, { useState } from 'react'
import { Button, ButtonGroup, Flex, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useToast } from '@chakra-ui/react'
import apiClient from '../../../../services/apiClient'
import { ToastComponent } from '../../../../components/Toast'

const EditQuantityModal = ({ isOpen, onClose, id, quantity, fetchRecipe, currentQuantity, formulaQuantity, fetchFormula }) => {

    const [newQuantity, setNewQuantity] = useState(quantity)
    const toast = useToast()

    const submitQuantity = () => {
        let newCurrentQuantity = currentQuantity - quantity
        let totalQuantity = Number(newQuantity) + newCurrentQuantity
        if (totalQuantity > formulaQuantity) {
            ToastComponent("Error!", "Value is greater than remaining quantity needed", "error", toast)
            setNewQuantity('')
            return
        }
        if (Number(newQuantity) === 0) {
            ToastComponent("Error!", "Zero values are not allowed", "error", toast)
            setNewQuantity('')
            return
        }
        if (Number(newQuantity) < 0) {
            ToastComponent("Error!", "Negative values are not allowed", "error", toast)
            setNewQuantity('')
            return
        }
        try {
            const res = apiClient.put(`Transformation/UpdateQuantity/${id}`,
                {
                    id: id, 
                    quantity: Number(newQuantity)
                }
            )
                .then(res => {
                    ToastComponent("Success!", "Quantity Updated", "success", toast)
                    fetchRecipe()
                    fetchFormula()
                    onClose()
                })
                .catch(err => {
                    ToastComponent("Error!", "Must be a number", "error", toast)
                })
        } catch (error) {
        }

    }

    return (
        <Modal size='md' isCentered isOpen={isOpen} onClose={() => { }}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <Flex justifyContent='center'>
                        <Text fontSize='md'>Edit Quantity</Text>
                    </Flex>
                </ModalHeader>
                <ModalCloseButton onClick={onClose} />
                <ModalBody>
                    <Input
                        onChange={(e) => setNewQuantity(e.target.value)}
                        value={newQuantity}
                    />
                </ModalBody>
                <ModalFooter>
                    <ButtonGroup size='sm'>
                        <Button onClick={submitQuantity}>Save</Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ButtonGroup>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default EditQuantityModal