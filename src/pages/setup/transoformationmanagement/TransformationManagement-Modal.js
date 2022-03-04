//Modal for Transformation Management Recipe tagging

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
    VStack
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup";
import { useForm } from 'react-hook-form'
import { AiFillMinusCircle } from 'react-icons/ai'
import { IoIosAddCircle } from 'react-icons/io'
import PageScroll from '../../../components/PageScroll'
import apiClient from '../../../services/apiClient'
import { decodeUser } from '../../../services/decode-user';
import { ToastComponent } from '../../../components/Toast';

const currentUser = decodeUser()

// const modalSchema = yup.object().shape({
//     formData: yup.object().shape({
//         rawMaterialId: yup.string(),
//         itemCode: yup.string().required("Item code is required"),
//         rawMaterialQuantity: yup.string().required("Quantity is required"),
//         rawMaterialDescription: yup.string().required("Description is required")
//     })
// })

const ModalComponent = ({ isOpen, onClose, formulaId, formulaItemCode, formulaItemDescription, formulaQuantity }) => {
    const [recipes, setRecipes] = useState([])
    const [raws, setRaws] = useState([])
    const [rawMaterialId, setRawMaterialId] = useState("")
    const [rawMaterialQuantity, setRawMaterialQuantity] = useState()
    const [rawMaterialDescription, setRawMaterialDescription] = useState("")
    const [itemCode, setItemCode] = useState("")
    const [recipeData, setRecipeData] = useState([])
    const [isLoading, setisLoading] = useState(false)
    const [errors, setErrors] = useState({
    })

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

    const fetchRawMaterialsApi = async () => {
        const res = await apiClient.get('RawMaterial/GetAllActiveRawMaterials')
        return res.data
    }

    const fetchRaws = async () => {
        fetchRawMaterialsApi().then(res => {
            setRaws(res)
        })
    }

    useEffect(() => {
        fetchRaws()
    }, [setRaws])

    const rawMaterialDescriptionHandler = (data) => {
        if (data) {
            const newRaw = JSON.parse(data)
            setRawMaterialDescription(newRaw.itemDescription)
            setRawMaterialId(newRaw.id)
            setItemCode(newRaw.itemCode)
        }
        else {
            setItemCode("")
        }

    }

    const rawMaterialQuantityHandler = (data) => {
        setRawMaterialQuantity(data)
    }

    const recipeDataHandler = () => {
        if (!itemCode) {
            setErrors({
                code: true,
            })
            return
        }
        if (!rawMaterialQuantity) {
            setErrors({
                quantity: true
            })
            return
        } else {
            setErrors({
                code: false,
                quantity: false
            })
        }

        const data = {
            "rawMaterialId": rawMaterialId,
            "itemCode": itemCode,
            "rawMaterialQuantity": rawMaterialQuantity,
            "rawMaterialDescription": rawMaterialDescription,
            "formulaId": formulaId
        }
        setRecipeData([...recipeData, data])
    }

    const deleteRecipeHandler = (id, itemCode, description, quantity) => {
        console.log(id, itemCode, description, quantity)
    }

    return (
        <Modal
            size='5xl'
            isOpen={isOpen} onClose={onClose}
        >

            <ModalOverlay />

            <ModalContent>
                <ModalHeader>
                    <VStack><Text>Transformation Formula</Text></VStack>
                    <Flex flexDirection='column'>
                        <Text fontSize='md'>Code: {formulaItemCode}</Text>
                        <Text fontSize='md'>Description: {formulaItemDescription}</Text>
                    </Flex>
                </ModalHeader>
                <ModalCloseButton />

                <ModalBody>

                    <HStack mb={3}>

                        <Flex flexDirection='column'>

                            <HStack mb={1}>
                                <Text>
                                    Item Code:
                                </Text>
                                {
                                    raws.length > 0 ?
                                        (<Select
                                            placeholder='Select Item Code'
                                            w='60%'
                                            onChange={(e) => rawMaterialDescriptionHandler(e.target.value)}
                                            isInvalid={errors.code}
                                        >
                                            {raws?.map(raw =>
                                                <option key={raw.id} value={JSON.stringify(raw)}>{raw.itemCode}</option>
                                            )}
                                        </Select>) : "Loading"
                                }
                            </HStack>

                            <HStack>
                                <Text>
                                    Quantity:
                                </Text>
                                <Input
                                    type='number'
                                    isInvalid={errors.quantity}
                                    onChange={(e) => rawMaterialQuantityHandler(e.target.value)}
                                    w='65%' placeholder='Enter Quantity' />
                            </HStack>

                        </Flex>

                        <Flex flexDirection='column' ml={10}>

                            <HStack>
                                <Text>
                                    Item Description:
                                </Text>
                                <Text
                                    color='black'>{rawMaterialDescription}
                                </Text>
                            </HStack>

                        </Flex>

                        <Flex>
                            <Button p={0}
                                onClick={recipeDataHandler}
                                bgColor='secondary'
                                color='white'
                                _hover={{ bgColor: 'accent' }}
                            >
                                <IoIosAddCircle fontSize='25px' />
                            </Button>
                        </Flex>

                    </HStack>



                    {/* Table of submitted */}




                    <PageScroll>
                        <Table variant='striped' size="sm">
                            <Thead>
                                <Tr bgColor="secondary" >
                                    <Th color="white"> </Th>
                                    <Th color="white">ID</Th>
                                    <Th color="white">Item Code</Th>
                                    <Th color="white">Item Description</Th>
                                    <Th color="white">Quantity</Th>
                                    <Th color="white"> </Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {recipeData?.map((recipe, i) =>
                                    <Tr key={i}>
                                        <Td> </Td>
                                        <Td>{recipe.rawMaterialId}</Td>
                                        <Td>{recipe.itemCode}</Td>
                                        <Td>{recipe.rawMaterialDescription}</Td>
                                        <Td>{recipe.rawMaterialQuantity}</Td>
                                        <Td>
                                            <Button p={0}
                                                background='none'
                                                color='secondary'
                                                onClick={() => deleteRecipeHandler(recipe.rawMaterialId, recipe.itemCode, recipe.rawMaterialDescription, recipe.rawMaterialQuantity)}
                                            >
                                                <AiFillMinusCircle fontSize='25px' />
                                            </Button>
                                        </Td>
                                    </Tr>
                                )}
                            </Tbody>
                        </Table>
                    </PageScroll>
                    <Text>Quantity Needed: {formulaQuantity}</Text>

                </ModalBody>

                <ModalFooter>
                    <Button
                        // disabled={!isValid}
                        isLoading={isLoading}
                        bgColor='secondary' color='white' _hover={{ bgColor: 'accent' }} mr={3}
                    >
                        Submit
                    </Button>
                    <Button variant='ghost' onClick={onClose}>Close</Button>
                </ModalFooter>
            </ModalContent >
        </Modal >
    )
}

export default ModalComponent