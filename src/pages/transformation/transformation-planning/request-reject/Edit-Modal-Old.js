import React, { useState, useEffect, useRef } from 'react'
import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Button,
    ButtonGroup,
    Flex,
    Heading,
    HStack,
    Input,
    Select,
    Text,
    VStack,
    useToast,
    useDisclosure
} from '@chakra-ui/react'
import DatePicker from 'react-datepicker'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { ToastComponent } from '../../../../components/Toast';
import apiClient from '../../../../services/apiClient';
import moment from 'moment';
import ErrorModal from '../add-request/Error-Modal';


const EditModalReject = ({ isOpen, onClose, transformId, setTransformId, editData, fetchRejected, fetchRequirements, fetchNotification }) => {

    const [formulas, setFormulas] = useState([])
    const [code, setCode] = useState(editData.itemCode)
    const [codeData, setCodeData] = useState([])
    const [errorData, setErrorData] = useState([])

    const [itemCode, setItemCode] = useState(editData.itemCode)
    const [version, setVersion] = useState(editData.version)
    const [prodPlan, setProdPlan] = useState(new Date(moment(editData.prodPlan).format("MM/DD/YYYY")))
    const [batch, setBatch] = useState(editData.batch)

    const [itemDescription, setItemDescription] = useState(null)
    const [uom, setUom] = useState(null)
    const [quantity, setQuantity] = useState(null)

    const [isDisabled, setIsDisabled] = useState(true)

    const resetCode = useRef()
    const resetVersion = useRef()

    const toast = useToast()

    const { isOpen: isErrorOpen, onOpen: openError, onClose: closeError } = useDisclosure()

    const fetchFormula = async () => {
        try {
            const res = await apiClient.get('Planning/GetAllAvailableFormulaCode')
            setFormulas(res.data)
        } catch (error) {
        }
    }

    const fetchVersionsApi = async (code) => {
        const res = await apiClient.get(`Planning/GetAllVersionByItemCode?itemcode=${code}`)
        return res.data
    }

    const fetchVersions = () => {
        fetchVersionsApi(code).then(res => {
            setCodeData(res)
        })
    }

    useEffect(() => {
        try {
            fetchFormula()
        } catch (error) {
        }

        return () => {
            setFormulas([])
        }
    }, [])

    useEffect(() => {
        fetchVersions()

        return () => {
            setCodeData([])
        }
    }, [code])

    useEffect(() => {
        const result = codeData.filter(item => item.version == version)
        if (result.length > 0) {
            setItemDescription(result[0].itemDescription ? result[0].itemDescription : '')
            setUom(result[0].uom ? result[0].uom : '')
            setQuantity(result[0].quantity ? result[0].quantity : '')
        }
        console.log(result)
    }, [itemCode])

    const itemCodeHandler = (data) => {
        if (data) {
            setItemCode(data)
            setCode(data)
            setIsDisabled(false)
        } else {
            setCode(undefined)
            setItemCode(undefined)
        }
    }

    const versionHandler = (data) => {
        if (data) {
            setIsDisabled(false)
            setVersion(data)
        } else {
            setVersion(undefined)
        }
    }

    const prodPlanHandler = (data) => {
        if (data) {
            setIsDisabled(false)
            setProdPlan(data)
        }
    }

    const batchHandler = (data) => {
        if (data) {
            setIsDisabled(false)
            setBatch(data)
        } else {
            setBatch(undefined)
        }
    }

    const submitHandler = () => {
        if (!itemCode) {
            ToastComponent("Error!", "Please provide an Item Code", "error", toast)
            return
        }
        if (!version) {
            ToastComponent("Error!", "Please specify a version", "error", toast)
            return
        }
        if (!prodPlan) {
            ToastComponent("Error!", "Production Plan is required", "error", toast)
            return
        }
        if (!batch) {
            ToastComponent("Error!", "Batch quantity is required", "error", toast)
            return
        }
        if (data.formData.batch < 0) {
            ToastComponent("Error!", "Negative values are not allowed.", "error", toast)
            return
        }
        // try {
        //     const res = apiClient.put(`Planning/EditTransformationRequest/${transformId}`,
        //         {
        //             transformId: transformId,
        //             itemCode: data.formData.itemCode,
        //             version: data.formData.version,
        //             batch: data.formData.batch,
        //             prodPlan: moment(data.formData.prodPlan).format("YYYY-MM-DD")
        //         }
        //     ).then((res) => {
        //         ToastComponent("Success", "Request has been submitted", "success", toast)
        //         setTransformId("")
        //         fetchRejected()
        //         fetchRequirements()
        //         fetchNotification()
        //         onClose()
        //     }).catch(err => {
        //         ToastComponent("Error", "Edit Failed", "error", toast)
        //         setErrorData(err.response.data.outofStock)
        //         if (err.response) {
        //             openError()
        //         }
        //     })
        // } catch (err) {
        // }
    }

    return (
        <Modal isOpen={isOpen} onClose={() => { }} isCentered size='4xl'>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <HStack justifyContent='center'>
                        <Text fontSize='l' fontWeight='semibold'>Edit Raw Materials Information</Text>
                    </HStack>
                </ModalHeader>
                <ModalCloseButton onClick={onClose} />
                <ModalBody>
                    <Flex justifyContent='space-between' mt={3}>
                        <VStack>
                            <HStack w='full'>

                                <Text fontSize='xs' fontWeight='semibold' w='40%'>
                                    Item Code:
                                </Text>
                                {
                                    formulas.length > 0 ? (
                                        <Select
                                            onChange={(e) => itemCodeHandler(e.target.value)}
                                            ref={resetCode}
                                            // defaultValue={editData.itemCode}
                                            value={itemCode ? itemCode : null}
                                            placeholder='Item Code' bgColor='#ffffe0'
                                        >
                                            {formulas?.map((formula, i) => (
                                                <option key={i} value={formula.itemCode}>{formula.itemCode}</option>
                                            ))}
                                        </Select>
                                    ) : "loading"
                                }
                            </HStack>
                            <HStack w='full'>
                                <Text fontSize='xs' fontWeight='semibold' w='40%'>
                                    Version:
                                </Text>
                                {
                                    code ? (
                                        <Select
                                            onChange={(e) => versionHandler(e.target.value)}
                                            ref={resetVersion}
                                            // defaultValue={editData.version}
                                            value={version ? version : null}
                                            placeholder='Version'
                                            bgColor='#ffffe0'
                                        >
                                            {codeData?.map((cd, i) => (
                                                <option key={i} value={cd.version}>{cd.version}</option>
                                            ))}
                                        </Select>
                                    ) : <Input disabled bgColor='#ffffe0' title='Item code is required' />
                                }

                            </HStack>
                            <HStack w='full'>
                                <Text fontSize='xs' fontWeight='semibold' w='40%'>
                                    Prod Plan:
                                </Text>
                                <DatePicker
                                    onChange={(date) => prodPlanHandler(date)}
                                    minDate={new Date()}
                                    selected={prodPlan}
                                />

                            </HStack>
                            <HStack w='full'>
                                <Text fontSize='xs' fontWeight='semibold' w='40%'>
                                    Batch:
                                </Text>
                                <Input
                                    onChange={(e) => batchHandler(e.target.value)}
                                    defaultValue={editData.batch}
                                    bgColor='#ffffe0'
                                />

                            </HStack>
                        </VStack>
                        <VStack>
                            <HStack w='full'>
                                <Text fontSize='xs' fontWeight='semibold' w='40%'>
                                    Item Description:
                                </Text>
                                <Input bgColor='gray.200' defaultValue={editData.itemDescription} readOnly />

                            </HStack>
                            <HStack w='full'>
                                <Text fontSize='xs' fontWeight='semibold' w='40%'>
                                    UOM:
                                </Text>
                                <Input bgColor='gray.200' defaultValue={editData.uom} readOnly />

                            </HStack>
                            <HStack w='full'>
                                <Text fontSize='xs' fontWeight='semibold' w='40%'>
                                    Quantity:
                                </Text>
                                <Input bgColor='gray.200' defaultValue={editData.quantity} readOnly />

                            </HStack>
                        </VStack>
                    </Flex>
                </ModalBody>
                <ModalFooter>
                    <Flex justifyContent='end' w='full' mt={8}>
                        <ButtonGroup size='sm'>
                            <Button colorScheme='blue' px={6} type='submit' onClick={submitHandler}>SAVE</Button>
                            <Button colorScheme='red' onClick={onClose}>CANCEL</Button>
                        </ButtonGroup>
                    </Flex>
                </ModalFooter>
            </ModalContent>

            {
                isErrorOpen && (
                    <ErrorModal
                        isOpen={isErrorOpen}
                        onClose={closeError}
                        errorData={errorData}
                    />
                )
            }

        </Modal >
    )
}

export default EditModalReject