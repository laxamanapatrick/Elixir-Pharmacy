import React from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Flex,
    Table,
    Tbody,
    Tr,
    Td,
    Thead,
    Th,
} from '@chakra-ui/react'

const ErrorModal = ({ isOpen, onClose, errorData }) => {

    console.log(errorData)

    return (
        <Modal isCentered size='4xl' isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <Flex justifyContent='center'>
                        Out of Stock
                    </Flex>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Table>
                        <Thead>
                            <Tr>
                                <Th>Item Code</Th>
                                <Th>Stock Left</Th>
                                <Th>Stock needed for this request</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                errorData?.map((ed, i) =>
                                    <Tr key={i}>
                                        <Td>{ed.itemCode}</Td>
                                        <Td>{ed.quantity}</Td>
                                        <Td>{ed.quantityNeeded}</Td>
                                    </Tr>
                                )
                            }
                        </Tbody>
                    </Table>
                </ModalBody>

                <ModalFooter>
                    <Button variant='ghost' mr={3} onClick={onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default ErrorModal