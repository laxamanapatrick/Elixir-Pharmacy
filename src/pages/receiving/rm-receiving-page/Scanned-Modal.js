import React, { useState, useEffect } from 'react'
import {
    Flex,
    HStack,
    Input,
    Text,
    Button,
    Stack,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Box,
    Select,
    FormLabel,
    useToast,
    VStack,
    useDisclosure,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionIcon,
    AccordionPanel,
} from '@chakra-ui/react'
import PageScrollReceiving from '../../../components/PageScrollReceiving'
import ScannedModalRejection from './Scanned-Modal-Rejection'
import ScannedModalSubmit from './Scanned-Modal-Submit'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import apiClient from '../../../services/apiClient'

const fetchLotCategoryApi = async () => {
    const res = await apiClient.get('Lot/GetAllLotCategories')
    return res.data
}

const ScannedModal = ({ receivingId , itemCodeData, setReceivingDate, setLotCategory, setActualGood, quantity, remarks, sumQuantity, actualGood }) => {

    const [receivingDateDisplay, setReceivingDateDisplay] = useState(null)
    const [lotCategories, setLotCategories] = useState([])

    const { register } = useForm({
        resolver: yupResolver(),
        mode: "onChange",
        defaultValues: {
            displayData: {
                id: itemCodeData.id,
                pO_Number: itemCodeData.pO_Number,
                itemCode: itemCodeData.itemCode,
                itemDescription: itemCodeData.itemDescription,
                supplier: itemCodeData.supplier,
                uom: itemCodeData.uom,
                actualDelivered: itemCodeData.actualDelivered,
                expiration: moment(itemCodeData.expiration).format("MM/DD/YYYY"),
                expirationDays: itemCodeData.expirationDays,
                manufacturingDate: moment(itemCodeData.manufacturingDate).format("MM/DD/YYYY"),
                totalStock: itemCodeData.totalStock,
                expectedDelivery: itemCodeData.expectedDelivery,
                updatedStock: parseInt(itemCodeData.totalStock) + parseInt(itemCodeData.actualDelivered),
                actualReject: sumQuantity
            }
        }
    })

    const fetchLotCategory = async () => {
        fetchLotCategoryApi().then(res => {
            setLotCategories(res)
        })
    }

    useEffect(() => {
        fetchLotCategory()
    }, [setLotCategories])

    useEffect(() => {
        setActualGood(itemCodeData.actualDelivered - sumQuantity)
    }, [sumQuantity])

    const receivingDateProvider = (data) => {
        setReceivingDateDisplay(data)
        const newData = moment(data).format("YYYY-MM-DD")
        setReceivingDate(newData)
    }

    return (
        <Flex justifyContent='space-between' flexDirection='column'>

            <PageScrollReceiving>
                <Stack spacing={5}>

                    {/* RAW MATERIALS INFORMATION */}

                    <Flex justifyContent='center' p={1} color='white' bgColor='secondary'>
                        <Text>RAW MATERIALS INFORMATION</Text>
                    </Flex>

                    <Flex justifyContent='space-between'>
                        <FormLabel w='40%'>
                            Item Code
                            <Input
                                {...register("displayData.itemCode")}
                                readOnly={true}
                                _disabled={{ color: 'black' }}
                                disabled={true}
                            />
                        </FormLabel>

                        <FormLabel w='40%'>
                            Receiving Date
                            <DatePicker
                                onChange={(date) => receivingDateProvider(date)}
                                minDate={new Date(new Date().setDate(new Date().getDate() - 3))}
                                maxDate={new Date()}
                                shouldCloseOnSelect
                                selected={receivingDateDisplay}
                                className='chakra-input css-7s3glp'
                            />
                        </FormLabel>
                    </Flex>

                    <Flex justifyContent='space-between'>
                        <FormLabel w='40%'>
                            Description
                            <Input
                                {...register("displayData.itemDescription")}
                                readOnly={true}
                                _disabled={{ color: 'black' }}
                                disabled={true}
                            />
                        </FormLabel>

                        <FormLabel w='40%'>
                            Manufacturing Date
                            <Input
                                placeholder='no data on get'
                                {...register("displayData.manufacturingDate")}
                                readOnly={true}
                                _disabled={{ color: 'black' }}
                                disabled={true}
                            />
                        </FormLabel>
                    </Flex>

                    <Flex justifyContent='space-between'>
                        <FormLabel w='40%'>
                            Supplier
                            <Input
                                {...register("displayData.supplier")}
                                readOnly={true}
                                _disabled={{ color: 'black' }}
                                disabled={true}
                            />
                        </FormLabel>

                        <FormLabel w='40%'>
                            Expiration
                            <Input
                                {...register("displayData.expiration")}
                                placeholder='Alapa Variable'
                                readOnly={true}
                                _disabled={{ color: 'black' }}
                                disabled={true}
                            />
                        </FormLabel>
                    </Flex>

                    <Flex justifyContent='space-between'>
                        <FormLabel w='40%'>
                            PO NO.
                            <Input
                                {...register("displayData.pO_Number")}
                                readOnly={true}
                                _disabled={{ color: 'black' }}
                                disabled={true}
                            />
                        </FormLabel>

                        <FormLabel w='40%'>
                            Days of Expiry
                            <Input
                                {...register("displayData.expirationDays")}
                                placeholder='Alapa Variable'
                                readOnly={true}
                                _disabled={{ color: 'black' }}
                                disabled={true}
                            />
                        </FormLabel>
                    </Flex>

                    {/* QA RECEIVING INFORMATION */}

                    <Flex justifyContent='center' p={1} color='white' bgColor='secondary'>
                        <Text>QA RECEIVING INFORMATION</Text>
                    </Flex>

                    <Flex justifyContent='space-between'>
                        <FormLabel w='40%'>
                            Actual Delivered
                            <Input
                                {...register("displayData.expectedDelivery")}
                                readOnly={true}
                                _disabled={{ color: 'black' }}
                                disabled={true}
                            />
                        </FormLabel>

                        <FormLabel w='40%'>
                            Qty. Good
                            <Input
                                placeholder='no data on get'
                                {...register("displayData.actualDelivered")}
                                readOnly={true}
                                _disabled={{ color: 'black' }}
                                disabled={true}
                            />
                        </FormLabel>
                    </Flex>

                    {/* PHARMACY WAREHOUSE RAW MATERIALS RECEIVING INFORMATION */}

                    <Flex justifyContent='center' p={1} color='white' bgColor='secondary'>
                        <Text>PHARMACY WAREHOUSE RAW MATERIALS RECEIVING INFORMATION</Text>
                    </Flex>

                    <Flex justifyContent='space-between'>
                        <FormLabel w='40%'>
                            UOM
                            <Input
                                {...register("displayData.uom")}
                                readOnly={true}
                                _disabled={{ color: 'black' }}
                                disabled={true}
                            />
                        </FormLabel>

                        <FormLabel w='40%'>
                            LOT Name
                            {
                                lotCategories.length > 0 ?
                                    (<Select
                                        onChange={(e) => setLotCategory(e.target.value)}
                                        // isInvalid={errors.rms}
                                        placeholder='Select Lot Category'
                                        bgColor='#ffffe0'
                                    >
                                        {lotCategories?.map(lot =>
                                            <option key={lot.id} value={lot.categoryName}>{lot.categoryName}</option>
                                        )}
                                    </Select>) : "Loading"
                            }
                        </FormLabel>
                    </Flex>

                    <Flex justifyContent='space-between'>
                        <FormLabel w='40%'>
                            Total Stock
                            <Input
                                {...register("displayData.totalStock")}
                                readOnly={true}
                                _disabled={{ color: 'black' }}
                                disabled={true}
                            />
                        </FormLabel>

                        <FormLabel w='40%'>
                            Updated Stock
                            <Input
                                {...register("displayData.updatedStock")}
                                readOnly={true}
                                _disabled={{ color: 'black' }}
                                disabled={true}
                            />
                        </FormLabel>

                    </Flex>

                    <Flex justifyContent='space-between'>
                        <FormLabel w='40%'>
                            Actual Reject
                            <Input
                                value={sumQuantity}
                                readOnly={true}
                                _disabled={{ color: 'black' }}
                                disabled={true}
                            />
                        </FormLabel>

                        <FormLabel w='40%'>
                            Actual Good
                            <Input
                                value={actualGood}
                                bgColor='#ffffe0'
                                readOnly={true}
                                _disabled={{ color: 'black' }}
                                disabled={true}
                            />
                        </FormLabel>

                    </Flex>

                    {/* REJECTION INFORMATION */}
                    <ScannedModalRejection quantity={quantity} remarks={remarks} sumQuantity={sumQuantity} receivingId={receivingId} />

                </Stack>

            </PageScrollReceiving>

        </Flex >
    )
}

export default ScannedModal