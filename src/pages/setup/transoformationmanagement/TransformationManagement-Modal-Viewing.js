import React, { useContext, useEffect, useState } from 'react'
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
    VStack
} from '@chakra-ui/react'
import PageScrollModal from '../../../components/PageScrollModal'
import apiClient from '../../../services/apiClient'

const TransformationManagementModalViewing = ({
    formulaId,
    formulaItemCode,
    formulaItemDescription,
    formulaQuantity,
    isOpen,
    onClose
}) => {

    const [recipes, setRecipes] = useState([])

    const fetchFormulationRequirementsApi = async () => {
        const res = await apiClient.get(`Transformation/GetAllFormulaWithRequirementByFormulaId/${formulaId}`)
        return res.data
    }

    const fetchRecipe = () => {
        fetchFormulationRequirementsApi(formulaId).then(res => {
            setRecipes(res)
        })
    }

    useEffect(() => {
        fetchRecipe()
    }, [formulaId]);

    return (
        <Modal
            size='5xl'
            isOpen={isOpen} onClose={() => {}}
            isCentered
        >

            <ModalOverlay />

            <ModalContent>
                <ModalHeader>
                    <VStack><Text>Transformation Formula Requirements</Text></VStack>
                </ModalHeader>
                <ModalCloseButton onClick={onClose} />

                <ModalBody>

                    {/* Table of submitted */}
                    <HStack>
                        <Flex mb={2} flexDirection='column' justifyContent='left'>
                            <Text>
                                Code: {formulaItemCode}
                            </Text>
                            <Text>
                                Description: {formulaItemDescription}
                            </Text>
                        </Flex>
                    </HStack>

                    <PageScrollModal>
                        <Table variant='striped' size="sm">
                            <Thead>
                                <Tr bgColor="secondary" >
                                    <Th color="white"> </Th>
                                    <Th color="white">ID</Th>
                                    <Th color="white">Item Code</Th>
                                    <Th color="white">Item Description</Th>
                                    <Th color="white">Quantity</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {recipes?.map((recipe, i) =>
                                    <Tr key={i} value={recipe.rmId}>
                                        <Td> </Td>
                                        <Td>{recipe.requirementId}</Td>
                                        <Td>{recipe.requirementCode}</Td>
                                        <Td>{recipe.requirementDescription}</Td>
                                        <Td>{recipe.requirementQuantity}</Td>
                                    </Tr>
                                )}
                            </Tbody>
                        </Table>
                    </PageScrollModal>

                    <Text>Quantity Needed: {formulaQuantity}</Text>

                </ModalBody>

                <ModalFooter>
                    <Button variant='ghost' onClick={onClose}>Close</Button>
                </ModalFooter>
            </ModalContent >
        </Modal >
    )
}

export default TransformationManagementModalViewing