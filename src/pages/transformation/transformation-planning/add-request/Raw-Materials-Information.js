import React, { useState, useEffect, useRef } from 'react'
import {
    Button,
    ButtonGroup,
    Flex,
    Heading,
    HStack,
    Input,
    Select,
    Text,
    useToast,
    useDisclosure,
    VStack
} from '@chakra-ui/react'
import DatePicker from 'react-datepicker'
import apiClient from '../../../../services/apiClient'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { ToastComponent } from '../../../../components/Toast'
import moment from 'moment'
import { decodeUser } from '../../../../services/decode-user'
import ErrorModal from './Error-Modal'

const currentUser = decodeUser()

const schema = yup.object().shape({
    formData: yup.object().shape({
        itemCode: yup.string().required("HH"),
        itemDescription: yup.string(),
        uom: yup.string(),
        prodPlan: yup.date().required(),
        version: yup.number().required().typeError(),
        batch: yup.number().required().typeError("Must be a number"),
        quantity: yup.number(),
    })
})

export const RawMaterialsInformation = ({ formulas, setCode, codeData, fetchRequests, fetchNotification }) => {

    const resetCode = useRef()
    const resetVersion = useRef()

    const [errorData, setErrorData] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const toast = useToast()

    const { isOpen: isErrorOpen, onOpen: openError, onClose: closeError } = useDisclosure()

    const { reset, handleSubmit, control, watch, getValues, setValue, formState: { errors, isValid } } = useForm({
        resolver: yupResolver(schema),
        mode: "onChange",
        defaultValues: {
            formData: {
                itemCode: "",
                itemDescription: "",
                uom: "",
                prodPlan: new Date(),
                version: "",
                batch: "",
                quantity: "",
                addedBy: currentUser.fullName
            }
        }
    })

    useEffect(() => {
        const itemCode = getValues('formData.itemCode')
        if (itemCode) {
            setCode(itemCode)
        } else {
            setCode("")
        }
        setValue('formData.version', "")
        // setValue('formData.prodPlan', "")
        setValue('formData.itemDescription', "")
        setValue('formData.uom', "")
        setValue('formData.batch', "")
        setValue('formData.quantity', "")
    }, [watch('formData.itemCode')])

    useEffect(() => {
        const version = getValues('formData.version')
        const result = codeData.filter(item => item.version == version)
        if (result.length > 0) {
            setValue('formData.itemDescription', result[0].itemDescription ? result[0].itemDescription : '')
            setValue('formData.uom', result[0].uom ? result[0].uom : '')
            setValue('formData.quantity', result[0].quantity ? result[0].quantity : '')
        }
    }, [watch('formData.version')])

    const clearHandler = () => {
        resetCode.current.value = ''
        reset()
    }

    const submitHandler = (data) => {
        if (data.formData.batch < 0) {
            ToastComponent("Error!", "Negative values are not allowed.", "error", toast)
            return
        }
        setIsLoading(true)
        try {
            const res = apiClient.post('Planning/AddNewTransformationRequest', data.formData).then((res) => {
                ToastComponent("Success", "Request has been submitted", "success", toast)
                const transformId = res.data.id

                if (transformId) {
                    try {
                        const res = apiClient.post('Planning/AddNewTransformationRequirements',
                            {
                                transformId: transformId,
                                itemCode: data.formData.itemCode,
                                version: data.formData.version
                            }
                        )
                    } catch (error) {
                    }
                }

                fetchNotification()
                setIsLoading(false)
                fetchRequests()
                resetCode.current.value = ''
                reset()

            }).catch(err => {
                ToastComponent("Error", "Request Failed", "error", toast)
                setErrorData(err.response.data.outofStock)
                if (err.response) {
                    openError()
                }
                setIsLoading(false)
            })
        } catch (err) {
        }
    }

    return (
        <>
            <Flex w='90%' flexDirection='column'>
                <Flex justifyContent='center' bgColor='secondary' p={1}>
                    <Heading color='white' fontSize='l' fontWeight='semibold'>Raw Materials Information</Heading>
                </Flex>

                <form onSubmit={handleSubmit(submitHandler)}>
                    <Flex justifyContent='space-between' mt={3}>
                        <VStack>
                            <HStack w='full'>

                                <Text fontSize='xs' fontWeight='semibold' w='40%'>
                                    Item Code:
                                </Text>
                                <Controller
                                    name='formData.itemCode'
                                    control={control}
                                    render={
                                        ({
                                            field: { onChange },
                                        }) => (
                                            formulas.length > 0 ? (
                                                <Select
                                                    onChange={onChange}
                                                    placeholder=' ' bgColor='#ffffe0'
                                                    ref={resetCode}
                                                >
                                                    {formulas?.map((formula, i) => (
                                                        <option key={i} value={formula.itemCode}>{formula.itemCode}</option>
                                                    ))}
                                                </Select>
                                            ) : "loading"
                                        )
                                    }
                                />
                            </HStack>
                            <HStack w='full'>
                                <Text fontSize='xs' fontWeight='semibold' w='40%'>
                                    Version:
                                </Text>
                                <Controller
                                    name='formData.version'
                                    control={control}
                                    render={
                                        ({
                                            field: { onChange }
                                        }) => (
                                            codeData.length > 0 ? (
                                                <Select
                                                    onChange={onChange}
                                                    ref={resetVersion}
                                                    placeholder=' '
                                                    bgColor='#ffffe0'
                                                >
                                                    {codeData?.map((cd, i) => (
                                                        <option key={i} value={cd.version}>{cd.version}</option>
                                                    ))}
                                                </Select>
                                            ) : <Input disabled bgColor='#ffffe0' title='Item code is required' />
                                        )
                                    }
                                />
                            </HStack>
                            <HStack w='full'>
                                <Text fontSize='xs' fontWeight='semibold' w='40%'>
                                    Prod Plan:
                                </Text>
                                <Controller
                                    name='formData.prodPlan'
                                    control={control}
                                    render={
                                        ({
                                            field: { onChange, value },
                                        }) => (
                                            <DatePicker
                                                minDate={new Date()}
                                                onChange={onChange}
                                                selected={value}
                                            />
                                        )
                                    }
                                />
                            </HStack>
                            <HStack w='full'>
                                <Text fontSize='xs' fontWeight='semibold' w='40%'>
                                    Quantity Batch:
                                </Text>
                                <VStack spacing={0} w='full'>
                                    <Controller
                                        name='formData.batch'
                                        control={control}
                                        render={
                                            ({
                                                field: { onChange, value }
                                            }) => (
                                                <Input
                                                    onChange={onChange} value={value}
                                                    bgColor='#ffffe0'
                                                    type="number"
                                                    onWheel={(e) => e.target.blur()}
                                                    onKeyDown={(e) => ["E", "e", ".", "+", "-"].includes(e.key) && e.preventDefault()}
                                                    onPaste={(e) => e.preventDefault()}
                                                />
                                            )
                                        }
                                    />
                                    <Text color="danger" fontSize="xs">{errors.formData?.batch?.message}</Text>
                                </VStack>
                            </HStack>
                        </VStack>
                        <VStack>
                            <HStack w='full'>
                                <Text fontSize='xs' fontWeight='semibold' w='40%'>
                                    Item Description:
                                </Text>
                                <Controller
                                    name='formData.itemDescription'
                                    control={control}
                                    render={
                                        ({
                                            field: { onChange, value }
                                        }) => (
                                            <Input bgColor='gray.200' onChange={onChange} value={value} readOnly />
                                        )
                                    }
                                />
                            </HStack>
                            <HStack w='full'>
                                <Text fontSize='xs' fontWeight='semibold' w='40%'>
                                    UOM:
                                </Text>
                                <Controller
                                    name='formData.uom'
                                    control={control}
                                    render={
                                        ({
                                            field: { onChange, value }
                                        }) => (
                                            <Input bgColor='gray.200' onChange={onChange} value={value} readOnly />
                                        )
                                    }
                                />
                            </HStack>
                            <HStack w='full'>
                                <Text fontSize='xs' fontWeight='semibold' w='40%'>
                                    Quantity:
                                </Text>
                                <Controller
                                    name='formData.quantity'
                                    control={control}
                                    render={
                                        ({
                                            field: { onChange, value }
                                        }) => (
                                            <Input bgColor='gray.200' onChange={onChange} value={value} readOnly />
                                        )
                                    }
                                />
                            </HStack>
                        </VStack>
                    </Flex>

                    <Flex justifyContent='end' mt={6} w='full' bgColor='gray.200'>
                        <ButtonGroup size='xs'>
                            <Button colorScheme='blue' type='submit' disabled={!isValid || isLoading} isLoading={isLoading}>REQUEST</Button>
                            <Button colorScheme='yellow' onClick={clearHandler}>Clear</Button>
                        </ButtonGroup>
                    </Flex>
                </form>
            </Flex>
            {
                isErrorOpen && (
                    <ErrorModal
                        isOpen={isErrorOpen}
                        onClose={closeError}
                        errorData={errorData}
                    />
                )
            }
        </>
    )
}
