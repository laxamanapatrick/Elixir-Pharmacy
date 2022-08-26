import { Box, Button, Flex, Heading, Image, Input, Text, useToast, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import apiClient from '../services/apiClient';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import { saltkey } from '../saltkey';
import { ToastComponent } from '../components/Toast';

const loginSchema = yup.object({
    userName: yup.string().required("Username is required"),
    password: yup.string().required("Password is required")
})

const LoginPage = () => {

    const [isLoading, setisLoading] = useState(false)
    const toast = useToast()

    const navigate = useNavigate()

    const { register, handleSubmit, formState: { errors, isValid, isDirty } } = useForm({
        resolver: yupResolver(loginSchema),
        mode: "onChange"
    })
    const submitHandler = (data) => {
        try {
            setisLoading(true)
            const res = apiClient.post("/Login/Authenticate", data).then((res) => {

                var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(res.data), saltkey).toString()
                sessionStorage.setItem('userData', ciphertext)
                setisLoading(false)
                navigate("/")
                window.location.reload(false);
                ToastComponent("Login Success", `Welcome ${data.userName}`, "success", toast)
            }).catch(err => {
                setisLoading(false)
                ToastComponent("Login Error", err.response.data.message, "error", toast)
            })

        } catch (err) {
        }
    }

    return (

        <Flex bgGradient="linear(to-l, secondary, primary)" h='100vh' justifyContent='center' alignItems='center'>
            <form onSubmit={handleSubmit(submitHandler)}>
                <VStack spacing={4} bgColor='gray.600' pl={10} pr={10} pt={4} pb={3} rounded={6}>
                    <VStack>
                        <Image width='85px' src='/images/logo.png'></Image>
                        <Heading color='#18b58f' size='md' fontFamily="">Elixir</Heading>
                    </VStack>
                    <Box>
                        <Input variant='filled' size='sm' autoComplete='off' placeholder='Username' {...register("userName")} />
                        <Text color="danger" fontSize='xs' mt={1}>{errors.userName?.message}</Text>
                    </Box>
                    <Box>
                        <Input variant='filled' size='sm' autoComplete='off' placeholder='Password' type='password' {...register("password")} />
                        <Text color="danger" fontSize='xs' mt={1}>{errors.password?.message}</Text>
                    </Box>
                    <Button width='full' bgColor='#18b58f' size='sm' type='sumbit' disabled={!isValid} isLoading={isLoading}>
                        Login
                    </Button>
                    <Text color='gray.300' fontSize='10px'>© 2022, Elixir Powered by MIS</Text>
                </VStack>
            </form>
        </Flex>

    )
}

export default LoginPage;
