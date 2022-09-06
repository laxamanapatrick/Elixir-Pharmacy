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
import apiClient from '../../../services/apiClient'
import { ToastComponent } from '../../../components/Toast'
import { ReceivingContext } from '../../../context/ReceivingContext'

const fetchReasonsApi = async () => {
    const res = await apiClient.get('Reason/GetAllActiveReason')
    return res.data
}

export const EditModalComponentRejectionInfo = ({ receivingId, sumQuantity }) => {

    const { setSubmitDataTwo, setSumQuantity } = useContext(ReceivingContext)

    const [reasons, setReasons] = useState([])
    const [quantity, setQuantity] = useState(undefined)
    const [remarks, setRemarks] = useState("")
    const [remarksName, setRemarksName] = useState("")
    const [errors, setErrors] = useState({})
    const [finalData, setFinalData] = useState([])

    const [showAddRow, setShowAddRow] = useState(null)

    const remarksDisplay = useRef(null)

    const toast = useToast()

    const fetchReason = async () => {
        fetchReasonsApi().then(res => {
            setReasons(res)
        })
    }

    useEffect(() => {
        fetchReason()
    }, [setReasons])

    useEffect(() => {

        if (finalData.length) {
            let totalQuantity = finalData.map((q) => parseFloat(q.quantity))
            let sum = totalQuantity.reduce((a, b) => a + b)
            setSumQuantity(sum)
        } else {
            setSumQuantity(0)
        }

    }, [finalData, sumQuantity])

    useEffect(() => {
        setSubmitDataTwo(finalData)
    }, [finalData])

    const quantityHandler = (data) => {
        const newData = Number(data)
        setQuantity(newData)
    }

    const remarksHandler = (data) => {
        if (data) {
            const newData = JSON.parse(data)
            setRemarks(newData.id)
            setRemarksName(newData.reasonName)
        }
        else {
            setRemarks("")
        }
    }

    const addNewRowHandler = () => {

        if (finalData.some((data) => data.remarks === remarks)) {
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
            "pO_ReceivingId": receivingId,
            "quantity": quantity,
            "remarks": remarks,
            "remarksName": remarksName
        }
        setFinalData([...finalData, data])

        remarksDisplay.current.selectedIndex = 0
        setQuantity("")

    }

    const deleteRejectionHandler = (data) => {
        setFinalData(finalData.filter((row) =>
            row.remarksName !== data
        ))
    }

    return (
        <Box>

            <Accordion allowToggle defaultIndex={[0]}>
                <AccordionItem>

                    <Flex justifyContent='space-between' mb={2} p={0.5} color='white' bgColor='secondary'>

                        <AccordionButton justifyContent='center' p={0} 
                        // onClick={() => setShowAddRow(true)}
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
                                    value={quantity}
                                    onChange={(e) => quantityHandler(e.target.value)}
                                    isInvalid={errors.qty}
                                    placeholder='Quantity'
                                    type='number'
                                />
                            </FormLabel>

                            <FormLabel w='40%'>
                                Remarks
                                {
                                    reasons.length > 0 ?
                                        (<Select
                                            ref={remarksDisplay}
                                            onChange={(e) => remarksHandler(e.target.value)}
                                            isInvalid={errors.rms}
                                            placeholder='Select Reason'
                                        >
                                            {reasons?.map(reason =>
                                                <option key={reason.id} value={JSON.stringify(reason)}>{reason.reasonName}</option>
                                            )}
                                        </Select>) : "Loading"
                                }
                            </FormLabel>
                        </Flex>


                        <Text fontWeight='semibold' color='black'>
                            Total Quantity: {sumQuantity}
                        </Text>

                        {
                            !finalData.length > 0 ? "" : (

                                <Table variant='striped' size="sm" mt={2}>
                                    <Thead>
                                        <Tr bgColor="secondary" >
                                            <Th color="white">Quantity</Th>
                                            <Th color="white">Remarks</Th>
                                            <Th color="white"></Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {finalData?.map((data, i) =>
                                            <Tr key={i}>
                                                <Td>{data.quantity}</Td>
                                                <Td>{data.remarksName}</Td>
                                                {/* <Td>{data.rawMaterialDescription}</Td> */}
                                                <Td>
                                                    <Button p={0}
                                                        background='none'
                                                        color='secondary'
                                                        onClick={() => deleteRejectionHandler(data.remarksName)}
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
