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
    Text,
    Box,
} from '@chakra-ui/react'
import { CgDanger } from 'react-icons/cg'

const ErrorModal = ({ isOpen, onClose, errorData }) => {

    return (
        <Modal isCentered size='4xl' isOpen={isOpen} onClose={() => { }}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <Flex justifyContent='space-between'>
                        <CgDanger fontSize='30px' color='red' />
                        <Text>Out of Stock</Text>
                        <Box></Box>
                    </Flex>
                </ModalHeader>
                <ModalCloseButton onClick={onClose} />
                <ModalBody>
                    <Table>
                        <Thead>
                            <Tr>
                                <Th>Item Code</Th>
                                <Th>Quantity per batch</Th>
                                <Th>Available Stock</Th>
                                <Th>Stock needed for this request</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                errorData?.map((ed, i) =>
                                    <Tr key={i}>
                                        <Td>{ed.itemCode}</Td>
                                        <Td>{ed.quantity.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td>
                                        <Td>{ed.warehouseStock.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td>
                                        <Td>{ed.quantityNeeded.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td>
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