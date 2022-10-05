//Modal for Transformation Management Recipe tagging

import React, { useRef, useEffect, useState } from 'react'
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
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup";
import { useForm } from 'react-hook-form'
import { AiFillMinusCircle } from 'react-icons/ai'
import { IoIosAddCircle } from 'react-icons/io'
import PageScrollModal from '../../../components/PageScrollModal'
import apiClient from '../../../services/apiClient'
import { decodeUser } from '../../../services/decode-user';
import { ToastComponent } from '../../../components/Toast';
import TransformationManagementModalViewing from './TransformationManagement-Modal-Viewing';

const currentUser = decodeUser()

const ModalComponent = ({ isOpen, onClose, formulaId, formulaItemCode, formulaItemDescription, formulaQuantity, fetchFormula, setTooltipValue }) => {

    const [raws, setRaws] = useState([])
    const [rmId, setRmId] = useState("")
    const [rawMaterialQuantity, setRawMaterialQuantity] = useState()
    const [quantityRemaining, setQuantityRemaining] = useState()
    const [currentQuantity, setCurrentQuantity] = useState()
    const [rawMaterialDescription, setRawMaterialDescription] = useState("")
    const [itemCode, setItemCode] = useState("")
    const [uom, setUom] = useState("")
    const [recipeData, setRecipeData] = useState([])
    const [isLoading, setisLoading] = useState(false)
    const [isDisabled, setIsDisabled] = useState(false)
    const [addButtonDisabler, setAddButtonDisabler] = useState(false)
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true)
    const [errors, setErrors] = useState({})
    const itemCodeDisplay = useRef(null)
    const toast = useToast()

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

    useEffect(() => {
        if (recipeData.length) {

            let totalQuantity = recipeData.map((q) => parseFloat(q.rawMaterialQuantity))
            let sum = totalQuantity.reduce((a, b) => a + b)

            setQuantityRemaining(formulaQuantity - sum)
            setCurrentQuantity(sum)


            if (formulaQuantity <= sum) {
                setIsDisabled(true)
            } else {
                setIsDisabled(false)
            }
            if (formulaQuantity === sum) {
                setIsSubmitDisabled(false)
            } else {
                setIsSubmitDisabled(true)
            }

        }
        else {
            setIsDisabled(false)
            setQuantityRemaining(null)
            setCurrentQuantity(null)
        }
    }, [recipeData, formulaQuantity])

    const rawMaterialDescriptionHandler = (data) => {
        if (data) {
            const newRaw = JSON.parse(data)
            setRawMaterialDescription(newRaw.itemDescription)
            setRmId(newRaw.id)
            setItemCode(newRaw.itemCode)
            setUom(newRaw.uom)
        }
        else {
            setItemCode("")
        }
    }

    const rawMaterialQuantityHandler = (data) => {
        if (data > formulaQuantity) {
            setAddButtonDisabler(true)
            ToastComponent("Warning!", "The quantity you provided is greater than the quantity needed", "warning", toast)
            return
        }
        if (data < 0) {
            setAddButtonDisabler(true)
            ToastComponent("Warning!", "Negative values and zeroes are not allowed", "warning", toast)
        }
        else {
            setAddButtonDisabler(false)
        }

        setRawMaterialQuantity(parseFloat(data))
    }

    const recipeDataHandler = () => {

        if (recipeData.some((recipe) => recipe.itemCode === itemCode)) {
            ToastComponent("Error!", "Raw Material already added", "error", toast)
            return
        }

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
            "rmId": rmId,
            "itemCode": itemCode,
            "rawMaterialQuantity": parseFloat(rawMaterialQuantity),
            "rawMaterialDescription": rawMaterialDescription,
            "uom": uom,
            "formulaId": formulaId
        }
        setRecipeData([...recipeData, data])

        itemCodeDisplay.current.selectedIndex = 0
        setRawMaterialQuantity("")
    }

    const deleteRecipeHandler = (deleteId) => {
        setRecipeData(recipeData.filter((row) =>
            row.rmId !== deleteId
        ))
    }

    const submitRecipeHandler = (recipeData) => {

        const resultArray = recipeData.map(item => {
            return {
                transformationformulaid: item.formulaId,
                rawMaterialId: item.rmId,
                quantity: item.rawMaterialQuantity
            }
        })

        try {
            setisLoading(true)
            const res = apiClient.post('Transformation/AddNewTransformationRequirementinFormula', resultArray).then((res) => {
                ToastComponent("Success!", "Transformation Formula Requirements created", "success", toast)
                setisLoading(false)
                fetchFormula()
                onClose(onClose)
            }).catch(err => {
                setisLoading(false)
                ToastComponent("Error", err.response.data, "error", toast)
                // add property id to objects for if condition
                // data.formData.id = "" 
            })
        } catch (err) {
        }
    }

    return (
        <Modal
            size='5xl'
            isOpen={isOpen}
            onClose={() => { }}
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
                <ModalCloseButton onClick={() => {
                    onClose()
                }} />

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
                                            ref={itemCodeDisplay}
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
                                    value={rawMaterialQuantity}
                                    type='number'
                                    isInvalid={errors.quantity}
                                    onChange={(e) => rawMaterialQuantityHandler(e.target.value)}
                                    w='65%'
                                    placeholder='Enter Quantity'
                                />
                            </HStack>

                        </Flex>

                        <Flex flexDirection='column'>

                            <HStack>
                                <Text>
                                    Item Description:
                                </Text>
                                <Text
                                    color='black'>{rawMaterialDescription}
                                </Text>
                            </HStack>



                            <Flex>
                                <Button p={5}
                                    disabled={addButtonDisabler}
                                    onClick={recipeDataHandler}
                                    bgColor='secondary'
                                    color='white'
                                    _hover={{ bgColor: 'accent' }}
                                >
                                    <Text mr={2}>Add Requirement</Text> <IoIosAddCircle fontSize='25px' />
                                </Button>
                            </Flex>

                        </Flex>

                    </HStack>



                    {/* Table of submitted */}




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
                                    <Th color="white"> </Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {recipeData?.map((recipe, i) =>
                                    <Tr key={i} value={recipe.rmId}>
                                        <Td> </Td>
                                        <Td>{recipe.rmId}</Td>
                                        <Td>{recipe.itemCode}</Td>
                                        <Td>{recipe.rawMaterialDescription}</Td>
                                        <Td>{recipe.rawMaterialQuantity}</Td>
                                        <Td>{recipe.uom}</Td>
                                        <Td>
                                            <Button p={0}
                                                background='none'
                                                color='secondary'
                                                onClick={() => deleteRecipeHandler(recipe.rmId)}
                                            >
                                                <AiFillMinusCircle fontSize='25px' />
                                            </Button>
                                        </Td>
                                    </Tr>
                                )}
                            </Tbody>
                        </Table>
                    </PageScrollModal>

                    <Text>Quantity Needed: {formulaQuantity}</Text>
                    <Text>Current Quantity Added: {currentQuantity}</Text>
                    <Text fontWeight='semibold'>Remaining Quantity Needed: {quantityRemaining}</Text>

                </ModalBody>

                <ModalFooter>
                    <Button
                        onClick={() => submitRecipeHandler(recipeData)}
                        disabled={isSubmitDisabled}
                        isLoading={isLoading}
                        bgColor='secondary' color='white' _hover={{ bgColor: 'accent' }} mr={3}
                    >
                        Submit
                    </Button>
                    <Button
                        variant='ghost'
                        onClick={() => {
                            onClose()
                        }}
                    >
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent >
        </Modal >
    )
}

export default ModalComponent