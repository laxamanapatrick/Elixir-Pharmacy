import React, { useContext, useEffect, useState } from 'react'
import {
    Button,
    Flex,
    HStack,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    toast,
    Tr,
    useToast,
    VStack
} from '@chakra-ui/react'
import PageScrollModal from '../../../components/PageScrollModal'
import { AiFillMinusCircle } from 'react-icons/ai'
import apiClient from '../../../services/apiClient'
import TransformationManagementPage from '../TransformationManagementPage'


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
            isOpen={isOpen} onClose={onClose}
        >

            <ModalOverlay />

            <ModalContent>
                <ModalHeader>
                    <VStack><Text>Transformation Formula</Text></VStack>
                </ModalHeader>
                <ModalCloseButton />

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
                                    <Th color="white">UOM</Th>
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
                                        <Td>{recipe.uom}</Td>
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
            {/* <TransformationManagementPage 
            recipes={recipes}
            /> */}
        </Modal >
    )
}

export default TransformationManagementModalViewing