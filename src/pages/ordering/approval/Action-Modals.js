import React from 'react'
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader } from '@chakra-ui/react'

export const ApproveModal = ({ isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={() => { }} isCentered size='xl'>
            <ModalContent>
                <ModalHeader></ModalHeader>
                <ModalCloseButton onClick={onClose} />

                <ModalBody></ModalBody>

                <ModalFooter></ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export const RejectModal = ({ isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={() => { }} isCentered size='xl'>
            <ModalContent>
                <ModalHeader></ModalHeader>
                <ModalCloseButton onClick={onClose} />

                <ModalBody></ModalBody>

                <ModalFooter></ModalFooter>
            </ModalContent>
        </Modal>
    )
}
