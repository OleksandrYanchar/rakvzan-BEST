import { Box, Button, Drawer, Typography } from "@mui/material";
import { FC, ReactNode, useState } from "react";
import {ReactComponent as LogoImage} from '../../../app/assets/images/logo.svg'
import { useDispatch } from "react-redux";
import { changeActiveForm, changeOpenState } from "../../../app/store/authMenuSlice";
import LoginPage from "../../auth/loginPage/LoginPage";
import UserPage from "../../userPage/UserPage";
import { Link } from "react-router-dom";

const Header = () => {

    const dispatch = useDispatch()
    const [isAccountPageOpen, setIsAccountPageOpen] = useState<boolean>(false)
    
    return (
        <Box
            sx={{
                display : 'flex',
                justifyContent: 'space-between',
                padding: '19px 42px'
            }}
        >
            {/* <Drawer 
                anchor="top" 
                open={isAccountPageOpen} 
                onClose={() => setIsAccountPageOpen(false)}
            >
                <UserPage
                    handleClose={() => setIsAccountPageOpen(false)}
                />
            </Drawer>
            <LoginPage/>
            <Box>
                <Link to='/'>
                    <LogoImage
                        style={{
                            width: 'auto',
                            height: '40px'
                        }}
                        />
                </Link>
            </Box>
            {localStorage.getItem('username')?
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                <Typography 
                    variant="subtitle2"
                    onClick={()=>{
                        setIsAccountPageOpen(!isAccountPageOpen)
                    }}
                >
                    {localStorage.getItem('username')}
                </Typography>
                <Button
                    onClick={()=>{
                        localStorage.clear()
                        window.location.reload()
                    }}
                >
                    Вийти
                </Button>
            </Box>    
            :
                <Box>
                    <Button
                        sx={{
                            height: '36px'
                        }}
                        variant="contained"
                        onClick={()=>{
                            dispatch(changeOpenState(true))
                            dispatch(changeActiveForm('log'))
                        }}
                    >
                        Увійти
                    </Button>
                    <Button
                        variant="outlined"
                        sx={{
                            marginLeft: '16px',
                            height: '36px',
                        }}
                        onClick={()=>{
                            dispatch(changeOpenState(true))
                            dispatch(changeActiveForm('reg'))
                        }}
                    >
                        Зареєструватись
                    </Button>
                </Box>
            
            } */}
        </Box>
    );
};

export default Header;