import { Box, Button, FormControl, Input, InputAdornment, InputLabel, TextField, Typography } from "@mui/material"
import { Formik } from "formik";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useRegisterMutation } from "../../../app/baseQuery";
import { useDispatch } from "react-redux";
import { changeActiveForm } from "../../../app/store/authMenuSlice";

const RegisterForm = () =>{
    const [triggerRegister] = useRegisterMutation()
    const dispatch = useDispatch()
    return (
        <Formik
            initialValues={{ name: '', email: '',  password: '',  repeatPassword: '', edrpou: '' }}
            validate={values => {
                const errors = {name: '', email: '',  password: '',  repeatPassword: '', edrpou: '' };
                if (!values.email) {
                    errors.email = 'Обов\'язкове';
                } else if (
                    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                ) {
                    errors.email = 'Не правильна адреса';
                } else {
                    errors.email = ''
                }
                if (!values.password || !values.repeatPassword) {
                    errors.password="Обов\'язкове";
                    errors.repeatPassword="Обов\'язкове";
                } else if (
                    values.password !== values.repeatPassword
                ) {
                    errors.password="Паролі не співпадають";
                    errors.repeatPassword="Паролі не співпадають";
                } else {
                    errors.password = ''
                    errors.repeatPassword = ''
                }
                if (!values.name){
                    errors.name  = 'Обов\'язкове'
                } else {
                    errors.name =''
                }
                if (errors.email || errors.name || errors.password || errors.repeatPassword){
                    return errors;
                }
            }}
            onSubmit={(values, { setSubmitting }) => {
                triggerRegister({
                    username: values.name,
                    email: values.email,
                    password1: values.password,
                    password2: values.password,
                    edrpou: values.edrpou,
                  }).then(()=>{
                    dispatch(changeActiveForm('log'))
                  })
            }}
        >
       {({
         values,
         errors,
         touched,
         handleChange,
         handleBlur,
         handleSubmit,
         isSubmitting,
         /* and other goodies */
       }) => (
         <form onSubmit={handleSubmit} style={{ width: '80%', marginTop: '24px' }}>
           <FormControl variant="standard" sx={{ width: '100%' }}>
           <Typography
                sx={{
                    marginTop: '16px',
                }}
            >
                Ім'я
            </Typography>
           <TextField
                placeholder="example@gmail.com"
                id="input-with-icon-textfield"
                name="name"
                onChange={handleChange}
                value={values.name}
                sx={{
                    width: '100%'
                }}
                error={!!errors?.name}
            />
                {errors?.name || ''}
             <Typography
                sx={{
                    marginTop: '16px',
                }}
            >
                Пошта
            </Typography>
           <TextField
                placeholder="example@gmail.com"
                id="input-with-icon-textfield"
                label=""
                name="email"
                onChange={handleChange}
                value={values.email}
                sx={{
                    width: '100%',
                }}
                error={!!errors?.email}
            />
            {errors?.email || ''}
            <Typography
                sx={{
                    marginTop: '16px',
                }}
            >
                Пароль
            </Typography>
           <TextField
                placeholder="*******"
                id="input-with-icon-textfield"
                type="password"
                name="password"
                onChange={handleChange}
                value={values.password}
                sx={{
                    width: '100%'
                }}
                error={!!errors?.password}
            />
            {errors?.password || ''}
            <Typography
                sx={{
                    marginTop: '16px',
                }}
                >
                Повторити
            </Typography>
           <TextField
                placeholder="*******"
                id="input-with-icon-textfield"
                type="password"
                name="repeatPassword"
                onChange={handleChange}
                value={values.repeatPassword}
                sx={{
                    width: '100%'
                }}
                error={!!errors?.repeatPassword}
                />
            {errors?.repeatPassword || ''}
            <Typography>
                Код ЄДРПОУ
            </Typography>
            <TextField
                type='password'
                placeholder="*******"
                id="input-with-icon-textfield"
                name="edrpou"
                onChange={handleChange}
                label=""
                sx={{
                    width: '100%'
                }}
                error={!!errors?.edrpou}
            />
            <Button
                type="submit"
                variant="contained"
                sx={{
                    marginTop: '32px'
                }}
            >
                Зареєструватись
            </Button>
            </FormControl>
         </form>
       )}
     </Formik>
    )
}
export default RegisterForm