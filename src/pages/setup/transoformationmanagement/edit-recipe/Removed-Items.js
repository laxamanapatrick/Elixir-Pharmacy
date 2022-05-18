import React, { useState, useEffect } from 'react'
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
import apiClient from '../../../../services/apiClient'
import PageScrollModal from '../../../../components/PageScrollModal'
import { RiArrowGoBackFill } from 'react-icons/ri'
import ReturnRemovedItemsConfirmation from './Return-Removed-Items-Confirmation'

const RemovedItems = ({ formulaId, isOpen, onClose, fetchRecipe, currentQuantity, formulaQuantity, fetchFormula }) => {

    const [removedItems, setRemovedItems] = useState([])
    const [materialId, setMaterialId] = useState(null)
    const [quantity, setQuantity] = useState('')

    const { isOpen: isReturn, onOpen: openReturn, onClose: closeReturn } = useDisclosure()

    const fetchInactiveRequirements = async (formulaId) => {
        const res = await apiClient.get(`Transformation/GetAllInActiveRequirement?id=${formulaId}`)
        return res.data
    }

    const fetchInactive = () => {
        fetchInactiveRequirements(formulaId).then(res => {
            setRemovedItems(res)
        })
    }

    useEffect(() => {
        fetchInactive()
    }, [formulaId])


    const returnItemHandler = (id, quantity) => {
        setMaterialId(id)
        setQuantity(quantity)
        fetchFormula()
        openReturn()
    }

    return (
        <Modal isOpen={isOpen} onClose={() => { }} isCentered size='3xl'>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <Flex justifyContent='center' mt={10}>
                        <Text>Removed Requirements</Text>
                    </Flex>
                </ModalHeader>
                <ModalCloseButton onClick={onClose} />

                <ModalBody>
                    <Flex justifyContent='center'>

                        <PageScrollModal>
                            <Table variant='striped' size="sm">
                                <Thead>
                                    <Tr bgColor='secondary'>
                                        <Th color='white'>ID</Th>
                                        <Th color='white'>Item Code</Th>
                                        <Th color='white'>Item Description</Th>
                                        <Th color='white'>Quantity</Th>
                                        <Th color='white'>Return</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {removedItems?.map((r, i) =>
                                        <Tr key={i}>
                                            <Td>{r.requirementId}</Td>
                                            <Td>{r.requirementCode}</Td>
                                            <Td>{r.requirementDescription}</Td>
                                            <Td>{r.requirementQuantity}</Td>
                                            <Td>
                                                <Button
                                                    onClick={() => returnItemHandler(r.requirementId, r.requirementQuantity)}
                                                    p={0}
                                                    background='none'
                                                    color='secondary'
                                                >
                                                    <RiArrowGoBackFill fontSize='20px' />
                                                </Button>
                                            </Td>
                                        </Tr>
                                    )}
                                </Tbody>
                            </Table>
                        </PageScrollModal>

                    </Flex>
                </ModalBody>

                <ModalFooter>
                    <Button variant='ghost' onClick={onClose}>Close</Button>
                </ModalFooter>
            </ModalContent>

            {
                isReturn && (
                    <ReturnRemovedItemsConfirmation
                        materialId={materialId}
                        fetchInactive={fetchInactive}
                        fetchRecipe={fetchRecipe}
                        isOpen={isReturn}
                        onClose={closeReturn}
                        quantity={quantity}
                        currentQuantity={currentQuantity}
                        formulaQuantity={formulaQuantity}
                        fetchFormula={fetchFormula}
                    />
                )
            }

        </Modal>
    )
}

export default RemovedItems