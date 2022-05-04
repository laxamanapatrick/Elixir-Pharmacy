//Drawer for Setup - Transformation Management only

import {
    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    FormLabel,
    Input,
    Select,
    Stack,
    Text,
    useToast,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import apiClient from '../../../services/apiClient'
import { ToastComponent } from '../../../components/Toast';


const DrawerComponent = ({ isOpen, onClose, register, errors, isValid, handleSubmit, setValue, fetchFormula }) => {

    const [isLoading, setisLoading] = useState(false)
    const [rawMats, setRawMats] = useState([])
    const toast = useToast()

    const submitHandler = (data) => {
        try {
            if (data.formData.id === "") {
                delete data.formData["id"]
                setisLoading(true)
                const res = apiClient.post("Transformation/AddNewTransformationFormula", data.formData).then((res) => {
                    ToastComponent("Success!", "New formula created", "success", toast)
                    setisLoading(false)
                    fetchFormula()
                    onClose(onClose)
                }).catch(err => {
                    setisLoading(false)
                    ToastComponent("Error", err.response.data, "error", toast)
                    data.formData.id = "" // add property id to objects for if condition
                })
            }
            else {
                const res = apiClient.put(`Transformation/UpdateFormulaInfo/${data.formData.id}`, data.formData).then((res) => {
                    ToastComponent("Success!", "Formula Updated", "success", toast)
                    setisLoading(false)
                    fetchFormula()
                    onClose(onClose)
                }).catch(err => {
                    ToastComponent("Update Failed", err.response.data, "warning", toast)
                })
            }

        }
        catch (err) {
        }
    }

    const fetchRawMaterialsApi = () => {
        const res = apiClient.get('RawMaterial/GetAllActiveRawMaterials')
        return res
    }

    const fetchRawMaterials = () => {
        fetchRawMaterialsApi().then(res => {
            setRawMats(res.data)
        }
        )
    }

    useEffect(() => {
        fetchRawMaterials()
    }, []);


    const itemHandler = (data) => {
        if (data) {
            const newData = JSON.parse(data)
            setValue("formData.itemCode", newData.itemCode)
            setValue("formData.itemDescription", newData.itemDescription)
            setValue("formData.uom", newData.uom)
        } else {
            setValue("formData.itemCode", "")
            setValue("formData.itemDescription", "")
            setValue("formData.uom", "")
        }
    }

    return (
        <Flex>

            <Drawer
                isOpen={isOpen}
                placement='center'
                onClose={onClose}
            >
                <DrawerOverlay />
                <form onSubmit={handleSubmit(submitHandler)}>
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader borderBottomWidth='1px'>
                            Formula Form
                        </DrawerHeader>
                        <DrawerBody>

                            <Stack spacing='7px'>

                                <Box>
                                    <Stack>
                                        <Text fontWeight='semibold'>Item Code:</Text>

                                        {
                                            rawMats.length > 0 ?
                                                (<Select
                                                    onChange={(e) => itemHandler(e.target.value)}
                                                    placeholder='Select Item Code'>
                                                    {rawMats.map(raw => (
                                                        <option key={raw.id} value={JSON.stringify(raw)}>{raw.itemCode}</option>
                                                    ))}
                                                </Select>) : "loading"
                                        }

                                        <Text color="danger" fontSize="xs">{errors.formData?.itemCode?.message}</Text>
                                    </Stack>
                                </Box>

                                <Box>
                                    <FormLabel>Item Code:</FormLabel>
                                    <Input
                                        color='black'
                                        bgColor='gray.300'
                                        readOnly={true}
                                        {...register("formData.itemCode")}
                                    />
                                    <Text color="danger" fontSize="xs">{errors.formData?.itemCode?.message}</Text>
                                </Box>

                                <Box>
                                    <FormLabel>Item Description:</FormLabel>
                                    <Input
                                        color='black'
                                        bgColor='gray.300'
                                        readOnly={true}
                                        {...register("formData.itemDescription")}
                                    />
                                    <Text color="danger" fontSize="xs">{errors.formData?.itemDescription?.message}</Text>
                                </Box>

                                <Box>
                                    <FormLabel>UOM:</FormLabel>
                                    <Input
                                        color='black'
                                        bgColor='gray.300'
                                        readOnly={true}
                                        {...register("formData.uom")}
                                    />
                                    <Text color="danger" fontSize="xs">{errors.formData?.uom?.message}</Text>
                                </Box>

                                <Box>
                                    <FormLabel>Quantity:</FormLabel>
                                    <Input
                                        {...register("formData.quantity")}
                                        placeholder='Please enter Quantity'
                                    />
                                    <Text color="danger" fontSize="xs">{errors.formData?.quantity?.message}</Text>
                                </Box>

                            </Stack>

                        </DrawerBody>

                        <DrawerFooter borderTopWidth='1px'>
                            <Button variant='outline' mr={3} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button
                                type='submit'
                                bgColor='secondary'
                                color='white'
                                _hover={{ bgColor: 'accent' }}
                                disabled={!isValid}
                                isLoading={isLoading}
                            >
                                Submit
                            </Button>
                        </DrawerFooter>

                    </DrawerContent>
                </form>
            </Drawer>
        </Flex>


    )
}

export default DrawerComponent