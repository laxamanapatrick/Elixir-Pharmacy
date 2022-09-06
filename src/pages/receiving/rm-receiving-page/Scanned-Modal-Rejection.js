import React, { useState, useEffect, useContext, useRef } from 'react'
import {
    Box,
    Button,
    Flex,
    FormLabel,
    HStack,
    Input,
    Select,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionIcon,
    AccordionPanel,
    useToast
} from '@chakra-ui/react'
import { AiFillMinusCircle } from 'react-icons/ai'
import { IoIosAddCircle } from 'react-icons/io'
import apiClient from '../../../services/apiClient'
import { ToastComponent } from '../../../components/Toast'
import { WarehouseContext } from '../../../context/WarehouseContext'
import { useForm, Controller } from 'react-hook-form'

const fetchReasonsApi = async () => {
    const res = await apiClient.get('Reason/GetAllActiveReason')
    return res.data
}

const ScannedModalRejection = ({ quantity, remarks, sumQuantity, receivingId, actualGood }) => {

    const { setQuantity, setRemarks, setSumQuantity, setSubmitRejectData } = useContext(WarehouseContext)

    const [reasons, setReasons] = useState([])
    const [displayData, setDisplayData] = useState([])
    const [errors, setErrors] = useState({})

    const [showAddRow, setShowAddRow] = useState(null)

    const remarksDisplay = useRef(null)

    const toast = useToast()

    const { register } = useForm({
        mode: "onChange",
        defaultValues: {
            formData: {
                quantity: null,
            }
        }
    })

    const fetchReason = async () => {
        fetchReasonsApi().then(res => {
            setReasons(res)
        })
    }

    useEffect(() => {
        fetchReason()

        return () => {
            setReasons([])
        }
    }, [setReasons])

    useEffect(() => {

        if (displayData.length) {
            let totalQuantity = displayData.map((q) => parseFloat(q.quantity))
            let sum = totalQuantity.reduce((a, b) => a + b)
            setSumQuantity(sum)
        }
        else {
            setSumQuantity(0)
        }

    }, [displayData, sumQuantity])

    useEffect(() => {
        setSubmitRejectData(displayData)
    }, [displayData])

    const addNewRowHandler = () => {

        if (displayData.some((data) => data.remarks === remarks)) {
            ToastComponent("Error!", "Remarks description already added", "error", toast)
            return
        }

        if (!quantity) {
            setErrors({
                qty: true,
            })
            return
        }
        if (!remarks) {
            setErrors({
                rms: true
            })
            return
        } else {
            setErrors({
                qty: false,
                rms: false
            })
        }

        const data = {
            "warehouseReceivingId": receivingId,
            "quantity": quantity,
            "remarks": remarks,
        }
        setDisplayData([...displayData, data])

        setQuantity("")
        remarksDisplay.current.selectedIndex = ""
    }

    const deleteRejectionHandler = (data) => {
        setDisplayData(displayData.filter((row) =>
            row.remarks !== data
        ))
    }

    // const addRowVisibility = (data) => {
    //     if (data === true) {
    //         setShowAddRow(true)
    //     } else {
    //         setShowAddRow(false)
    //     }
    // }

    const quantityHandler = (data) => {
        if (data) {
            if (data >= actualGood) {
                ToastComponent("Warning", "You are providing a value greater than or equal to your Actual Good!", "warning", toast)
                setQuantity("")
            } else {
                setQuantity(data)
            }
        } else {
            setQuantity("")
        }
    }

    return (
        <Box>

            <Accordion allowToggle defaultIndex={[0]}>
                <AccordionItem>

                    <Flex justifyContent='center' mb={2} p={0.5} color='white' bgColor='secondary'>

                        <AccordionButton justifyContent='center' p={0}
                        // onClick={() => addRowVisibility(true)}
                        >
                            <Text>REJECTION INFORMATION <AccordionIcon /></Text>
                            <Flex p={0} m={0}></Flex>
                        </AccordionButton>

                        {/* {
                            !showAddRow ? "" : */}
                                <Button
                                    onClick={addNewRowHandler}
                                    bgColor='#3C8DBC'
                                    color='white'
                                    _hover={{ bgColor: 'accent' }}
                                    size='xs'
                                    // p={0.5}
                                    ml='-5.5%'
                                >
                                    Add Rejection
                                </Button>
                        {/* // } */}

                    </Flex>

                    <AccordionPanel>

                        <Flex justifyContent='space-between'>
                            <FormLabel w='40%'>
                                Quantity
                                <Input
                                    {...register("formData.quantity")}
                                    value={quantity}
                                    onChange={(e) => quantityHandler(parseInt(e.target.value))}
                                    onWheel={(e) => e.target.blur()}
                                    type='number'
                                    isInvalid={errors.qty}
                                    placeholder='Quantity'
                                />

                            </FormLabel>

                            <FormLabel w='40%'>
                                Remarks
                                {
                                    reasons.length > 0 ?
                                        (<Select
                                            ref={remarksDisplay}
                                            onChange={(e) => setRemarks(e.target.value)}
                                            isInvalid={errors.rms}
                                            placeholder='Select Reason'
                                        >
                                            {reasons?.map(reason =>
                                                <option key={reason.id} value={reason.reasonName}>{reason.reasonName}</option>
                                            )}
                                        </Select>) : "Loading"
                                }
                            </FormLabel>
                        </Flex>

                        <Text fontWeight='semibold' color='black'>
                            {/* Total Quantity: {sumQuantity} */}
                        </Text>


                        {
                            !displayData.length > 0 ? "" : (

                                <Table variant='striped' size="sm" mt={2}>
                                    <Thead>
                                        <Tr bgColor="secondary" >
                                            <Th color="white">Quantity</Th>
                                            <Th color="white">Remarks</Th>
                                            <Th color="white">Remove</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {displayData?.map((data, i) =>
                                            <Tr key={i}>
                                                <Td>{data.quantity}</Td>
                                                <Td>{data.remarks}</Td>
                                                <Td>
                                                    <Button p={0}
                                                        background='none'
                                                        color='secondary'
                                                        onClick={() => deleteRejectionHandler(data.remarks)}
                                                    >
                                                        <AiFillMinusCircle fontSize='20px' />
                                                    </Button>
                                                </Td>
                                            </Tr>
                                        )}
                                    </Tbody>
                                </Table>
                            )}

                    </AccordionPanel>

                </AccordionItem>
            </Accordion>
        </Box>

    )
}

export default ScannedModalRejection