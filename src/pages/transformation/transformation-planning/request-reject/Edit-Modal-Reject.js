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
    useDisclosure,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
    PopoverCloseButton,
    PopoverHeader,
    PopoverBody,
    PopoverFooter
} from '@chakra-ui/react'
import { BsFillQuestionOctagonFill } from 'react-icons/bs'
import DatePicker from 'react-datepicker'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { decodeUser } from '../../../../services/decode-user';
import { ToastComponent } from '../../../../components/Toast';
import apiClient from '../../../../services/apiClient';
import moment from 'moment';
import ErrorModal from '../add-request/Error-Modal';

const currentUser = decodeUser()

const schema = yup.object().shape({
    formData: yup.object().shape({
        itemCode: yup.string().required("HH"),
        itemDescription: yup.string(),
        uom: yup.string(),
        prodPlan: yup.date().required(),
        version: yup.number().required().typeError(),
        batch: yup.number().required().typeError(),
        quantity: yup.number(),
    })
})

const EditModalReject = ({ isOpen, onClose, transformId, setTransformId, editData, fetchRejected, fetchRequirements, fetchNotification }) => {

    const [formulas, setFormulas] = useState([])
    const [code, setCode] = useState("")
    const [codeData, setCodeData] = useState([])
    const [errorData, setErrorData] = useState([])

    const [isLoading, setIsLoading] = useState(false)

    const resetCode = useRef()
    const resetVersion = useRef()

    const toast = useToast()

    const { isOpen: isErrorOpen, onOpen: openError, onClose: closeError } = useDisclosure()
    const { isOpen: isSaveOpen, onOpen: openSave, onClose: closeSave } = useDisclosure()

    const { reset, handleSubmit, control, watch, getValues, setValue, formState: { errors, isValid } } = useForm({
        resolver: yupResolver(schema),
        mode: "onChange",
        defaultValues: {
            formData: {
                transformId: transformId,
                itemCode: "",
                itemDescription: "",
                uom: "",
                prodPlan: new Date(),
                version: "",
                batch: "",
                quantity: "",
                addedBy: currentUser.fullName
            }
            // formData: {
            //     transformId: transformId,
            //     itemCode: editData.itemCode,
            //     itemDescription: editData.itemDescription,
            //     uom: editData.uom,
            //     prodPlan: new Date(moment(editData.prodPlan).format("YYYY-MM-DD")),
            //     version: editData.version,
            //     batch: editData.batch,
            //     quantity: editData.quantity,
            //     addedBy: currentUser.fullName
            // }
        }
    })

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
        const itemCode = getValues('formData.itemCode')
        if (itemCode) {
            setCode(itemCode)
        }
        else {
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

    // useEffect(() => {
    //     if (watch('formData.itemCode') == editData.itemCode) {
    //         ToastComponent("Warning", "You are providing the same Item Code.", "warning", toast)
    //     }
    // }, [watch('formData.itemCode')])

    // useEffect(() => {
    //     if (moment(watch('formData.prodPlan')).format("MM/dd/yyyy") == moment(editData.prodPlan).format("MM/dd/yyyy") && moment(watch('formData.prodPlan')).format("MM/dd/yyyy") != moment(new Date()).format("MM/dd/yyyy")) {
    //         ToastComponent("Warning", "You are providing the same Production Plan.", "warning", toast)
    //     }
    // }, [watch('formData.prodPlan')])

    // useEffect(() => {
    //     if (watch('formData.batch') == editData.batch) {
    //         ToastComponent("Warning", "You are providing the same batch number.", "warning", toast)
    //     }
    // }, [watch('formData.batch')])

    const submitHandler = (data) => {
        if (data.formData.batch <= 0) {
            ToastComponent("Error!", "Zero or Negative values are not allowed.", "error", toast)
            return
        }
        if (data.formData.itemCode == editData.itemCode && data.formData.version == editData.version && data.formData.batch == editData.batch && moment(data.formData.prodPlan).format("MM/dd/yyyy") == moment(editData.prodPlan).format("MM/dd/yyyy")) {
            openSave()
            return
        }
        else {
            setIsLoading(true)
            try {
                const res = apiClient.put(`Planning/EditTransformationRequest/${transformId}`,
                    {
                        transformId: transformId,
                        itemCode: data.formData.itemCode,
                        version: data.formData.version,
                        batch: data.formData.batch,
                        prodPlan: moment(data.formData.prodPlan).format("YYYY-MM-DD")
                    }
                ).then((res) => {
                    ToastComponent("Success", "Request has been submitted", "success", toast)
                    setTransformId("")
                    fetchRejected()
                    fetchRequirements()
                    fetchNotification()
                    onClose()
                }).catch(err => {
                    ToastComponent("Error", "Edit Failed", "error", toast)
                    setErrorData(err.response.data.outofStock)
                    if (err.response) {
                        openError()
                    }
                })
            } catch (err) {
            }
        }

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

                <form onSubmit={handleSubmit(submitHandler)}>
                    <ModalBody>

                        <Text bgColor='secondary' color='white' textAlign='center'>From:</Text>
                        <Flex justifyContent='space-between' mt={3} mb={3}>
                            <VStack w='32%'>
                                <HStack w='full'>
                                    <Text fontSize='xs' fontWeight='semibold' w='40%'>
                                        Item Code:
                                    </Text>
                                    <Text w='full' p={2} bgColor='gray.200'>{editData.itemCode}</Text>
                                </HStack>
                                <HStack w='full'>
                                    <Text fontSize='xs' fontWeight='semibold' w='40%'>
                                        Version:
                                    </Text>
                                    <Text w='full' p={2} bgColor='gray.200'>{editData.version}</Text>
                                </HStack>
                                <HStack w='full'>
                                    <Text fontSize='xs' fontWeight='semibold' w='40%'>
                                        Prod Plan:
                                    </Text>
                                    <Text w='full' p={2} bgColor='gray.200'>{editData.prodPlan}</Text>
                                </HStack>
                                <HStack w='full'>
                                    <Text fontSize='xs' fontWeight='semibold' w='40%'>
                                        Batch:
                                    </Text>
                                    <Text w='full' p={2} bgColor='gray.200'>{editData.batch}</Text>
                                </HStack>
                            </VStack>
                            <VStack w='38%'>
                                <HStack w='full'>
                                    <Text fontSize='xs' fontWeight='semibold' w='40%'>
                                        Item Description:
                                    </Text>
                                    <Text w='full' p={2} bgColor='gray.200'>{editData.itemDescription}</Text>
                                </HStack>
                                <HStack w='full'>
                                    <Text fontSize='xs' fontWeight='semibold' w='40%'>
                                        UOM:
                                    </Text>
                                    <Text w='full' p={2} bgColor='gray.200'>{editData.uom}</Text>
                                </HStack>
                                <HStack w='full'>
                                    <Text fontSize='xs' fontWeight='semibold' w='40%'>
                                        Quantity:
                                    </Text>
                                    <Text w='full' p={2} bgColor='gray.200'>{editData.quantity}</Text>
                                </HStack>
                            </VStack>
                        </Flex>

                        <Text bgColor='secondary' color='white' textAlign='center'>To:</Text>
                        <Flex justifyContent='space-between' mt={3}>
                            <VStack>
                                <HStack w='full'>

                                    <Text fontSize='xs' fontWeight='semibold' w='40%'>
                                        Item Code:
                                    </Text>
                                    {/* <VStack w='full'> */}
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
                                                        placeholder='Item Code' bgColor='#ffffe0'
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
                                    {/* <Text color="#808500" fontSize="xs">{watch('formData.itemCode') == editData.itemCode ? "Warning: Same item code provided" : ""}</Text>
                                    </VStack> */}
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
                                                        placeholder='Version'
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
                                        Batch:
                                    </Text>
                                    <VStack spacing={0} w='full'>
                                        <Controller
                                            name='formData.batch'
                                            control={control}
                                            render={
                                                ({
                                                    field: { onChange, value }
                                                }) => (
                                                    <Input bgColor='#ffffe0' onChange={onChange} value={value} />
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

                    </ModalBody>

                    <ModalFooter>
                        <Flex justifyContent='end' w='full' mt={8}>
                            <ButtonGroup size='sm'>
                                <Button colorScheme='blue' px={6} type='submit' disabled={!isValid || isLoading}
                                 isLoading={isLoading}
                                >
                                    SAVE</Button>
                                <Button colorScheme='red' onClick={onClose}>CANCEL</Button>
                            </ButtonGroup>
                        </Flex>
                    </ModalFooter>

                </form>

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

            {
                isSaveOpen && (
                    <SaveModal
                        isOpen={isSaveOpen}
                        onClose={closeSave}
                        closeEditModal={onClose}
                        openError={openError}
                        transformId={transformId}
                        submitData={watch('formData')}
                        setTransformId={setTransformId}
                        fetchRejected={fetchRejected}
                        fetchRequirements={fetchRequirements}
                        fetchNotification={fetchNotification}
                        setErrorData={setErrorData}
                    />
                )
            }

        </Modal >
    )
}

export default EditModalReject


const SaveModal = ({ isOpen, onClose, closeEditModal, openError, transformId, submitData,
    setTransformId,
    fetchRejected,
    fetchRequirements,
    fetchNotification,
    setErrorData }) => {

    const toast = useToast()

    const [isLoading, setIsLoading] = useState(false)

    const submitWarning = () => {
        setIsLoading(true)
        try {
            const res = apiClient.put(`Planning/EditTransformationRequest/${transformId}`,
                {
                    transformId: transformId,
                    itemCode: submitData.itemCode,
                    version: submitData.version,
                    batch: submitData.batch,
                    prodPlan: moment(submitData.prodPlan).format("YYYY-MM-DD")
                }
            ).then((res) => {
                ToastComponent("Success", "Request has been submitted", "success", toast)
                setTransformId("")
                fetchRejected()
                fetchRequirements()
                fetchNotification()
                onClose()
                closeEditModal()
            }).catch(err => {
                ToastComponent("Error", "Edit Failed", "error", toast)
                setErrorData(err.response.data.outofStock)
                if (err.response) {
                    openError()
                }
            })
        } catch (err) {
        }
    }

    return (

        <Modal isCentered size='xl' isOpen={isOpen} onClose={() => { }}>
            <ModalContent>

                <ModalHeader>
                    <VStack justifyContent='center'>
                        <BsFillQuestionOctagonFill fontSize='40px' color='#eed202' />
                        <Heading fontSize='25px'>Warning</Heading>
                    </VStack>
                </ModalHeader>
                <ModalCloseButton onClick={onClose} />

                <ModalBody>
                    <VStack justifyContent='center'>
                        <Text textAlign='center'>You have made no changes.</Text>
                        <Text fontSize='sm'>Do you wish to proceed?</Text>
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <ButtonGroup size='sm'>
                        <Button variant='solid' colorScheme='blue' onClick={submitWarning}
                        isLoading={isLoading}
                        disabled={isLoading}
                        >Yes</Button>
                        <Button variant='solid' colorScheme='red' onClick={onClose}>No</Button>
                    </ButtonGroup>
                </ModalFooter>

            </ModalContent>
        </Modal>

    )

}