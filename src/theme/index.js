import { createStandaloneToast, extendTheme, withDefaultColorScheme, withDefaultVariant } from '@chakra-ui/react'


const theme = extendTheme({
    colors: {
        primary: "#27273A",
        secondary: "#33334C",
        accent: "#87CEAA",
        warning: "#eed202",
        success: "#48bb78",
        danger: "#f56565",
    },
    components: {
        Input: {
            variants: {
                filled: {
                    field: {
                        backgroundColor: "secondary",
                        color: 'white',
                        _focus: {
                            borderColor: "accent",
                        },
                        _active: {
                            borderColor: "accent",
                        },
                        _hover: {
                            backgroundColor: "secondary",
                            borderColor: "accent",
                        }
                    },
                },
            },
        }
    }
})

// const [successToast, errorToast] = createStandaloneToast()

// successToast({
//     title: "Login Successful",
//     description: "Welcome",
//     status: 'success',
//     position: 'top-right',
//     duration: 4000,
//     isClosable: true,
// })

// errorToast({
//     title: "Invalid Credentials",
//     description: "Please try again",
//     status: 'error',
//     position: 'top-right',
//     duration: 4000,
//     isClosable: true,
// })

export default theme