//Drawer for User Account only

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
import apiClient from '../../services/apiClient';
import { ToastComponent } from '../../components/Toast';


const DrawerComponent = ({ isOpen, onClose, register, errors, isValid, handleSubmit, fetchUsers }) => {
    const [isLoading, setisLoading] = useState(false)
    const [departments, setDepartments] = useState([])
    const [roles, setRoles] = useState([])
    const toast = useToast()

    const submitHandler = (data) => {
        try {
            if (data.formData.id === "") {
                delete data.formData["id"]
                setisLoading(true)
                const res = apiClient.post("User/AddNewUser", data.formData).then((res) => {
                    ToastComponent("Success", "New user created", "success", toast)
                    setisLoading(false)
                    fetchUsers()
                    onClose(onClose)
                }).catch(err => {
                    setisLoading(false)
                    ToastComponent("Error", err.response.data, "error", toast)
                    data.formData.id = "" // add property id to objects for if condition
                })
            } else {
                const res = apiClient.put(`/User/UpdateUserInfo/${data.formData.id}`, data.formData).then((res) => {
                    ToastComponent("Success", "User Updated", "success", toast)
                    setisLoading(false)
                    fetchUsers()
                    onClose(onClose)
                }).catch(err => {
                    ToastComponent("Update Failed", err.response.data , "warning", toast)
                })
            }

        } catch (err) {
        }
    }

    const fetchDepartments = async () => {
        try {
            const res = await apiClient.get('User/GetAllDepartments')
            setDepartments(res.data)
        } catch (error) {
        }
    }

    useEffect(() => {
        try {
            fetchDepartments()
        } catch (error) {
        }
    }, []);

    const fetchRoles = async () => {
        try {
            const res = await apiClient.get('Role/GetAllActiveRoles')
            setRoles(res.data)
        } catch (error) {
        }
    }

    useEffect(() => {
        try {
            fetchRoles()
        } catch (error) {

        }
    }, []);


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
                            User Form
                        </DrawerHeader>
                        <DrawerBody>

                            <Stack spacing='7px'>
                                
                                <Box>
                                    <FormLabel>Full Name:</FormLabel>
                                    <Input
                                        placeholder='Please enter Full Name'
                                        {...register("formData.fullName")}
                                    />
                                    <Text color="danger" fontSize="xs">{errors.formData?.fullName?.message}</Text>
                                </Box>

                                <Box>
                                    <FormLabel>Username:</FormLabel>
                                    <Input
                                        id='username'
                                        placeholder='Please enter Username'
                                        {...register("formData.userName")}
                                        autoComplete='off'
                                    />
                                    <Text color="danger" fontSize="xs">{errors.formData?.userName?.message}</Text>
                                </Box>

                                <Box>
                                    <FormLabel>Password:</FormLabel>
                                    <Input
                                        id='password'
                                        placeholder='Please enter Password'
                                        {...register("formData.password")}
                                    />
                                    <Text color="danger" fontSize="xs">{errors.formData?.password?.message}</Text>
                                </Box>

                                <Flex mt={1.5}></Flex>

                                <Box>
                                    <Stack>
                                        <Text fontWeight='semibold'>Role:</Text>
                                        {
                                            roles.length > 0 ? (<Select
                                                {...register("formData.userRoleId")}
                                                placeholder='Select role'>
                                                {roles.map(rol => (
                                                    <option key={rol.id} value={rol.id}>{rol.roleName}</option>
                                                ))}

                                            </Select>) : "loading"
                                        }

                                        <Text color="danger" fontSize="xs">{errors.formData?.userRoleId?.message}</Text>
                                    </Stack>
                                </Box>

                                <Box>
                                    <Stack>
                                        <Text fontWeight='semibold'>Department:</Text>
                                        {
                                            departments.length > 0 ? (
                                                <Select
                                                    {...register("formData.departmentId")}
                                                    placeholder='Select'>
                                                    {departments.map(dep => (
                                                        <option key={dep.id} value={dep.id}>{dep.departmentName}</option>
                                                    ))}

                                                </Select>
                                            ) : "loading"
                                        }

                                        <Text color="danger" fontSize="xs">{errors.formData?.departmentId?.message}</Text>
                                    </Stack>
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