import React, { useState, useEffect } from 'react'
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
    Text,
    useToast,
} from '@chakra-ui/react'
import { IoIosAddCircle } from 'react-icons/io'
import apiClient from '../../../../services/apiClient'
import { ToastComponent } from '../../../../components/Toast'

const AddRecipeConfirmation = ({ isOpen, onClose, formulaId, recipes, fetchRecipeTable, formulaQuantity, totalQuantityData, fetchFormula }) => {

    const [raws, setRaws] = useState([])
    const [rawMaterialId, setRawMaterialId] = useState(null)
    const [rawMaterialDescription, setRawMaterialDescription] = useState("")
    const [itemCode, setItemCode] = useState(null)
    const [rawMaterialQuantity, setRawMaterialQuantity] = useState(null)

    const [yesButtonDisabler, setYesButtonDisabler] = useState(false)
    const [errors, setErrors] = useState({})

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

    const materialHandler = (data) => {
        if (data) {
            const newRaw = JSON.parse(data)
            setRawMaterialDescription(newRaw.itemDescription)
            setRawMaterialId(newRaw.id)
            setItemCode(newRaw.itemCode)
        }
        else {
            setRawMaterialDescription("")
            setRawMaterialId(null)
            setItemCode("")
        }
    }

    const rawMaterialQuantityHandler = (data) => {
        let quantityValidator = parseInt(totalQuantityData) + parseInt(data)
        if (quantityValidator > formulaQuantity) {
            setYesButtonDisabler(true)
            ToastComponent("Warning!", "The quantity you provided is greater than the quantity needed", "warning", toast)
            return
        }
        if (data < 0) {
            setYesButtonDisabler(true)
            ToastComponent("Warning!", "Negative values and zeroes are not allowed", "warning", toast)
        }
        else {
            setYesButtonDisabler(false)
        }

        setRawMaterialQuantity(data)
    }

    const submitAdded = () => {

        if (recipes.some((r) => r.requirementCode === itemCode)) {
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

        try {
            // setisLoading(true)
            const res = apiClient.post('Transformation/AddNewTransformationRequirementinFormula', [{
                transformationFormulaId: formulaId,
                rawMaterialId: rawMaterialId,
                quantity: rawMaterialQuantity
            }]).then((res) => {
                ToastComponent("Success!", "Raw Material Added", "success", toast)
                // setisLoading(false)
                fetchRecipeTable()
                fetchFormula()
                onClose(onClose)
            }).catch(err => {
                // setisLoading(false)
                ToastComponent("Error", err.response.data, "error", toast)
                // add property id to objects for if condition
                // data.formData.id = "" 
            })
        } catch (err) {
        }

    }

    return (
        <Modal isOpen={isOpen} onClose={() => { }} isCentered size='xl'>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader mb={5}>
                    <Flex justifyContent='center' mt={10}>
                        <HStack>
                            <Text>Add Recipe</Text><IoIosAddCircle fontSize='50px' />
                        </HStack>
                    </Flex>
                </ModalHeader>
                <ModalCloseButton onClick={onClose} />
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
                                            // ref={itemCodeDisplay}
                                            placeholder='Select Item Code'
                                            w='60%'
                                            onChange={(e) => materialHandler(e.target.value)}
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
                                    // value={rawMaterialQuantity}
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
                        </Flex>

                    </HStack>
                </ModalBody>

                <ModalFooter mt={5}>
                    <Button
                        onClick={() => submitAdded()}
                        disabled={yesButtonDisabler}
                        colorScheme='blue' mr={3} _hover={{ bgColor: 'accent' }}
                    >
                        Yes
                    </Button>
                    <Button variant='ghost' onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default AddRecipeConfirmation