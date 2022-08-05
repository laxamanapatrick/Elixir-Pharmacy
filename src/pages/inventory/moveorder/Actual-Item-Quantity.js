import React, { useState, useEffect, useRef } from 'react'
import { Button, Flex, HStack, Input, Text, toast, useDisclosure, useToast } from '@chakra-ui/react'
import { FaCloudscale } from 'react-icons/fa'
import DatePicker from "react-datepicker";
import { AddQuantityConfirmation, PlateNumberConfirmation } from './Action-Modals';
import moment from 'moment';
import { ToastComponent } from '../../../components/Toast';

export const ActualItemQuantity = ({ warehouseId, setWarehouseId, barcodeData, orderId, highlighterId, setHighlighterId,
    itemCode, fetchOrderList, fetchPreparedItems, qtyOrdered, preparedQty, nearlyExpireBarcode
}) => {

    const barcodeRef = useRef(null)

    const [quantity, setQuantity] = useState('')
    const expirationDate = moment(barcodeData?.orders?.expirationDate).format("yyyy-MM-DD")
    const [inputValidate, setInputValidate] = useState(true)

    const toast = useToast()

    const { isOpen: isQuantity, onClose: closeQuantity, onOpen: openQuantity } = useDisclosure()

    useEffect(() => {
        const total = Number(quantity) + Number(preparedQty)
        const stock = Number(barcodeData.remaining)
        if (total > qtyOrdered || quantity > stock) {
            setInputValidate(true)
        }
        else {
            setInputValidate(false)
        }

        return () => {
            setInputValidate(true)
            setInputValidate(true)
        }
    }, [quantity])

    //autofocuse on barcode
    useEffect(() => {
        if (warehouseId === '') {
            window.setTimeout(() => {
                barcodeRef?.current?.focus()
            }, 600)
        }
    }, [warehouseId])

    const allowableQuantity = quantity * 0.5

    //Barcode Validation of Nearly Expired inventory
    useEffect(() => {
        if (barcodeData?.orders?.warehouseId) {
            if (barcodeData?.orders?.warehouseId != barcodeData?.warehouseId) {
                ToastComponent(
                    "Warning",
                    `The barcode ${barcodeData?.warehouseId} will expire earlier than provided barcode ${barcodeData?.orders?.warehouseId}`,
                    "warning",
                    toast
                )
            }
        }
    }, [barcodeData])

    return (
        <Flex w='full' flexDirection='column'>

            <Text color='white' bgColor='secondary' textAlign='center'>Actual Item Quantity</Text>

            <HStack justifyContent='space-between' mt={2}>
                <HStack spacing={1}>
                    <Text bgColor='secondary' color='white' px={10} textAlign='start' fontSize='sm'>Scan Barcode:</Text>
                    <Input
                        onChange={(e) => setWarehouseId(e.target.value)}
                        ref={barcodeRef}
                        type="number"
                        onWheel={(e) => e.target.blur()}
                        onKeyDown={(e) => ["E", "e", ".", "+", "-"].includes(e.key) && e.preventDefault()}
                        placeholder='Barcode number'
                        h='15%' w='50%' bgColor='#fff8dc'
                    />
                </HStack>
                <HStack spacing={5}>
                    <Text bgColor='secondary' color='white' px={10} textAlign='start' fontSize='sm'>Remaining Quantity:</Text>
                    <Text bgColor='gray.200' border='1px' px={12} fontSize='sm'>{barcodeData?.orders?.remaining ? barcodeData?.orders?.remaining : 'No data with this barcode'}</Text>
                </HStack>
                <HStack spacing={5}>
                    <Text bgColor='secondary' color='white' px={10} textAlign='start' fontSize='sm'>Actual Quantity:</Text>
                    <Input
                        onChange={(e) => setQuantity(e.target.value)}
                        disabled={!barcodeData?.orders?.remaining}
                        title={barcodeData?.orders?.remaining ? 'Please enter a quantity' : 'Barcode Number is required'}
                        value={quantity}
                        type="number"
                        onWheel={(e) => e.target.blur()}
                        onKeyDown={(e) => ["E", "e", "+", "-"].includes(e.key) && e.preventDefault()}
                        onPaste={(e) => e.preventDefault()}
                        placeholder='Please enter quantity'
                        h='15%' w='50%' bgColor='#fff8dc'
                    />
                </HStack>
            </HStack>

            <Flex bgColor='gray.200' justifyContent='end' mt={5}>

                {
                }

                <Button
                    onClick={() => openQuantity()}
                    disabled={!warehouseId || !quantity || inputValidate || !barcodeData || quantity > barcodeData?.orders?.remaining}
                    size='sm' colorScheme='blue' px={7}
                >
                    Add
                </Button>

            </Flex>
            {
                <AddQuantityConfirmation
                    isOpen={isQuantity}
                    onClose={closeQuantity}
                    orderNo={orderId}
                    id={highlighterId}
                    itemCode={itemCode}
                    quantityOrdered={quantity}
                    fetchOrderList={fetchOrderList}
                    fetchPreparedItems={fetchPreparedItems}
                    expirationDate={expirationDate}
                    setQuantity={setQuantity}
                    setHighlighterId={setHighlighterId}
                    setWarehouseId={setWarehouseId}
                    warehouseId={warehouseId}
                />
            }

        </Flex>
    )
}
