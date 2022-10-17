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
    HStack,
    Input,
    Select,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    VStack,
    useDisclosure,
    useToast,
    Stack,
    Skeleton,
    Table,
    Popover,
    PopoverTrigger,
    Portal,
    PopoverContent,
    PopoverArrow,
    PopoverCloseButton,
    PopoverBody,
    InputGroup,
    InputRightElement
} from '@chakra-ui/react';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai'
import React, { useEffect, useState } from 'react';
import apiClient from '../../services/apiClient';
import { ToastComponent } from '../../components/Toast';
// import { decodeUser } from '../../services/decode-user';
// import { yupResolver } from '@hookform/resolvers/yup';
// import * as yup from "yup";
// import { useForm } from 'react-hook-form';
// import PageScroll from '../../components/PageScroll';
// import { RiEditBoxFill } from 'react-icons/ri';
// import { GiChoice } from 'react-icons/gi';
// import { FcAddDatabase } from 'react-icons/fc';


const DrawerComponent = ({ isOpen, onClose, register, errors, isValid, handleSubmit, fetchUsers, disableEdit }) => {
    const [isLoading, setisLoading] = useState(false)
    const [departments, setDepartments] = useState([])
    const [roles, setRoles] = useState([])
    const toast = useToast()
    // const { isOpen: isModalOpen, onOpen: openModal, onClose: closeModal } = useDisclosure()

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
                    ToastComponent("Update Failed", err.response.data, "warning", toast)
                })
            }

        } catch (err) {
        }
    }

    const fetchDepartments = async () => {
        try {
            const res = await apiClient.get('User/GetDepartmentByStatus/true')
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

    // const departmentModalHandler = () => {
    //     openModal()
    //     // onClose()
    // }

    const [showPassword, setShowPassword] = useState(false)

    return (
        <Flex>

            <Drawer
                isOpen={isOpen}
                placement='right'
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
                                        bgColor={disableEdit ? 'gray.200' : 'none'}
                                        disabled={disableEdit}
                                        readOnly={disableEdit}
                                        title={disableEdit ? 'Username is not editable' : ''}
                                    />
                                    <Text color="danger" fontSize="xs">{errors.formData?.userName?.message}</Text>
                                </Box>

                                <Box>
                                    <FormLabel>Password:</FormLabel>
                                    <InputGroup>
                                        <Input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder='Please enter Password'
                                            {...register("formData.password")}
                                        />
                                        <InputRightElement width='4.5rem'>
                                            <Button background='none' h='1.75rem' size='sm' onClick={() => setShowPassword(!showPassword)}>
                                                {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
                                            </Button>
                                        </InputRightElement>
                                    </InputGroup>
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
                                                <HStack>
                                                    {/* <Button
                                                        onClick={departmentModalHandler}
                                                    >
                                                        Add
                                                    </Button> */}
                                                    <Select
                                                        {...register("formData.departmentId")}
                                                        placeholder='Select'>
                                                        {departments.map(dep => (
                                                            <option key={dep.id} value={dep.id}>{dep.departmentName}</option>
                                                        ))}

                                                    </Select>
                                                </HStack>
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
            {/* {
                isModalOpen && (
                    <DepartmentModalComponent
                        isOpen={isModalOpen}
                        onClose={closeModal}
                    />
                )} */}
        </Flex>


    )
}

export default DrawerComponent


// const DepartmentModalComponent = ({ isOpen, onClose }) => {
//     const [departments, setDepartments] = useState([])
//     const [isLoading, setIsLoading] = useState(true)
//     const [status, setStatus] = useState(true)
//     const toast = useToast()
//     const { isOpen: isDrawerOpen, onOpen: openDrawer, onClose: closeDrawer } = useDisclosure()

//     const currentUser = decodeUser()

//     const schema = yup.object().shape({
//         formData: yup.object().shape({
//             id: yup.string(),
//             departmentName: yup.string().required("Department name is required"),
//         })
//     })

//     const { register, handleSubmit, formState: { errors, isValid }, setValue, reset } = useForm({
//         resolver: yupResolver(schema),
//         mode: "onChange",
//         defaultValues: {
//             formData: {
//                 id: "",
//                 departmentName: "",
//                 addedBy: currentUser.addedBy
//             }
//         }
//     })


//     const fetchDepartmentsApi = async (status) => {
//         const res = await apiClient.get(`User/GetDepartmentByStatus/${status}`)
//         return res.data
//     }

//     const fetchDepartments = () => {
//         fetchDepartmentsApi(status).then(res => {
//             setDepartments(res)
//         })
//     }

//     useEffect(() => {
//         fetchDepartments()
//         setIsLoading(false)
//     }, [status])

//     const statusHandler = (data) => {
//         setStatus(data)
//     }

//     const changeStatusHandler = (id, status) => {
//         let routeLabel;
//         if (status) {
//             routeLabel = "InActiveDepartment"
//         } else {
//             routeLabel = "ActivateDepartment"
//         }

//         apiClient.put(`User/${routeLabel}/${id}`, { id: id }).then((res) => {
//             ToastComponent("Success", "Deparment Updated", "success", toast)
//             fetchDepartments()
//         }).catch(err => {
//             console.log(err);
//         })
//     }

//     const editHandler = (dep) => {
//         openDrawer();
//         setValue("formData", {
//             id: dep.id,
//             departmentName: dep.departmentName,
//         }, { shouldValidate: true })

//     }

//     const newDepartmentHandler = () => {
//         openDrawer()
//         reset()
//     }

//     return (
//         <Flex>
//             <Modal
//                 size='5xl'
//                 isOpen={isOpen} onClose={onClose}
//             >

//                 <ModalOverlay />
//                 <ModalContent>
//                     <ModalHeader>
//                         <Text>Departments Table</Text>
//                     </ModalHeader>
//                     <ModalCloseButton />

//                     <ModalBody>

//                         <Flex p={1} w="full" flexDirection="column">

//                             <Flex mb={2.5} justifyContent='end'>
//                                 <HStack>
//                                     <Text>STATUS: </Text>
//                                     <Select onChange={(e) => statusHandler(e.target.value)}>
//                                         <option value={true}>Active</option>
//                                         <option value={false}>Inactive</option>
//                                     </Select>
//                                 </HStack>
//                             </Flex>

//                             <PageScroll>
//                                 {
//                                     isLoading ? (
//                                         <Stack width="full">
//                                             <Skeleton height='20px' />
//                                             <Skeleton height='20px' />
//                                             <Skeleton height='20px' />
//                                             <Skeleton height='20px' />
//                                             <Skeleton height='20px' />
//                                             <Skeleton height='20px' />
//                                         </Stack>
//                                     ) : (
//                                         <Table variant='striped' size='sm'>
//                                             <Thead>
//                                                 <Tr bgColor='secondary'>
//                                                     <Th color='white'>Id</Th>
//                                                     <Th color='white'>Department Name</Th>
//                                                     <Th color='white'>Added By</Th>
//                                                     <Th color='white'>Date Added</Th>
//                                                     <Th color='white'>Actions</Th>
//                                                 </Tr>
//                                             </Thead>
//                                             <Tbody>
//                                                 {departments?.map(dep =>
//                                                     <Tr key={dep.id}>
//                                                         <Td>{dep.id}</Td>
//                                                         <Td>{dep.departmentName}</Td>
//                                                         <Td>{dep.addedBy}</Td>
//                                                         <Td>{dep.dateAdded}</Td>
//                                                         <Td>

//                                                             <Button p={0} background='none' color='secondary' onClick={() => editHandler(dep)}>
//                                                                 <RiEditBoxFill />
//                                                             </Button>

//                                                             <Popover>
//                                                                 <PopoverTrigger>
//                                                                     <Button p={0} background='none'><GiChoice /></Button>
//                                                                 </PopoverTrigger>
//                                                                 <Portal>
//                                                                     <PopoverContent>
//                                                                         <PopoverArrow />
//                                                                         <PopoverCloseButton />
//                                                                         <PopoverBody>
//                                                                             <VStack>
//                                                                                 {dep.isActive === true ? <Text>Are you sure you want to set this department inactive?</Text> : <Text>Are you sure you want to set this department active?</Text>}
//                                                                                 <Button bgColor='secondary' color='white' _hover={{ bgColor: 'accent' }} onClick={() => changeStatusHandler(dep.id, dep.isActive)}>Yes</Button>
//                                                                             </VStack>
//                                                                         </PopoverBody>
//                                                                     </PopoverContent>
//                                                                 </Portal>
//                                                             </Popover>

//                                                         </Td>
//                                                     </Tr>
//                                                 )
//                                                 }
//                                             </Tbody>
//                                         </Table>
//                                     )
//                                 }
//                             </PageScroll>
//                             <Flex justifyContent='space-between' mt={5}>
//                                 <Button leftIcon={<FcAddDatabase color='white' />} bgColor='secondary' onClick={newDepartmentHandler} _hover={{ bgColor: 'accent' }}>
//                                     <Text color='white'>New Deparment</Text>
//                                 </Button>
//                                 {
//                                     isDrawerOpen && (
//                                         <DepartmentFormComponent
//                                             isOpen={isDrawerOpen}
//                                             onClose={closeDrawer}
//                                             register={register}
//                                             errors={errors}
//                                             isValid={isValid}
//                                             handleSubmit={handleSubmit}
//                                             fetchDepartments={fetchDepartments}
//                                         />
//                                     )
//                                 }
//                             </Flex>
//                         </Flex>



//                     </ModalBody>

//                     {/* <ModalFooter>
//                         <Button
//                             disabled={!isValid}
//                             isLoading={isLoading}
//                             bgColor='secondary' color='white' _hover={{ bgColor: 'accent' }} mr={3}
//                         >
//                             Submit
//                         </Button>
//                         <Button variant='ghost' onClick={onClose}>Close</Button>
//                     </ModalFooter> */}
//                 </ModalContent >
//             </Modal >

//         </Flex>
//     )
// }


// const DepartmentFormComponent = ({ isOpen, onClose, register, errors, isValid, handleSubmit, fetchDepartments }) => {
//     const [isLoading, setisLoading] = useState(false)
//     const toast = useToast()

//     const submitHandler = (data) => {
//         try {
//             if (data.formData.id === "") {
//                 delete data.formData["id"]
//                 setisLoading(true)
//                 const res = apiClient.post("User/AddNewDepartment", data.formData).then((res) => {
//                     ToastComponent("Success", "New department created", "success", toast)
//                     setisLoading(false)
//                     fetchDepartments()
//                     onClose(onClose)
//                 }).catch(err => {
//                     setisLoading(false)
//                     ToastComponent("Error", err.response.data, "error", toast)
//                 })
//             } else {
//                 const res = apiClient.put(`User/UpdateDepartmentInfo/${data.formData.id}`, data.formData).then((res) => {
//                     ToastComponent("Success", "Department Updated", "success", toast)
//                     setisLoading(false)
//                     fetchDepartments()
//                     onClose(onClose)
//                 }).catch(err => {
//                     ToastComponent("Update Failed", err.response.data, "warning", toast)
//                 })
//             }

//         } catch (err) {
//         }
//     }

//     return (
//         <Flex>

//             <Drawer
//                 isOpen={isOpen}
//                 placement='center'
//                 onClose={onClose}
//             >
//                 <DrawerOverlay />
//                 <form onSubmit={handleSubmit(submitHandler)}>
//                     <DrawerContent>
//                         <DrawerCloseButton />
//                         <DrawerHeader borderBottomWidth='1px'>
//                             Department Form
//                         </DrawerHeader>
//                         <DrawerBody>

//                             <Stack spacing='7px'>

//                                 <Flex mt={1.5}></Flex>

//                                 <Box>
//                                     <FormLabel>Department Name:</FormLabel>
//                                     <Input
//                                         placeholder='Please enter Department Name'
//                                         {...register("formData.departmentName")}
//                                     />
//                                     <Text color="danger" fontSize="xs">{errors.formData?.departmentName?.message}</Text>
//                                 </Box>

//                             </Stack>

//                         </DrawerBody>

//                         <DrawerFooter borderTopWidth='1px'>
//                             <Button variant='outline' mr={3} onClick={onClose}>
//                                 Cancel
//                             </Button>
//                             <Button
//                                 type='submit'
//                                 bgColor='secondary'
//                                 color='white'
//                                 _hover={{ bgColor: 'accent' }}
//                                 disabled={!isValid}
//                                 isLoading={isLoading}
//                             >
//                                 Submit
//                             </Button>
//                         </DrawerFooter>

//                     </DrawerContent>
//                 </form>
//             </Drawer>
//         </Flex>


//     )
// }