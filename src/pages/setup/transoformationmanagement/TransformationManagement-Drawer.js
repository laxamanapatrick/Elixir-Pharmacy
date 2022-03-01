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


const DrawerComponent = ({ isOpen, onClose, register, errors, isValid, handleSubmit, fetchFormula }) => {
    const [isLoading, setisLoading] = useState(false)
    const [departments, setDepartments] = useState([])
    const [roles, setRoles] = useState([])
    const toast = useToast()

    const submitHandler = (data) => {
        try {
            if (data.formData.id === "") {
                delete data.formData["id"]
                setisLoading(true)
                const res = apiClient.post("Transformation/AddNewTransformationFormula", data.formData).then((res) => {
                    ToastComponent("Success", "New formula created", "success", toast)
                    setisLoading(false)
                    fetchFormula()
                    onClose(onClose)
                }).catch(err => {
                    setisLoading(false)
                    ToastComponent("Error", err.response.data, "error", toast)
                    data.formData.id = "" // add property id to objects for if condition
                })
            } else {
                const res = apiClient.put(`Transformation/UpdateFormulaInfo/${data.formData.id}`, data.formData).then((res) => {
                    ToastComponent("Success", "Formula Updated", "success", toast)
                    setisLoading(false)
                    fetchFormula()
                    onClose(onClose)
                }).catch(err => {
                    ToastComponent("Update Failed", err.response.data, "warning", toast)
                })
            }

        } catch (err) {
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
                                    <FormLabel>Item Code:</FormLabel>
                                    <Input
                                        placeholder='Please enter Item Code'
                                        {...register("formData.itemCode")}
                                    />
                                    <Text color="danger" fontSize="xs">{errors.formData?.itemCode?.message}</Text>
                                </Box>

                                <Box>
                                    <FormLabel>Item Description:</FormLabel>
                                    <Input
                                        placeholder='Please enter Item Description'
                                        {...register("formData.itemDescription")}
                                        autoComplete='off'
                                    />
                                    <Text color="danger" fontSize="xs">{errors.formData?.itemDescription?.message}</Text>
                                </Box>

                                <Box>
                                    <FormLabel>Quantity:</FormLabel>
                                    <Input
                                        placeholder='Please enter Quantity'
                                        {...register("formData.quantity")}
                                    />
                                    <Text color="danger" fontSize="xs">{errors.formData?.quantity?.message}</Text>
                                </Box>

                                <Flex mt={1.5}></Flex>

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